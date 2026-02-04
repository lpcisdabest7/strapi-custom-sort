/// <reference types="koa" />
declare const _default: {
    controller: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        fetchEntries(ctx: import("koa").Context): Promise<void>;
        updateSortOrder(ctx: import("koa").Context): Promise<void>;
        fetchEntriesScoped(ctx: import("koa").Context): Promise<any>;
        updateSortOrderScoped(ctx: import("koa").Context): Promise<void>;
    };
};
export default _default;
