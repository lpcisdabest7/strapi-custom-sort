import { config } from '../config';
import { DocumentAction } from '../constants';

//
// Types
//

import type { Core, Modules } from '@strapi/strapi';
import type { AnyDocument } from 'src/types';

/** Represents the input when creating a sortable document. */
type SortFieldName = (typeof config.sortFieldCandidates)[number] | typeof config.sortOrderField;

interface SortableDocumentInput {
  [key: string]: any;
}

/** Represents a sortable document from the database. */
interface SortableDocument extends AnyDocument {
  [key: string]: any;
}

//
// Helper
//

const resolveSortFieldForInput = (input: any): SortFieldName | null => {
  if (!input || typeof input !== 'object') {
    return null;
  }

  // Prefer any of the configured candidate fields that are present on the input
  for (const candidate of config.sortFieldCandidates) {
    if (Object.prototype.hasOwnProperty.call(input, candidate)) {
      return candidate;
    }
  }

  // Fallback to the default field name
  if (Object.prototype.hasOwnProperty.call(input, config.sortOrderField)) {
    return config.sortOrderField;
  }

  return null;
};

/**
 * Gets the minimum sort order value for a given content type.
 * Checks content type attributes first, then plugin config, then defaults to 1.
 *
 * @param strapi - The Strapi instance.
 * @param uid - The content type UID.
 *
 * @returns The minimum sort order value (default: 1).
 */
const getMinSortOrder = (strapi: Core.Strapi, uid: string, sortField: string): number => {
  // First, try to get min value from content type attributes
  try {
    const contentType = (strapi as any).get('content-types')?.get(uid);
    if (contentType?.attributes?.[sortField]?.min !== undefined) {
      const rawMinSortOrderForUid = contentType.attributes[sortField].min;
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
// Middleware
//

/**
 * A middleware that automatically assigns a value to the configured sort order field when creating a new entry.
 *
 * - Note: Exporting the middleware callback directly simplifies testing. However, this export is intended solely for use in tests.
 *         For registering the middleware in the actual application, please use the default export below.
 */
export const assignSortOrderValueMiddlewareCallback: Modules.Documents.Middleware.Middleware =
  async (context, next) => {
    switch (context.action) {
      case DocumentAction.Create:
        const data = context.params.data;
        const sortField = resolveSortFieldForInput(data);

        if (!sortField) {
          // The current content type does not have a sort order field, no need to auto-assign a new value.
          break;
        }

        const sortOrder = data[sortField];
        if (sortOrder || sortOrder === 0) {
          // The user has already provided a valid value for the sort order field, no need to auto-assign a new value.
          break;
        }

        // Get the minimum sort order value
        const minSortOrder = getMinSortOrder(strapi, context.uid, sortField);

        // prettier-ignore
        const lastEntry = (await strapi
          .service('plugin::sortable-entries.service')
          // `locale` may not exist on all inputs; pass `undefined` when missing to satisfy typings.
          .fetchLastEntry({ uid: context.uid, locale: (data as any)?.locale })) as
          | SortableDocument
          | undefined;

        const lastSortOrder = lastEntry?.[sortField];
        let nextSortOrder: number;
        if (lastSortOrder !== null && lastSortOrder !== undefined) {
          nextSortOrder = lastSortOrder + 1;
        } else {
          nextSortOrder = minSortOrder;
        }

        data[sortField] = nextSortOrder;
        break;

      case DocumentAction.Delete:
        // We explicitly skip updating any sort order field(s) up-on deleting an entry,
        // as the user would need to re-publish all above entries after deleting one.
        break;

      default:
        break;
    }

    return await next();
  };

/**
 * Adds the above middleware to the document service.
 */
const assignSortOrderValueMiddleware = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.documents.use(assignSortOrderValueMiddlewareCallback);
};

export default assignSortOrderValueMiddleware;
