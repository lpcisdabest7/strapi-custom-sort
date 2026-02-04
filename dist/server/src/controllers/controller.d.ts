import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';
declare const controller: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Controller method for the route that fetches the entries
     * of the collection type with the given `uid` path parameter (GET request).
     */
    fetchEntries(ctx: Context): Promise<void>;
    /**
     * Controller method for the route that updates the sort order
     * of the collection type with the given `uid` path parameter (POST request).
     */
    updateSortOrder(ctx: Context): Promise<void>;
    /**
     * Controller method for the route that fetches the entries (scoped mode).
     * Scoped mode uses the same fetching behaviour as the legacy endpoint,
     * but is wired to a dedicated route to keep the two features separated.
     */
    fetchEntriesScoped(ctx: Context): Promise<any>;
    /**
     * Controller method for the route that updates the sort order (scoped mode).
     *
     * In scoped mode we want `sortOrder` to be unique only within the active filter
     * scope (for example per category or per relation), instead of globally across
     * all entries of the collection type.
     */
    updateSortOrderScoped(ctx: Context): Promise<void>;
};
export default controller;
