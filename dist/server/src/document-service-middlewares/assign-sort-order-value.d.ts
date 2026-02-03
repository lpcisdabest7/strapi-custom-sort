import type { Core, Modules } from '@strapi/strapi';
/**
 * A middleware that automatically assigns a value to the configured sort order field when creating a new entry.
 *
 * - Note: Exporting the middleware callback directly simplifies testing. However, this export is intended solely for use in tests.
 *         For registering the middleware in the actual application, please use the default export below.
 */
export declare const assignSortOrderValueMiddlewareCallback: Modules.Documents.Middleware.Middleware;
/**
 * Adds the above middleware to the document service.
 */
declare const assignSortOrderValueMiddleware: ({ strapi }: {
    strapi: Core.Strapi;
}) => void;
export default assignSortOrderValueMiddleware;
