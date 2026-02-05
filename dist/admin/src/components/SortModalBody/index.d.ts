import type { DragEndEvent, EntriesFetchState } from 'src/types';
/**
 * Returns different elements for the modal body, depending on the current fetch status.
 *
 * @param entriesFetchState - The state for fetching the entries.
 * @param mainField - The displayed field of each entry in the collection type.
 * @param additionalFields - Optional array of additional fields to display.
 * @param contentType - The content type configuration.
 * @param handleDragEnd - The event handler that is called on drag end.
 * @param disabled - Boolean flag whether sorting is disabled.
 */
declare const SortModalBody: ({ entriesFetchState, mainField, additionalFields, contentType, handleDragEnd, disabled, }: {
    entriesFetchState: EntriesFetchState;
    mainField: string;
    additionalFields?: string[];
    contentType: any;
    handleDragEnd: DragEndEvent;
    disabled: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export default SortModalBody;
