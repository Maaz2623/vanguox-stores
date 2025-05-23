import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "../init";
import { stores } from "@/db/schema";
import z from "zod";

export const storesRouter = createTRPCRouter({
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
