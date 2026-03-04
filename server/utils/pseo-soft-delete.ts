import { eq, and, isNull, type SQL, type AnyColumn } from "drizzle-orm";
import { db } from "../db";
import type { PgTable } from "drizzle-orm/pg-core";

type TableWithDeletedAt = PgTable & {
  deletedAt: AnyColumn;
  id: AnyColumn;
};

export async function softDelete<T extends TableWithDeletedAt>(
  table: T,
  id: string
): Promise<void> {
  await db
    .update(table)
    .set({ deletedAt: new Date() } as any)
    .where(eq(table.id, id));
}

export async function softDeleteWhere<T extends TableWithDeletedAt>(
  table: T,
  conditions: SQL
): Promise<number> {
  const result = await db
    .update(table)
    .set({ deletedAt: new Date() } as any)
    .where(and(conditions, isNull(table.deletedAt)))
    .returning({ id: table.id as any });
  return result.length;
}

export function isDeleted(record: { deletedAt?: Date | null }): boolean {
  return record.deletedAt != null;
}

export function excludeDeleted<T extends TableWithDeletedAt>(table: T): SQL {
  return isNull(table.deletedAt);
}

export async function restoreSoftDeleted<T extends TableWithDeletedAt>(
  table: T,
  id: string
): Promise<void> {
  await db
    .update(table)
    .set({ deletedAt: null } as any)
    .where(eq(table.id, id));
}
