import type { UID as StrapiUID } from '@strapi/strapi';
type SortMode = 'global' | 'scoped';
interface SortModalProps {
    uid: StrapiUID.ContentType;
    mainField: string;
    contentType: any;
    mode?: SortMode;
    label?: string;
}
/**
 * A modal component that retrieves entries from the current collection type,
 * presents them in a sortable list, and enables saving changes via a submit button.
 *
 * @param uid - The unique identifier of the content type which entries are sorted.
 * @param mainField - The displayed field of each entry in the collection type.
 * @param contentType - The content type configuration.
 * @param mode - The sort mode: `"global"` for legacy behaviour or `"scoped"` for scoped sort within active filters.
 * @param label - Optional label for the trigger button (mainly used for scoped mode).
 */
declare const SortModal: ({ uid, mainField, contentType, mode, label }: SortModalProps) => import("react/jsx-runtime").JSX.Element;
export default SortModal;
