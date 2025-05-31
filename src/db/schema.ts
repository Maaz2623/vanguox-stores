import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
  decimal,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const stores = pgTable("stores", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  storeId: uuid("store_id")
    .references(() => stores.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(), // The URL/path of the image (could be a string or text)
  altText: text("alt_text").default(""), // Optional alt text for accessibility
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const deliveryStatusEnum = pgEnum("delivery_status", [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
  "failed",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    storeId: uuid("store_id")
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),

    userId: text("user_id").default("maaz").notNull(), // assuming you have a user table

    cartId: uuid("cart_id")
      .references(() => carts.id, { onDelete: "cascade" })
      .notNull(),

    paid: boolean("paid").default(false).notNull(),

    paymentIntentId: text("payment_intent_id"), // for Stripe/Razorpay etc.

    deliveryStatus: deliveryStatusEnum("delivery_status")
      .default("pending")
      .notNull(),

    address: text("address").notNull(), // shipping address

    notes: text("notes"), // any extra instructions

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    storeIndex: index("orders_store_idx").on(table.storeId),
    userIndex: index("orders_user_idx").on(table.userId),
    cartIndex: index("orders_cart_idx").on(table.cartId),
    deliveryStatusIndex: index("orders_delivery_status_idx").on(
      table.deliveryStatus
    ),
  })
);

export const carts = pgTable("carts", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => stores.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user").default("maaz").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  cartId: uuid("cart_id")
    .references(() => carts.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  addedAt: timestamp("added_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
