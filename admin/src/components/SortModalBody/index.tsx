import { EmptyStateLayout, Loader } from '@strapi/design-system';

import { useIntl } from 'react-intl';

import { FetchStatus } from '../../constants';
import { prefixKey } from '../../utils/prefixKey';
import SortableListComponent from '../SortableList';

//
// Types
//

import type { DragEndEvent, EntriesFetchState, SortableList } from 'src/types';

//
// Helpers
//

/**
 * Checks if a field is a system field (not a user-defined field).
 */
const isSystemField = (fieldName: string): boolean => {
  const systemFields = [
    'documentId',
    'id',
    'createdAt',
    'updatedAt',
    'publishedAt',
    'createdBy',
    'updatedBy',
    'locale',
    'localizations',
  ];
  return systemFields.includes(fieldName);
};

/**
 * Gets all relation fields from contentType attributes.
 */
const getRelationFields = (contentType: any): string[] => {
  if (!contentType || !contentType.attributes) {
    return [];
  }
  const relationFields: string[] = [];
  Object.keys(contentType.attributes).forEach((fieldName) => {
    const attribute = contentType.attributes[fieldName];
    if (
      attribute.type === 'relation' ||
      attribute.type === 'media' ||
      (attribute.type && typeof attribute.type === 'string' && attribute.type.includes('relation'))
    ) {
      relationFields.push(fieldName);
    }
  });
  return relationFields;
};

/**
 * Gets a display label from a relation object.
 * Tries to find a meaningful field (title, name, etc.) or falls back to documentId.
 */
const getRelationDisplayValue = (relationItem: any): string => {
  if (typeof relationItem !== 'object' || relationItem === null) {
    return String(relationItem);
  }
  // Try common display fields first
  const displayFields = ['title', 'name', 'label', 'slug', 'code'];
  for (const field of displayFields) {
    if (relationItem[field] !== null && relationItem[field] !== undefined) {
      return String(relationItem[field]);
    }
  }
  // Fall back to documentId or id
  return relationItem.documentId || relationItem.id || JSON.stringify(relationItem);
};

/**
 * Formats the label from relation fields.
 * If multiple relation fields exist, joins them with a hyphen.
 */
const formatRelationLabel = (entry: any, relationFields: string[]): string => {
  const labels: string[] = [];
  relationFields.forEach((fieldName) => {
    const relationValue = entry[fieldName];
    if (relationValue) {
      if (Array.isArray(relationValue)) {
        const arrayLabels = relationValue
          .map((item: any) => getRelationDisplayValue(item))
          .filter((label: string) => label);
        if (arrayLabels.length > 0) {
          labels.push(arrayLabels.join(', '));
        }
      } else if (typeof relationValue === 'object' && relationValue !== null) {
        labels.push(getRelationDisplayValue(relationValue));
      } else {
        labels.push(String(relationValue));
      }
    }
  });
  return labels.length > 0 ? labels.join('-') : '';
};

//
// Components
//

/**
 * Returns different elements for the modal body, depending on the current fetch status.
 *
 * @param entriesFetchState - The state for fetching the entries.
 * @param mainField - The displayed field of each entry in the collection type.
 * @param contentType - The content type configuration.
 * @param handleDragEnd - The event handler that is called on drag end.
 * @param disabled - Boolean flag whether sorting is disabled.
 */
const SortModalBody = ({
  entriesFetchState,
  mainField,
  contentType,
  handleDragEnd,
  disabled,
}: {
  entriesFetchState: EntriesFetchState;
  mainField: string;
  contentType: any;
  handleDragEnd: DragEndEvent;
  disabled: boolean;
}) => {
  const { formatMessage } = useIntl();
  const translate = (key: string): string => formatMessage({ id: prefixKey(key) });

  switch (entriesFetchState.status) {
    case FetchStatus.Initial:
    case FetchStatus.Loading:
      return <Loader />;

    case FetchStatus.Failed:
      return <EmptyStateLayout content={translate('empty-state.failure')} />;

    case FetchStatus.Resolved:
      const entries = entriesFetchState.value;
      if (entries.length === 0) {
        return <EmptyStateLayout content={translate('empty-state.noContent')} />;
      }

      // Check if mainField is a system field or doesn't exist in contentType attributes
      const hasMainFieldInAttributes = contentType?.attributes && mainField in contentType.attributes;
      const useRelationFields = isSystemField(mainField) || !hasMainFieldInAttributes;
      const relationFields = useRelationFields ? getRelationFields(contentType) : [];

      // Converts the data-models into view-models for the `<SortableList />` component.
      const sortableList: SortableList = entries.map((entry) => {
        let label: string;
        if (useRelationFields && relationFields.length > 0) {
          label = formatRelationLabel(entry, relationFields);
          if (!label) {
            label = `Entry ${entry.documentId}`;
          }
        } else {
          const mainFieldValue = entry[mainField];
          label = mainFieldValue !== null && mainFieldValue !== undefined ? String(mainFieldValue) : `Entry ${entry.documentId}`;
        }
        return {
          id: entry.documentId,
          label,
        };
      });

      const heading = useRelationFields && relationFields.length > 0 ? relationFields.join('-') : mainField;

      return (
        <SortableListComponent
          list={sortableList}
          onDragEnd={handleDragEnd}
          disabled={disabled}
          heading={heading}
        />
      );
  }
};

export default SortModalBody;
