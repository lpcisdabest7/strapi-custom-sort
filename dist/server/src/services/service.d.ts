import type { Core } from '@strapi/strapi';
import type { ContentTypeUID, DocumentIDList, Filters, Locale } from 'src/types';
declare const service: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Retrieves all entries for a given content type, sorted by the given `sortOrderField`.
     *
     * @param uid - The unique identifier of the content type (e.g. 'api::products.products').
     * @param mainField - The name of the field to display as the primary label in UI listings.
     * @param filters - The filtering criteria to apply / `undefined` if all entries should be returned.
     * @param locale - The current locale of the content type / `undefined` if localization is turned off.
     *
     * @returns A promise resolving to an array of entries,
     *          each containing the `documentId` and the specified `mainField`.
     */
    fetchEntries({ uid, mainField, filters, locale, relationFields, }: {
        uid: ContentTypeUID;
        mainField: string;
        filters: Filters | undefined;
        locale: Locale | undefined;
        relationFields?: string[];
    }): Promise<import("@strapi/types/dist/modules/documents").AnyDocument[]>;
    /**
     * Fetches the entry with the highest value in the configured sort order field for a given content type.
     * This is typically used to retrieve the "last" entry according to the custom ordering field.
     *
     * @param uid - The unique identifier of the content type (e.g. 'api::products.products').
     * @param locale - The current locale of the content type / `undefined` if localization is turned off.
     *
     * @returns A promise resolving to the last entry object or `null` if no entry exists.
     */
    fetchLastEntry({ uid, locale }: {
        uid: ContentTypeUID;
        locale: Locale | undefined;
    }): Promise<import("@strapi/types/dist/modules/documents").AnyDocument>;
    /**
     * Updates the sort order field of multiple entries for a given content type,
     * based on the provided list of document IDs.
     *
     * @param uid - The unique identifier of the content type (e.g. 'api::products.products').
     * @param sortedDocumentIds - An ordered array of document IDs representing the new sequence of entries.
     * @param filters - The filtering criteria applied when fetching the entries / `undefined` if all entries were returned.
     * @param locale - The current locale of the content type / `undefined` if localization is turned off.
     *
     * @returns A promise that resolves when all entries have been updated with their new sort order.
     */
    updateSortOrder({ uid, sortedDocumentIds, filters, locale, }: {
        uid: ContentTypeUID;
        sortedDocumentIds: DocumentIDList;
        filters: Filters | undefined;
        locale: Locale | undefined;
    }): Promise<({
        documentId: string;
        id: number;
    } & {
        [key: string]: any;
    })[]>;
};
export default service;
