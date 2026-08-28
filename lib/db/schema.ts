import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const publicationStatus = pgEnum("publication_status", [
  "draft",
  "published",
  "hidden",
  "archived",
]);

export const inquiryType = pgEnum("inquiry_type", [
  "general",
  "quote",
  "product",
]);

export const inquiryStatus = pgEnum("inquiry_status", [
  "new",
  "contacted",
  "closed",
]);

export const documentType = pgEnum("document_type", [
  "datasheet",
  "manual",
  "other",
]);

export const relationshipType = pgEnum("relationship_type", [
  "related",
  "accessory",
  "compatible",
]);

export const adminRole = pgEnum("admin_role", ["admin", "editor"]);

export const productCondition = pgEnum("product_condition", [
  "new",
  "refurbished",
  "used",
]);

export const productAvailability = pgEnum("product_availability", [
  "in_stock",
  "out_of_stock",
  "preorder",
  "discontinued",
]);

// ---------- users (admin) ----------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: adminRole("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- brands ----------
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logoUrl: text("logo_url"),
  description: text("description"),
  status: publicationStatus("status").notNull().default("draft"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- categories (self-referencing for subcategories) ----------
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    parentId: integer("parent_id"),
    description: text("description"),
    imageUrl: text("image_url"),
    status: publicationStatus("status").notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("categories_parent_id_idx").on(table.parentId)]
);

// ---------- products ----------
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    brandId: integer("brand_id").references(() => brands.id),
    categoryId: integer("category_id").references(() => categories.id),
    model: varchar("model", { length: 255 }),
    mpn: varchar("mpn", { length: 100 }),
    condition: productCondition("condition").notNull().default("new"),
    availability: productAvailability("availability")
      .notNull()
      .default("in_stock"),
    shortDescription: text("short_description"),
    description: text("description"),
    status: publicationStatus("status").notNull().default("draft"),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("products_status_category_idx").on(table.status, table.categoryId),
    index("products_status_featured_idx").on(table.status, table.isFeatured),
    index("products_brand_id_idx").on(table.brandId),
  ]
);

// ---------- product images ----------
export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: varchar("alt", { length: 255 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => [index("product_images_product_id_idx").on(table.productId)]
);

// ---------- product specifications ----------
export const productSpecifications = pgTable(
  "product_specifications",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    groupName: varchar("group_name", { length: 255 }),
    label: varchar("label", { length: 255 }).notNull(),
    value: text("value").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("product_specifications_product_id_idx").on(table.productId),
  ]
);

// ---------- product documents ----------
export const productDocuments = pgTable(
  "product_documents",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    type: documentType("type").notNull().default("other"),
    title: varchar("title", { length: 255 }).notNull(),
    url: text("url").notNull(),
    fileSize: integer("file_size"),
  },
  (table) => [index("product_documents_product_id_idx").on(table.productId)]
);

// ---------- product relationships ----------
export const productRelationships = pgTable(
  "product_relationships",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    relatedProductId: integer("related_product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    type: relationshipType("type").notNull().default("related"),
  },
  (table) => [
    index("product_relationships_product_id_idx").on(table.productId),
    uniqueIndex("product_relationships_unique_idx").on(
      table.productId,
      table.relatedProductId
    ),
  ]
);

// ---------- inquiries (leads) ----------
export const inquiries = pgTable(
  "inquiries",
  {
    id: serial("id").primaryKey(),
    type: inquiryType("type").notNull().default("general"),
    productId: integer("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    country: varchar("country", { length: 100 }),
    quantity: varchar("quantity", { length: 100 }),
    message: text("message").notNull(),
    sourceUrl: text("source_url"),
    ipAddress: varchar("ip_address", { length: 64 }),
    status: inquiryStatus("status").notNull().default("new"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("inquiries_status_idx").on(table.status),
    index("inquiries_ip_created_idx").on(table.ipAddress, table.createdAt),
  ]
);

// ---------- relations ----------
export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryParent",
  }),
  children: many(categories, { relationName: "categoryParent" }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  specifications: many(productSpecifications),
  documents: many(productDocuments),
  inquiries: many(inquiries),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productSpecificationsRelations = relations(
  productSpecifications,
  ({ one }) => ({
    product: one(products, {
      fields: [productSpecifications.productId],
      references: [products.id],
    }),
  })
);

export const productDocumentsRelations = relations(
  productDocuments,
  ({ one }) => ({
    product: one(products, {
      fields: [productDocuments.productId],
      references: [products.id],
    }),
  })
);

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  product: one(products, {
    fields: [inquiries.productId],
    references: [products.id],
  }),
}));

export const productRelationshipsRelations = relations(
  productRelationships,
  ({ one }) => ({
    product: one(products, {
      fields: [productRelationships.productId],
      references: [products.id],
      relationName: "productRelationshipsFromProduct",
    }),
    relatedProduct: one(products, {
      fields: [productRelationships.relatedProductId],
      references: [products.id],
      relationName: "productRelationshipsToProduct",
    }),
  })
);
