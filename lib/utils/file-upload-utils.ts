import { z } from "zod";
import { db } from "@/utils/db";
import { files } from "@/utils/db/schema/files";
import { eq, and, gte, count } from "drizzle-orm";

export const formSchema = z.object({
  teamId: z.string().cuid().optional(),
});

export const MAX_BYTES = 3 * 1024 * 1024; // 3MB
export const UPLOADS_PER_HOUR = 10;
const Bucket = process.env.SUPABASE_S3_BUCKET as string;


/** --------- Helpers --------- */
export function allowedKind(name: string, mime: string | null | undefined): "CSV" | "XLSX" | null {
  const ext = name.toLowerCase().split(".").pop() || "";
  const m = (mime || "").toLowerCase();

  const csvMimes = new Set([
    "text/csv",
    "application/csv",
    "text/plain",
    "application/vnd.ms-excel", // some browsers send this for csv
  ]);
  const xlsxMimes = new Set([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]);

  if (ext === "csv" && (m === "" || csvMimes.has(m))) return "CSV";
  if ((ext === "xlsx" || ext === "xlsm") && (m === "" || xlsxMimes.has(m))) return "XLSX";
  // fallback: decide by extension if mime is weird but extension is correct
  if (ext === "csv") return "CSV";
  if (ext === "xlsx" || ext === "xlsm") return "XLSX";
  return null;
}

export function objectKey(userId: string, originalName: string) {
  const safeName = originalName.replace(/[^\w.\-]+/g, "_").slice(0, 200);
  const ts = Date.now();
  return `uploads/${userId}/${ts}-${safeName}`;
}

export async function enforceRateLimit({
  userId,
  teamId,
}: {
  userId?: string;
  teamId?: string;
}) {
  const since = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
  
  const conditions = [gte(files.createdAt, since)];
  
  if (teamId) {
    conditions.push(eq(files.teamId, teamId));
  } else if (userId) {
    conditions.push(eq(files.userId, userId));
  }

  const result = await db
    .select({ count: count() })
    .from(files)
    .where(and(...conditions));

  const fileCount = result[0]?.count ?? 0;
  
  if (fileCount >= UPLOADS_PER_HOUR) {
    throw new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        detail: `You can upload up to ${UPLOADS_PER_HOUR} files per hour.`,
      }),
      { status: 429 }
    );
  }
}


export function publicUrlFromKey(key: string) {
  // If you exposed the bucket as public, you can build a URL like this:
  const base = process.env.SUPABASE_PUBLIC_URL;
  if (!base) return null;
  // NOTE: This assumes your bucket is public. If it’s private, you’ll sign URLs elsewhere.
  return `${base}/${Bucket}/${encodeURI(key)}`;
}
