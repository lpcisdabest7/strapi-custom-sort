/// <reference types="koa" />
declare const _default: {
    register: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    destroy: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    config: {
        default: {};
        validator(): void;
    };
    controllers: {
        controller: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            fetchEntries(ctx: import("koa").Context): Promise<void>;
            updateSortOrder(ctx: import("koa").Context): Promise<void>;
        };
    };
    routes: {
        admin: {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
                config: {
                    policies: any[];
                };
            }[];
        };
    };
    services: {
        service: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            fetchEntries({ uid, mainField, filters, locale, relationFields, }: {
                uid: import("@strapi/types/dist/uid").ContentType;
                mainField: string;
                filters: any;
                locale: any;
                relationFields?: string[];
            }): Promise<import("@strapi/types/dist/modules/documents").AnyDocument[]>;
            fetchLastEntry({ uid, locale }: {
                uid: import("@strapi/types/dist/uid").ContentType;
                locale: any;
            }): Promise<import("@strapi/types/dist/modules/documents").AnyDocument>;
            updateSortOrder({ uid, sortedDocumentIds, filters, locale, }: {
                uid: import("@strapi/types/dist/uid").ContentType;
                sortedDocumentIds: import("./types").DocumentIDList;
                filters: any;
                locale: any;
            }): Promise<({
                documentId: string;
                id: number;
            } & {
                [key: string]: any;
            })[]>;
        };
    };
    contentTypes: {};
    policies: {};
    middlewares: {};
};
export default _default;
