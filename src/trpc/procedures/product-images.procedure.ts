import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { productImages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const productImagesRouter = createTRPCRouter({
  getImagesByProductId: baseProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, input.productId));

      return images;
    }),
});
