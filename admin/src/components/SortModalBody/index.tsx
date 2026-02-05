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
  // Handle case where relationItem is just an ID (string or number)
  // This happens when backend doesn't populate relation fields
  if (typeof relationItem === 'string' || typeof relationItem === 'number') {
    return String(relationItem);
  }

  if (typeof relationItem !== 'object' || relationItem === null) {
    return String(relationItem);
  }

  // Try common display fields first (expanded list)
  const displayFields = [
    'title',
    'name',
    'label',
    'slug',
    'code',
    'description',
    'text',
    'value',
    'displayName',
    'display_name',
  ];
  for (const field of displayFields) {
    const value = relationItem[field];
    if (value !== null && value !== undefined && value !== '') {
      return String(value);
    }
  }
  // Try to find any string field that might be a display field
  // (excluding system fields and objects)
  for (const key in relationItem) {
    if (
      relationItem.hasOwnProperty(key) &&
      typeof relationItem[key] === 'string' &&
      relationItem[key] !== '' &&
      !['documentId', 'id', 'createdAt', 'updatedAt', 'publishedAt'].includes(key)
    ) {
      return relationItem[key];
    }
  }
  // Fall back to documentId or id
  return relationItem.documentId || relationItem.id || 'Unknown';
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
          .filter((label: string) => label && label !== 'Unknown');
        if (arrayLabels.length > 0) {
          labels.push(arrayLabels.join(', '));
        }
      } else if (typeof relationValue === 'object' && relationValue !== null) {
        const displayValue = getRelationDisplayValue(relationValue);
        if (displayValue && displayValue !== 'Unknown') {
          labels.push(displayValue);
        }
      } else if (relationValue !== null && relationValue !== undefined && relationValue !== '') {
        // Handle primitive values (shouldn't happen with proper populate, but just in case)
        labels.push(String(relationValue));
      }
    }
  });
  return labels.length > 0 ? labels.join(' - ') : '';
};

//
// Components
//

/**
 * Gets the display value from a field, handling relation fields and system fields.
 */
const getFieldDisplayValue = (entry: any, fieldName: string, contentType: any): string | null => {
  if (!fieldName || !contentType?.attributes?.[fieldName]) {
    return null;
  }

  const attribute = contentType.attributes[fieldName];
  const value = entry[fieldName];

  // Handle relation fields
  if (attribute.type === 'relation' || attribute.type === 'media') {
    if (Array.isArray(value)) {
      const labels = value
        .map((item: any) => getRelationDisplayValue(item))
        .filter((label: string) => label && label !== 'Unknown');
      return labels.length > 0 ? labels.join(', ') : null;
    } else if (value && typeof value === 'object') {
      const displayValue = getRelationDisplayValue(value);
      return displayValue && displayValue !== 'Unknown' ? displayValue : null;
    }
    return null;
  }

  // Handle regular fields
  if (value !== null && value !== undefined && value !== '') {
    return String(value);
  }

  return null;
};

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
const SortModalBody = ({
  entriesFetchState,
  mainField,
  additionalFields = [],
  contentType,
  handleDragEnd,
  disabled,
}: {
  entriesFetchState: EntriesFetchState;
  mainField: string;
  additionalFields?: string[];
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
      const hasMainFieldInAttributes =
        contentType?.attributes && mainField in contentType.attributes;
      const isMainFieldSystem = isSystemField(mainField);

      // Only use relation fields if mainField is a system field AND we have relation fields available
      // Otherwise, try to use mainField first
      const relationFields = getRelationFields(contentType);
      const shouldUseRelationFields = isMainFieldSystem && relationFields.length > 0;

      // Debug logging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('[SortModalBody] Debug info:', {
          mainField,
          isMainFieldSystem,
          relationFields,
          shouldUseRelationFields,
          firstEntry: entries[0],
          firstEntryRelations: relationFields.reduce(
            (acc, field) => {
              acc[field] = entries[0]?.[field];
              return acc;
            },
            {} as Record<string, any>
          ),
        });
      }

      // Converts the data-models into view-models for the `<SortableList />` component.
      const sortableList: SortableList = entries.map((entry) => {
        const labelParts: string[] = [];

        // Get main field value
        const mainFieldValue = getFieldDisplayValue(entry, mainField, contentType);
        if (mainFieldValue) {
          labelParts.push(mainFieldValue);
        } else if (!isMainFieldSystem && shouldUseRelationFields && relationFields.length > 0) {
          // Fallback to relation fields if mainField is empty
          const relationLabel = formatRelationLabel(entry, relationFields);
          if (relationLabel) {
            labelParts.push(relationLabel);
          }
        } else if (isMainFieldSystem && shouldUseRelationFields && relationFields.length > 0) {
          // Use relation fields if mainField is a system field
          const relationLabel = formatRelationLabel(entry, relationFields);
          if (relationLabel) {
            labelParts.push(relationLabel);
          }
        }

        // Get additional field values
        additionalFields.forEach((fieldName) => {
          const fieldValue = getFieldDisplayValue(entry, fieldName, contentType);
          if (fieldValue) {
            labelParts.push(fieldValue);
          }
        });

        // Build final label
        let label: string;
        if (labelParts.length > 0) {
          label = labelParts.join(' - ');
        } else {
          label = `Entry ${entry.documentId}`;
        }

        return {
          id: entry.documentId,
          label,
        };
      });

      // Build heading from all fields
      const headingParts: string[] = [mainField];
      if (additionalFields.length > 0) {
        headingParts.push(...additionalFields);
      }
      const heading = headingParts.join(' - ');

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
