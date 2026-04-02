CREATE TABLE "shopify_stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"shopify_domain" varchar(255) NOT NULL,
	"access_token" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"installed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "shopify_stores_shopify_domain_unique" ON "shopify_stores" USING btree ("shopify_domain");