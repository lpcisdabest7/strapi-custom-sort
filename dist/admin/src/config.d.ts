export declare const config: {
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
    readonly sortOrderField: "sortOrder";
    /**
     * Candidate sort field names.
     *
     * - The admin UI will look for the first field in this list that exists on the
     *   current content type and is of type "integer".
     * - This allows using different field names such as "sort", "order" or "orderIndex".
     */
    readonly sortFieldCandidates: readonly ["sort", "sortOrder", "order", "orderIndex"];
};
