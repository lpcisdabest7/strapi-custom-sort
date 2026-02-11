export const config = {
  /**
   * The database field containing the order of the sorted entries.
   *
   * - Note: Unfortunatly there is no easy way to share the configuration between the admin- and server-side code,
   *         so we need to duplicate the config here for now.
   */
  /**
   * Default sort field name.
   *
   * - Used as a fallback if no matching field is found on the content type.
   */
  sortOrderField: 'sortOrder',

  /**
   * Candidate sort field names.
   *
   * - The plugin will look for the first field in this list that exists on the
   *   current content type and is of type "integer".
   * - This allows using different field names such as "sort", "order" or "orderIndex".
   */
  sortFieldCandidates: ['sort', 'sortOrder', 'order', 'orderIndex'] as const,

  /**
   * Page size used when fetching entries for the sortable modal.
   *
   * Strapi's document service defaults to 100 items when pagination is omitted.
   * We explicitly set a higher page size so collections with >100 records can
   * still be fully sorted in the UI.
   */
  entriesPageSize: 500,
} as const;
