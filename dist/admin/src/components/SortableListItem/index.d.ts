import type { UniqueIdentifier } from '../../types';
/**
 * A single item in the sortable list.
 *
 * @param id - The unique identifier of the list item.
 * @param label - The title to show in the list item.
 */
declare const SortableListItem: ({ id, label }: {
    id: UniqueIdentifier;
    label: string;
}) => import("react/jsx-runtime").JSX.Element;
export default SortableListItem;
