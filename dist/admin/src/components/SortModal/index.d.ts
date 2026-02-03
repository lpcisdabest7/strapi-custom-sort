import type { UID } from '@strapi/strapi';
/**
 * A modal component that retrieves entries from the current collection type,
 * presents them in a sortable list, and enables saving changes via a submit button.
 *
 * @param uid - The unique identifier of the content type which entries are sorted.
 * @param mainField - The displayed field of each entry in the collection type.
 * @param contentType - The content type configuration.
 */
declare const SortModal: ({ uid, mainField, contentType, }: {
    uid: UID.ContentType;
    mainField: string;
    contentType: any;
}) => import("react/jsx-runtime").JSX.Element;
export default SortModal;
