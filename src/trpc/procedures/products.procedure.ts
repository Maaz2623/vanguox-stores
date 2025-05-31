import { db } from "@/db";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import z from "zod";
import { productImages, products, stores } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  getProductById: baseProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const productsWithImages = await db
        .select({
          productId: products.id,
          title: products.title,
          description: products.description,
          price: products.price,
          imageUrl: productImages.url,
        })
        .from(products)
        .leftJoin(productImages, eq(products.id, productImages.productId))
        .where(eq(products.id, input.productId));

      if (!productsWithImages.length) {
        return null;
      }

      const grouped = {
        id: productsWithImages[0].productId,
        title: productsWithImages[0].title,
        description: productsWithImages[0].description,
        price: productsWithImages[0].price,
        images: [] as string[],
      };

      for (const item of productsWithImages) {
        if (item.imageUrl) {
          grouped.images.push(item.imageUrl);
        }
      }

      return grouped;
    }),

  getProductCardDetails: baseProcedure
    .input(z.object({ storeName: z.string() }))
    .query(async ({ input }) => {
      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.storeName));

      if (!store) throw new Error("Store not found");

      const productsWithImages = await db
        .select({
          productId: products.id,
          title: products.title,
          description: products.description,
          price: products.price,
          imageUrl: productImages.url,
        })
        .from(products)
        .leftJoin(productImages, eq(products.id, productImages.productId))
        .where(eq(products.storeId, store.id));

      const grouped: Record<
        string,
        {
          id: string;
          title: string;
          description: string;
          price: string;
          images: string[];
          storeName: string;
        }
      > = {};

      for (const item of productsWithImages) {
        if (!grouped[item.productId]) {
          grouped[item.productId] = {
            id: item.productId,
            title: item.title,
            description: item.description,
            price: item.price.toString(),
            images: [],
            storeName: store.name,
          };
        }

        if (item.imageUrl) {
          grouped[item.productId].images.push(item.imageUrl);
        }
      }

      return Object.values(grouped);
    }),

  deleteById: baseProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [deletedProduct] = await db
        .delete(products)
        .where(eq(products.id, input.productId))
        .returning();

      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.id, deletedProduct.storeId));

      return {
        storeName: store.name,
        productTitle: deletedProduct.title,
      };
    }),
  getProductsByStoreName: protectedProcedure
    .input(
      z.object({
        storeName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { auth } = ctx;

      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.storeName));

      if (store.ownerId !== auth.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      
      const storeProducts = await db
        .select()
        .from(products)
        .where(eq(products.storeId, store.id))
        .orderBy(desc(products.createdAt));

      return storeProducts;
    }),
  createProduct: protectedProcedure
    .input(
      z.object({
        images: z.array(z.string()),
        title: z.string(),
        price: z.coerce.number().positive(),
        description: z.string(),
        storeName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { auth } = ctx;

      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.storeName));

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (store.ownerId !== auth.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const [newProduct] = await db
        .insert(products)
        .values({
          title: input.title,
          description: input.description,
          price: input.price.toString(),
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

      return newProduct;
    }),
});
