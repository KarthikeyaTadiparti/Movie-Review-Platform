import {
    pgTable,
    serial,
    integer,
    timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users-schema.ts";
import { movies } from "./movies-schema.ts";

export const watchlist = pgTable("watchlist", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    movieId: integer("movie_id").references(() => movies.id).notNull(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
});

export type WatchlistItem = typeof watchlist.$inferSelect;
export type NewWatchlistItem = typeof watchlist.$inferInsert;
