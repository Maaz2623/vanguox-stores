import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { carts, orders, stores } from "@/db/schema";
import { eq } from "drizzle-orm";

export const ordersRouter = createTRPCRouter({
  
  getOrdersByStoreName: baseProcedure
    .input(
      z.object({
        storeName: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.storeName));

      const ordersArray = await db
        .select()
        .from(orders)
        .where(eq(orders.storeId, store.id));

      return ordersArray;
    }),
  createOrder: baseProcedure
    .input(
      z.object({
        storeName: z.string(),
        cartId: z.string().uuid(),
        notes: z.string().optional(),
        deliveryStatus: z
          .enum(["pending", "shipped", "delivered", "cancelled", "failed"])
          .optional()
          .default("pending"),
        paid: z.boolean().optional().default(false),
        paymentIntentId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [store] = await db
        .select({
          id: stores.id,
        })
        .from(stores)
        .where(eq(stores.name, input.storeName));

      const [result] = await db
        .insert(orders)
        .values({
          storeId: store.id,
          cartId: input.cartId,
          address: "Bangalore",
          notes: "This is notes",
          deliveryStatus: input.deliveryStatus,
          paid: input.paid,
          paymentIntentId: input.paymentIntentId,
        })
        .returning();

      if (result) {
        await db.update(carts).set({
          isActive: false,
        });
      }

      return {
        success: true,
        order: result,
      };
    }),
});
