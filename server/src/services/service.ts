import { config } from '../config';
import { reorderSubsetInPlace } from '../utils/reorderSubsetInPlace';

//
// Types
//

import type { Core } from '@strapi/strapi';
import type { ContentTypeUID, DocumentID, DocumentIDList, Filters, Locale } from 'src/types';

//
// Helpers
//

/**
 * Gets the minimum sort order value for a given content type.
 * Checks content type attributes first, then plugin config, then defaults to 1.
 *
 * @param strapi - The Strapi instance.
 * @param uid - The content type UID.
 *
 * @returns The minimum sort order value (default: 1).
 */
const getMinSortOrder = ({ strapi, uid }: { strapi: Core.Strapi; uid: ContentTypeUID }): number => {
  // First, try to get min value from content type attributes
  try {
    const contentType = (strapi as any).get('content-types')?.get(uid);
    if (contentType?.attributes?.[config.sortOrderField]?.min !== undefined) {
      const rawMinSortOrderForUid = contentType.attributes[config.sortOrderField].min;
      if (
        typeof rawMinSortOrderForUid === 'number' &&
        Number.isInteger(rawMinSortOrderForUid) &&
        rawMinSortOrderForUid >= 0
      ) {
        return rawMinSortOrderForUid;
      }
    }
  } catch {
    // Ignore errors when accessing content type
  }

  // Second, try to get from plugin config
  try {
    const rawMinSortOrder = (strapi as any).config?.get?.('plugin.sortable-entries.minSortOrder');
    if (
      typeof rawMinSortOrder === 'number' &&
      Number.isInteger(rawMinSortOrder) &&
      rawMinSortOrder >= 0
    ) {
      return rawMinSortOrder;
    }
  } catch {
    // Ignore errors when accessing config
  }

  // Default to 1
  return 1;
};

//
// Service
//

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
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
  async fetchEntries({
    uid,
    mainField,
    filters,
    locale,
    relationFields,
  }: {
    uid: ContentTypeUID;
    mainField: string;
    filters: Filters | undefined;
    locale: Locale | undefined;
    relationFields?: string[];
  }) {
    // Start with only documentId and mainField
    // Only add relation fields if they exist and are queryable
    const fields: string[] = ['documentId'];

    // Validate mainField exists in content type
    try {
      const contentType = (strapi as any).get('content-types')?.get(uid);
      const attributes = contentType?.attributes || {};

      // Only add mainField if it exists in content type
      if (attributes[mainField] || mainField === 'documentId') {
        if (!fields.includes(mainField)) {
          fields.push(mainField);
        }
      } else {
        console.warn(`MainField ${mainField} not found in content type, using documentId only`);
      }
    } catch (error) {
      console.warn('Error validating mainField:', error);
      // Fallback to documentId only
    }

    // Validate and filter relation fields to only include actual relation fields
    const validRelationFields: string[] = [];
    const systemFields = ['createdBy', 'updatedBy', 'localizations', 'locale'];

    if (relationFields && relationFields.length > 0) {
      try {
        const contentType = (strapi as any).get('content-types')?.get(uid);
        const attributes = contentType?.attributes || {};

        console.log('Validating relation fields:', {
          relationFields,
          contentTypeAttributes: Object.keys(attributes),
        });

        relationFields.forEach((field) => {
          // Skip system fields
          if (systemFields.includes(field)) {
            console.log(`Skipping system field: ${field}`);
            return;
          }

          // Check if field exists in content type AND is queryable
          if (attributes[field]) {
            const attribute = attributes[field];
            console.log(`Field ${field} attribute:`, {
              type: attribute.type,
              relation: attribute.relation,
            });

            // Only include relation or media fields that can be queried
            // Don't add to fields array - relation fields are accessed via populate, not fields
            if (
              attribute.type === 'relation' ||
              attribute.type === 'media' ||
              (attribute.relation && typeof attribute.relation === 'string')
            ) {
              validRelationFields.push(field);
              // DO NOT add relation fields to fields array - this causes "Invalid key" error
              // Relation fields are accessed via populate, not fields parameter
              console.log(`Added valid relation field for populate: ${field}`);
            } else {
              console.log(`Field ${field} is not a relation field, type: ${attribute.type}`);
            }
          } else {
            console.log(`Field ${field} not found in content type attributes`);
          }
        });
      } catch (error) {
        console.warn('Error validating relation fields:', error);
        // If validation fails, don't populate any fields to avoid errors
      }
    }

    console.log('Fields to query:', fields);
    console.log('Valid relation fields for populate:', validRelationFields);

    // For now, don't populate relation fields to avoid "Invalid key" errors
    // Frontend will receive relation IDs and can fetch them separately if needed
    // This is a safer approach that avoids Strapi v5 populate issues

    try {
      const result = await strapi.documents(uid).findMany({
        fields,
        // Don't populate for now - just return the relation field IDs
        // Frontend can use these IDs to display information
        populate: undefined,
        sort: `${config.sortOrderField}:asc`,
        filters,
        locale,
      });

      console.log(`Successfully fetched ${result.length} entries`);
      return result;
    } catch (error: any) {
      console.error('Error fetching entries:', error?.message || error);
      throw error;
    }
  },

  /**
   * Fetches the entry with the highest value in the configured sort order field for a given content type.
   * This is typically used to retrieve the "last" entry according to the custom ordering field.
   *
   * @param uid - The unique identifier of the content type (e.g. 'api::products.products').
   * @param locale - The current locale of the content type / `undefined` if localization is turned off.
   *
   * @returns A promise resolving to the last entry object or `null` if no entry exists.
   */
  async fetchLastEntry({ uid, locale }: { uid: ContentTypeUID; locale: Locale | undefined }) {
    return await strapi.documents(uid).findFirst({
      fields: ['documentId', config.sortOrderField],
      sort: `${config.sortOrderField}:desc`,
      locale,
    });
  },

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
  async updateSortOrder({
    uid,
    sortedDocumentIds,
    filters,
    locale,
  }: {
    uid: ContentTypeUID;
    sortedDocumentIds: DocumentIDList;
    filters: Filters | undefined;
    locale: Locale | undefined;
  }) {
    // Fetch previous sort order of all entries to detect an actual change in position
    // when updating the entries below and to handle any active filters.
    const prevSortedEntries = await strapi.documents(uid).findMany({
      fields: ['documentId', config.sortOrderField],
      sort: `${config.sortOrderField}:asc`,
      locale,
    });

    // The previous sorted list of document ID's.
    const prevSortedDocumentIds = prevSortedEntries.map((entry) => entry.documentId);

    // The new sorted list of document ID's, defined by the frontend.
    let nextSortedDocumentIds = [...sortedDocumentIds];

    if (!!filters) {
      // We have an applied filter, so the given `sortedDocumentIds` are only a subset of all entries.
      // As the values of `sortOrderField` needs to be unique, we still need to update all entries.
      nextSortedDocumentIds = reorderSubsetInPlace(prevSortedDocumentIds, sortedDocumentIds);
    }

    // Validate input before updating any entries.
    // - When having no applied filter, we need to ensure the length of the given `sortedDocumentIds` matches the
    //   length of `prevSortedDocumentIds`. Otherwise the data from the frontend is outdated.
    // - When having an applied filter, we need to ensure `reorderSubsetInPlace()` returned all passed document ID's.
    if (prevSortedDocumentIds.length !== nextSortedDocumentIds.length) {
      throw new Error(`Expected to have the same number of document ID's as previously fetched.`);
    }

    // Get the minimum sort order value for this content type
    const minSortOrder = getMinSortOrder({ strapi, uid });

    // Map the new sorted list of document ID's to promises that reflect updating the corresponding database entries.
    const updatePromises = nextSortedDocumentIds
      .map((documentId: DocumentID, index: number) => {
        // At this point `prevSortedDocumentIds` and `nextSortedDocumentIds` are guaranteed to have the same length.
        // Therefore we can safely access the value at the same index.
        const prevEntry = prevSortedEntries[index];

        // Calculate the actual sort order value (index + minSortOrder)
        const nextSortIndex = index + minSortOrder;

        // To avoid unnecessary re-publishing of all entries when a new sort order is applied,
        // we only update entries when strictly necessary. An update occurs if one of these conditions is met:
        //
        // 1. The entry has moved to a new position in the list.
        //    - Example: If an entry with `documentId = "doc-5"` was at index 5 but now appears at index 3, its sort index must be updated.
        //
        // 2. The entry has never had a valid `sortOrderField` value.
        //    - Example: A newly created entry where `sortOrderField` is `null`, `undefined` or an empty string.
        //      → Needs an initial sort index assigned.
        //
        // 3. The entry's stored `sortOrderField` is outdated due to earlier changes.
        //    - Example: If an item was at index 4 with `sortOrderField = 4`, but another entry above it was deleted, its correct index is now 3.
        //      → Its stored value is stale and must be fixed.
        //
        // If none of these conditions apply we can skip the update.
        const hasSameDocumentId = prevEntry.documentId === documentId;
        const hasSameSortIndex = prevEntry[config.sortOrderField] === nextSortIndex;
        if (hasSameDocumentId && hasSameSortIndex) {
          return null;
        }

        return strapi.documents(uid).update({
          documentId,
          locale,
          data: {
            [config.sortOrderField]: nextSortIndex,
          },
        });
      })
      .filter((optionalPromise) => !!optionalPromise);

    return await Promise.all(updatePromises);
  },
});

export default service;
