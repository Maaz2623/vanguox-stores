import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "../init";
import z from "zod";
import { productImages, products, stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  createProduct: baseProcedure
    .input(
      z.object({
        images: z.array(z.string()),
        title: z.string(),
        description: z.string(),
        storeName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.storeName));

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const [newProduct] = await db
        .insert(products)
        .values({
          title: input.title,
          description: input.description,
          storeId: store.id,
        })
        .returning();

      for (const image of input.images) {
        try {
          await db.insert(productImages).values({
            url: image,
            productId: newProduct.id,
          });
        } catch (err) {
          console.error("Error inserting image:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save product images.",
          });
        }
      }

      return store;
    }),
});
