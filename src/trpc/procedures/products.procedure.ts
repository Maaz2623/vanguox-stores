import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "../init";
import z from "zod";
import { productImages, products } from "@/db/schema";

export const productsRouter = createTRPCRouter({
  createProduct: baseProcedure
    .input(
      z.object({
        images: z.array(z.string()),
        title: z.string(),
        description: z.string(),
        storeId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [newProduct] = await db
        .insert(products)
        .values({
          title: input.title,
          description: input.description,
          storeId: input.storeId,
        })
        .returning();

      for (const image of input.images) {
        await db.insert(productImages).values({
          url: image,
          productId: newProduct.id,
        });
      }

      return newProduct;
    }),
});
