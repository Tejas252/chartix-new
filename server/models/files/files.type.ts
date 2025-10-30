import { files } from "@/utils/db/schema";

export type NewFile = typeof files._.inferInsert
export type File = typeof files._.inferSelect
