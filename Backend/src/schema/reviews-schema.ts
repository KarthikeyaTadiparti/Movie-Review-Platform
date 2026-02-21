import {
    pgTable,
    serial,
    integer,
    text,
    timestamp,
    decimal,
} from "drizzle-orm/pg-core";
import { users } from "./users-schema.ts";
import { movies } from "./movies-schema.ts";

export const reviews = pgTable("reviews", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    movieId: integer("movie_id").references(() => movies.id).notNull(),
    rating: integer("rating").notNull(), // 1-5 stars
    reviewText: text("review_text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
