import * as users from "./users-schema.ts";
import * as movies from "./movies-schema.ts";
import * as reviews from "./reviews-schema.ts";
import * as watchlist from "./watchlist-schema.ts";

export const schema = {
    ...users,
    ...movies,
    ...reviews,
    ...watchlist,
};