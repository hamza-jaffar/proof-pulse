import {
  pgTable,
  uniqueIndex,
  serial,
  varchar,
  timestamp,
  text,
  boolean,
} from 'drizzle-orm/pg-core';

export const shopifyStore = pgTable(
  'shopify_stores',
  {
    id: serial('id').primaryKey(),
    shopifyDomain: varchar('shopify_domain', { length: 255 }).notNull(),
    accessToken: text('access_token').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    installedAt: timestamp('installed_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (shopifyStore) => ({
    shopifyDomainUnique: uniqueIndex('shopify_stores_shopify_domain_unique').on(
      shopifyStore.shopifyDomain,
    ),
  }),
);
