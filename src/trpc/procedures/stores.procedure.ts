import { db } from "@/db";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
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
  getStoresByUser: protectedProcedure.query(async ({ ctx }) => {
    const { auth } = ctx;

    const data = await db
      .select()
      .from(stores)
      .where(eq(stores.ownerId, auth.user.id));

    return data;
  }),
  createStore: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { auth } = ctx;

      const [newStore] = await db
        .insert(stores)
        .values({
          name: input.name,
          ownerId: auth.user.id,
        })
        .returning();

      return newStore;
    }),
});
