declare const _default: {
    service: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        fetchEntries({ uid, mainField, filters, locale, relationFields, additionalFields, }: {
            uid: import("@strapi/types/dist/uid").ContentType;
            mainField: string;
            filters: any;
            locale: any;
            relationFields?: string[];
            additionalFields?: string[];
        }): Promise<import("@strapi/types/dist/modules/documents").AnyDocument[]>;
        fetchLastEntry({ uid, locale }: {
            uid: import("@strapi/types/dist/uid").ContentType;
            locale: any;
        }): Promise<import("@strapi/types/dist/modules/documents").AnyDocument>;
        updateSortOrder({ uid, sortedDocumentIds, filters, locale, }: {
            uid: import("@strapi/types/dist/uid").ContentType;
            sortedDocumentIds: import("../types").DocumentIDList;
            filters: any;
            locale: any;
        }): Promise<({
            documentId: string;
            id: number;
        } & {
            [key: string]: any;
        })[]>;
        updateSortOrderScoped({ uid, sortedDocumentIds, filters, locale, }: {
            uid: import("@strapi/types/dist/uid").ContentType;
            sortedDocumentIds: import("../types").DocumentIDList;
            filters: any;
            locale: any;
        }): Promise<any>;
    };
};
export default _default;
