import {
    pgTable,
    serial,
    varchar,
    text,
    timestamp,
    decimal,
    integer,
} from "drizzle-orm/pg-core";

export const movies = pgTable("movies", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    genre: varchar("genre", { length: 100 }).notNull(),
    releaseYear: integer("release_year").notNull(),
    director: varchar("director", { length: 255 }).notNull(),
    cast: text("cast").notNull(), // Comma separated or JSON string
    synopsis: text("synopsis").notNull(),
    posterUrl: text("poster_url").notNull(),
    trailerUrl: text("trailer_url"),
    averageRating: decimal("average_rating", { precision: 2, scale: 1 }).default("0.0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;
