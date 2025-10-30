import { db } from "@/utils/db";
import { files } from "@/utils/db/schema/files";
import { eq, and } from "drizzle-orm";

export async function findExistingByChecksum({
  checksum,
  userId,
  teamId,
  name,
}: {
  checksum: string;
  userId?: string;
  teamId?: string;
  name: string;
}) {
  const conditions = [
    eq(files.checksum, checksum),
    eq(files.name, name),
  ];

  if (teamId) {
    conditions.push(eq(files.teamId, teamId));
  } else if (userId) {
    conditions.push(eq(files.userId, userId));
  }

  const result = await db
    .select()
    .from(files)
    .where(and(...conditions))
    .limit(1);

  return result[0] ?? null;
}

export const createFile = async ({
  name,
  kind,
  mimeType,
  size,
  url,
  provider,
  bucket,
  key,
  checksum,
  userId,
  teamId,
}: {
  name: string;
  kind: "CSV" | "XLSX";
  mimeType: string;
  size: number;
  url: string;
  provider: string;
  bucket: string;
  key: string;
  checksum: string;
  userId?: string;
  teamId?: string;
}) => {
  const result = await db
    .insert(files)
    .values({
      name,
      kind,
      mimeType,
      size,
      url,
      provider,
      bucket,
      key,
      checksum,
      userId,
      teamId,
    })
    .returning();

  return result[0];
};