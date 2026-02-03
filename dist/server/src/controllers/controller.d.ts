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
};
export default controller;
