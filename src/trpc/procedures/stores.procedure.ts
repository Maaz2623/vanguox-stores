import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "../init";
import { stores } from "@/db/schema";
import z from "zod";
import { eq } from "drizzle-orm";

export const storesRouter = createTRPCRouter({
  deleteByStoreName: baseProcedure
    .input(
      z.object({
        storeName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [deletedStore] = await db
        .delete(stores)
        .where(eq(stores.name, input.storeName))
        .returning();

      return deletedStore.name;
    }),
  getStoresByUser: baseProcedure.query(async () => {
    const data = await db.select().from(stores);

    return data;
  }),
  createStore: baseProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [newStore] = await db
        .insert(stores)
        .values({
          name: input.name,
        })
        .returning();

      return newStore;
    }),
});
