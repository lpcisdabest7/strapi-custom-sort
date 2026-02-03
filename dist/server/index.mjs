const bootstrap = ({ strapi: strapi2 }) => {
};
const destroy = ({ strapi: strapi2 }) => {
};
const config$1 = {
  /**
   * The database field containing the order of the sorted entries.
   *
   * - Note: Unfortunatly there is no easy way to share the configuration between the admin- and server-side code,
   *         so we need to duplicate the config here for now.
   */
  sortOrderField: "sortOrder"
};
var DocumentAction = /* @__PURE__ */ ((DocumentAction2) => {
  DocumentAction2["Create"] = "create";
  DocumentAction2["Delete"] = "delete";
  return DocumentAction2;
})(DocumentAction || {});
const hasSortOrderField = (input) => input.hasOwnProperty(config$1.sortOrderField);
const getMinSortOrder$1 = (strapi2, uid) => {
  try {
    const contentType = strapi2.get("content-types")?.get(uid);
    if (contentType?.attributes?.[config$1.sortOrderField]?.min !== void 0) {
      const rawMinSortOrderForUid = contentType.attributes[config$1.sortOrderField].min;
      if (typeof rawMinSortOrderForUid === "number" && Number.isInteger(rawMinSortOrderForUid) && rawMinSortOrderForUid >= 0) {
        return rawMinSortOrderForUid;
      }
    }
  } catch {
  }
  try {
    const rawMinSortOrder = strapi2.config?.get?.("plugin.sortable-entries.minSortOrder");
    if (typeof rawMinSortOrder === "number" && Number.isInteger(rawMinSortOrder) && rawMinSortOrder >= 0) {
      return rawMinSortOrder;
    }
  } catch {
  }
  return 1;
};
const assignSortOrderValueMiddlewareCallback = async (context, next) => {
  switch (context.action) {
    case DocumentAction.Create:
      const data = context.params.data;
      if (!hasSortOrderField(data)) {
        break;
      }
      const sortOrder = data[config$1.sortOrderField];
      if (sortOrder || sortOrder === 0) {
        break;
      }
      const minSortOrder = getMinSortOrder$1(strapi, context.uid);
      const lastEntry = await strapi.service("plugin::sortable-entries.service").fetchLastEntry({ uid: context.uid, locale: data.locale });
      const lastSortOrder = lastEntry?.[config$1.sortOrderField];
      let nextSortOrder;
      if (lastSortOrder !== null && lastSortOrder !== void 0) {
        nextSortOrder = lastSortOrder + 1;
      } else {
        nextSortOrder = minSortOrder;
      }
      data[config$1.sortOrderField] = nextSortOrder;
      break;
    case DocumentAction.Delete:
      break;
  }
  return await next();
};
const assignSortOrderValueMiddleware = ({ strapi: strapi2 }) => {
  strapi2.documents.use(assignSortOrderValueMiddlewareCallback);
};
const register = ({ strapi: strapi2 }) => {
  assignSortOrderValueMiddleware({ strapi: strapi2 });
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
const controller = ({ strapi: strapi2 }) => ({
  /**
   * Controller method for the route that fetches the entries
   * of the collection type with the given `uid` path parameter (GET request).
   */
  async fetchEntries(ctx) {
    const { uid } = ctx.params;
    const { mainField, filters, locale, relationFields } = ctx.request.query;
    if (!mainField) {
      ctx.badRequest("Missing required `mainField` query parameter.");
      return;
    }
    const parsedRelationFields = relationFields ? relationFields.split(",") : void 0;
    const service2 = strapi2.plugin("sortable-entries").service("service");
    const entries = await service2.fetchEntries({
      uid,
      mainField,
      filters,
      locale,
      relationFields: parsedRelationFields
    });
    ctx.response.body = JSON.stringify(entries);
  },
  /**
   * Controller method for the route that updates the sort order
   * of the collection type with the given `uid` path parameter (POST request).
   */
  async updateSortOrder(ctx) {
    const { uid } = ctx.params;
    const { data } = ctx.request.body;
    const { sortedDocumentIds, filters, locale } = data;
    if (!sortedDocumentIds) {
      ctx.badRequest("Missing required `sortedDocumentIds` in request body.");
      return;
    }
    const service2 = strapi2.plugin("sortable-entries").service("service");
    await service2.updateSortOrder({
      uid,
      sortedDocumentIds,
      filters,
      locale
    });
    ctx.response.body = null;
  }
});
const controllers = {
  controller
};
const middlewares = {};
const policies = {};
const admin = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/fetch-entries/:uid",
      handler: "controller.fetchEntries",
      config: {
        policies: []
      }
    },
    {
      method: "POST",
      path: "/update-sort-order/:uid",
      handler: "controller.updateSortOrder",
      config: {
        policies: []
      }
    }
  ]
};
const routes = {
  admin
};
const reorderSubsetInPlace = (array, newSubsetOrder) => {
  const subset = new Set(newSubsetOrder);
  let positionsToUpdate = [];
  array.forEach((element, index2) => {
    if (subset.has(element)) {
      positionsToUpdate.push(index2);
    }
  });
  if (positionsToUpdate.length !== newSubsetOrder.length) {
    throw new Error("Some elements from the `newSubsetOrder` were not found in `array`.");
  }
  let mutableArray = [...array];
  positionsToUpdate.forEach((positionToUpdate, index2) => {
    mutableArray[positionToUpdate] = newSubsetOrder[index2];
  });
  return mutableArray;
};
const getMinSortOrder = ({ strapi: strapi2, uid }) => {
  try {
    const contentType = strapi2.get("content-types")?.get(uid);
    if (contentType?.attributes?.[config$1.sortOrderField]?.min !== void 0) {
      const rawMinSortOrderForUid = contentType.attributes[config$1.sortOrderField].min;
      if (typeof rawMinSortOrderForUid === "number" && Number.isInteger(rawMinSortOrderForUid) && rawMinSortOrderForUid >= 0) {
        return rawMinSortOrderForUid;
      }
    }
  } catch {
  }
  try {
    const rawMinSortOrder = strapi2.config?.get?.("plugin.sortable-entries.minSortOrder");
    if (typeof rawMinSortOrder === "number" && Number.isInteger(rawMinSortOrder) && rawMinSortOrder >= 0) {
      return rawMinSortOrder;
    }
  } catch {
  }
  return 1;
};
const service = ({ strapi: strapi2 }) => ({
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
    relationFields
  }) {
    const fields = ["documentId", mainField];
    if (relationFields && relationFields.length > 0) {
      relationFields.forEach((field) => {
        if (!fields.includes(field)) {
          fields.push(field);
        }
      });
    }
    const populate = {};
    if (relationFields && relationFields.length > 0) {
      relationFields.forEach((field) => {
        populate[field] = true;
      });
    }
    return await strapi2.documents(uid).findMany({
      fields,
      populate: Object.keys(populate).length > 0 ? populate : void 0,
      sort: `${config$1.sortOrderField}:asc`,
      filters,
      locale
    });
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
  async fetchLastEntry({ uid, locale }) {
    return await strapi2.documents(uid).findFirst({
      fields: ["documentId", config$1.sortOrderField],
      sort: `${config$1.sortOrderField}:desc`,
      locale
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
    locale
  }) {
    const prevSortedEntries = await strapi2.documents(uid).findMany({
      fields: ["documentId", config$1.sortOrderField],
      sort: `${config$1.sortOrderField}:asc`,
      locale
    });
    const prevSortedDocumentIds = prevSortedEntries.map((entry) => entry.documentId);
    let nextSortedDocumentIds = [...sortedDocumentIds];
    if (!!filters) {
      nextSortedDocumentIds = reorderSubsetInPlace(prevSortedDocumentIds, sortedDocumentIds);
    }
    if (prevSortedDocumentIds.length !== nextSortedDocumentIds.length) {
      throw new Error(`Expected to have the same number of document ID's as previously fetched.`);
    }
    const minSortOrder = getMinSortOrder({ strapi: strapi2, uid });
    const updatePromises = nextSortedDocumentIds.map((documentId, index2) => {
      const prevEntry = prevSortedEntries[index2];
      const nextSortIndex = index2 + minSortOrder;
      const hasSameDocumentId = prevEntry.documentId === documentId;
      const hasSameSortIndex = prevEntry[config$1.sortOrderField] === nextSortIndex;
      if (hasSameDocumentId && hasSameSortIndex) {
        return null;
      }
      return strapi2.documents(uid).update({
        documentId,
        locale,
        data: {
          [config$1.sortOrderField]: nextSortIndex
        }
      });
    }).filter((optionalPromise) => !!optionalPromise);
    return await Promise.all(updatePromises);
  }
});
const services = {
  service
};
const index = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies,
  middlewares
};
export {
  index as default
};
