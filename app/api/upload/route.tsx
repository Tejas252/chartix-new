import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
import { allowedKind, enforceRateLimit, objectKey, publicUrlFromKey } from "@/lib/utils/file-upload-utils";
import { createFile, findExistingByChecksum } from "@/server/models/files/files.service";
import { createNewConversation } from "@/server/models/conversations/conversations.service";
import { requireUser } from "@/lib/auth";
import { getS3Client } from "@/lib/s3";
import { User } from "@/server/models/users/users.type";

/** --------- Config --------- */
export const runtime = "nodejs";

const MAX_BYTES = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) * 1024 * 1024 : 3 * 1024 * 1024; // 3MB

const Bucket = process.env.SUPABASE_S3_BUCKET as string;

const formSchema = z.object({
  teamId: z.string().cuid().optional(),
});

/** --------- Handler --------- */
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser() as User;

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json({ error: "Use multipart/form-data" }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const parsed = formSchema.safeParse({ teamId: form.get("teamId") || undefined });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fields", issues: parsed.error.issues }, { status: 400 });
    }
    const { teamId } = parsed.data;

    if (!file) {
      return NextResponse.json({ error: "file is required (CSV or XLSX)" }, { status: 400 });
    }

    // Size limit
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }
    if (buf.length > MAX_BYTES) {
      return NextResponse.json({ error: `Max file size is ${MAX_BYTES / 1024 / 1024} MB` }, { status: 413 });
    }

    // Type validation
    const kind = allowedKind(file.name, file.type);
    if (!kind) {
      return NextResponse.json(
        { error: "Only CSV or XLSX files are allowed" },
        { status: 415 }
      );
    }

    // Rate limit (per user or per team)
    await enforceRateLimit({ userId: teamId ? undefined : user.id, teamId: teamId || undefined });

    // Checksum for dedupe
    const checksum = crypto.createHash("sha256").update(buf).digest("hex");

    const existing = await findExistingByChecksum({
      checksum,
      userId: teamId ? undefined : user.id,
      teamId: teamId || undefined,
      name: file.name,
    });

    if (existing) {
      // Create a conversation scaffold even if we reuse the existing file
      const convo = await createNewConversation({
        title: `Chat for ${existing.name}`,
        userId: teamId ? undefined : user.id,
        teamId: teamId || undefined,
        fileId: existing.id,
      });
      return NextResponse.json(
        {
          file: existing,
          conversationId: convo.id,
          deduplicated: true,
        },
        { status: 200 }
      );
    }

    // Upload to Supabase S3
    const s3 = getS3Client();
    const Key = objectKey(user.id, file.name);
    // Optional: short-circuit if object already exists at same key (rare)
    try {
      await s3.send(new HeadObjectCommand({ Bucket, Key }));
      // fallback: if same key exists, add a random suffix
      const rand = crypto.randomBytes(3).toString("hex");
      const parts = Key.split("/");
      const last = parts.pop()!;
      const suffixed = `${last.replace(/(\.[^.]*)?$/, `-${rand}$1`)}`;
      parts.push(suffixed);
      // recompute Key
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      (Key as any) = parts.join("/");
    } catch {
      // not found -> proceed
    }

    await s3.send(
      new PutObjectCommand({
        Bucket,
        Key,
        Body: buf,
        ContentType:
          file.type ||
          (kind === "CSV"
            ? "text/csv"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
        // Remove ContentMD5 as it can cause signature issues with some S3-compatible services like R2
      })
    );

    const url = publicUrlFromKey(Key) ?? `s3://${Bucket}/${Key}`;

    // Persist File row
    const created = await createFile({
      name: file.name,
      kind,
      mimeType:
        file.type ||
        (kind === "CSV"
          ? "text/csv"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
      size: buf.length,
      url,
      provider: "supabase-s3",
      bucket: Bucket,
      key: Key,
      checksum,
      userId: teamId ? undefined : user.id,
      teamId: teamId || undefined,
    });

    // Create a conversation scaffold so the user can start chatting
    const convo = await createNewConversation({
      title: `Chat for ${created.name}`,
      userId: teamId ? undefined : user.id,
      teamId: teamId || undefined,
      fileId: created.id,
    });

    return NextResponse.json(
      {
        file: created,
        conversationId: convo.id,
        deduplicated: false,
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof Response) return err; // thrown by requireUser or rate-limit

    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed", detail: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

