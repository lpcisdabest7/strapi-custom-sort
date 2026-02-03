import type { DragEndEvent, SortableList } from 'src/types';
/**
 * A sortable list.
 *
 * @param list - The list that should be sorted.
 * @param onDragEnd - The event handler that is called on drag end.
 * @param disabled - Boolean flag whether sorting is disabled.
 * @param heading - The heading displayed above the sortable list.
 */
declare const SortableList: ({ list, onDragEnd, disabled, heading, }: {
    list: SortableList;
    onDragEnd: DragEndEvent;
    disabled: boolean;
    heading: string;
}) => import("react/jsx-runtime").JSX.Element;
export default SortableList;
