import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import { useFetchClient, useNotification, useQueryParams } from '@strapi/strapi/admin';
import {
  Button,
  IconButton,
  Modal,
  Box,
  Typography,
  SingleSelect,
  SingleSelectOption,
  TextInput,
  Divider,
  Flex,
  Grid,
  TooltipProvider,
} from '@strapi/design-system';
import { Drag } from '@strapi/icons';

import { FetchStatus } from '../../constants';
import { prefixKey } from '../../utils/prefixKey';
import SortModalBody from '../SortModalBody';
import { config as pluginConfig } from '../../config';

//
// Types
//

import type { UID as StrapiUID } from '@strapi/strapi';
import type { Entries, DragEndEvent, EntriesFetchState, UniqueIdentifier } from 'src/types';

//
// Config
//

const config = {
  /** The configuration for the fetch entries request. */
  fetchEntriesRequest: {
    /** The path to fetch the entries of the collection type with the given `uid`. */
    path: (uid: string) => `/sortable-entries/fetch-entries/${uid}`,
  },

  /** The configuration for the update sort order request. */
  updateSortOrderRequest: {
    /** The path to update the sort order of the collection type with the given `uid`. */
    path: (uid: string) => `/sortable-entries/update-sort-order/${uid}`,
  },
};

//
// Components
//

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
const SortModal = ({ uid, mainField, contentType, mode = 'global', label }: SortModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { toggleNotification } = useNotification();
  const { formatMessage } = useIntl();
  const translate = (key: string): string => formatMessage({ id: prefixKey(key) });

  const fetchClient = useFetchClient();
  const [entriesFetchState, setEntriesFetchState] = useState<EntriesFetchState>({
    status: FetchStatus.Initial,
  });

  // Display field selection state
  const [selectedDisplayField, setSelectedDisplayField] = useState<string>(mainField);
  const [additionalDisplayField1, setAdditionalDisplayField1] = useState<string>('');
  const [additionalDisplayField2, setAdditionalDisplayField2] = useState<string>('');

  // Scoped filter selection state
  const [selectedFilterField, setSelectedFilterField] = useState<string>('');
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<Array<{ id: string; label: string }>>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  /**
   * Resolve which sort field is actually used for this content type.
   *
   * - We support multiple candidate field names (sort, sortOrder, order, orderIndex).
   */
  const resolvedSortField = useMemo(() => {
    if (!contentType?.attributes) {
      return pluginConfig.sortOrderField;
    }

    const attributes = contentType.attributes;

    for (const candidate of pluginConfig.sortFieldCandidates) {
      const attribute = attributes[candidate];
      if (attribute && attribute.type === 'integer') {
        return candidate;
      }
    }

    const fallbackAttr = attributes[pluginConfig.sortOrderField];
    if (fallbackAttr && fallbackAttr.type === 'integer') {
      return pluginConfig.sortOrderField;
    }

    return pluginConfig.sortOrderField;
  }, [contentType]);

  const initialParams = { filters: undefined, plugins: { i18n: { locale: undefined } } };
  const [queryParams, _] = useQueryParams(initialParams);
  const listViewFilters = queryParams.query.filters;
  const locale = queryParams.query.plugins.i18n.locale;

  /**
   * Builds a Strapi filter object from selected field and value.
   * Supports various field types: relation, enumeration, string, number, boolean, date, etc.
   */
  const buildFilterFromSelection = (field: string, value: string): any => {
    const attribute = contentType?.attributes?.[field];
    if (!attribute) {
      return {};
    }

    // Handle relation fields
    if (attribute.type === 'relation') {
      // For relation fields in Strapi v5, filter by documentId nested
      // Format: { field: { documentId: { $in: [value] } } }
      return {
        [field]: {
          documentId: {
            $in: [value],
          },
        },
      };
    }

    // Handle enumeration fields
    if (attribute.type === 'enumeration') {
      // For enumeration fields, use $eq for exact match
      return {
        [field]: {
          $eq: value,
        },
      };
    }

    // Handle numeric fields (integer, biginteger, float, decimal)
    if (['integer', 'biginteger', 'float', 'decimal'].includes(attribute.type)) {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        return {
          [field]: {
            $eq: numValue,
          },
        };
      }
      // If not a valid number, use $contains as fallback
      return {
        [field]: {
          $contains: [value],
        },
      };
    }

    // Handle boolean fields
    if (attribute.type === 'boolean') {
      const boolValue = value === 'true' || value === '1' || value === 'yes';
      return {
        [field]: {
          $eq: boolValue,
        },
      };
    }

    // Handle date/datetime fields
    if (['date', 'datetime', 'time', 'timestamp'].includes(attribute.type)) {
      // For date fields, use $eq for exact match or $gte/$lte for range
      // For now, use $eq
      return {
        [field]: {
          $eq: value,
        },
      };
    }

    // Handle string/text fields (string, text, richtext, email, password)
    // Use $contains for partial match
    return {
      [field]: {
        $contains: [value],
      },
    };
  };

  // Use selected filter for scoped mode, otherwise use list view filters
  // Use JSON.stringify to create stable reference for comparison
  const filters = useMemo(() => {
    if (mode === 'scoped' && selectedFilterField && selectedFilterValue) {
      return buildFilterFromSelection(selectedFilterField, selectedFilterValue);
    }
    return listViewFilters;
  }, [mode, selectedFilterField, selectedFilterValue, listViewFilters]);

  // Create stable filters string for comparison
  const filtersString = useMemo(() => JSON.stringify(filters), [filters]);

  /**
   * Fetches available options for a filterable field (relation or enumeration).
   */
  const fetchFilterOptions = useCallback(
    async (fieldName: string) => {
      if (!fieldName || !contentType?.attributes?.[fieldName]) {
        setFilterOptions([]);
        return;
      }

      setIsLoadingOptions(true);
      try {
        const attribute = contentType.attributes[fieldName];

        // Handle enumeration fields
        if (attribute.type === 'enumeration' && attribute.enum) {
          const enumValues = Array.isArray(attribute.enum) ? attribute.enum : [];
          const options = enumValues.map((enumValue: string) => ({
            id: enumValue,
            label: enumValue,
          }));
          setFilterOptions(options);
          return;
        }

        // Handle relation fields
        if (attribute.type === 'relation' && attribute.target) {
          // Extract target UID from attribute (e.g., "api::test-category.test-category")
          const targetUid = attribute.target;

          // Fetch entries from the target collection using Strapi's document API
          // Limit to 100 entries to avoid performance issues
          // IMPORTANT: Do NOT specify sort parameter to avoid "Invalid key name" errors
          // Strapi will use default sorting (usually by id or documentId)
          const params = {
            pageSize: 100, // Limit to 100 options to avoid lag
            // Explicitly do NOT include sort parameter
          };

          try {
            // First, try to get the target contentType schema to find displayable fields
            let targetContentType: any = null;
            try {
              const contentTypeResponse = await fetchClient.get(
                `/content-type-builder/content-types/${targetUid}`
              );
              targetContentType = contentTypeResponse?.data?.data;
            } catch (schemaError) {
              // If we can't get schema, continue without it
              console.warn('Could not fetch target contentType schema:', schemaError);
            }

            // Get all entries
            const targetEntries = await fetchClient.get(
              `/content-manager/collection-types/${targetUid}`,
              { params }
            );

            // Handle different response formats
            const entries = targetEntries?.data?.results || targetEntries?.data || [];

            // Find displayable fields from schema (string, text, email, etc.)
            const displayableFieldNames: string[] = [];
            if (targetContentType?.attributes) {
              Object.keys(targetContentType.attributes).forEach((fieldName) => {
                const field = targetContentType.attributes[fieldName];
                // Include string-like fields that are good for display
                if (
                  ['string', 'text', 'email', 'enumeration'].includes(field.type) ||
                  fieldName === 'name' ||
                  fieldName === 'title' ||
                  fieldName === 'label' ||
                  fieldName === 'slug'
                ) {
                  displayableFieldNames.push(fieldName);
                }
              });
            }

            // Common field names to try (in priority order)
            const commonDisplayFields = ['name', 'title', 'label', 'slug', 'code', 'value'];

            // Map to options format
            const options = entries.map((entry: any) => {
              let displayValue: string | null = null;

              // First, try fields from schema (in order)
              for (const fieldName of displayableFieldNames) {
                const value = entry[fieldName];
                if (value !== null && value !== undefined && value !== '') {
                  displayValue = String(value);
                  break;
                }
              }

              // If no value found from schema fields, try common fields
              if (!displayValue) {
                for (const fieldName of commonDisplayFields) {
                  const value = entry[fieldName];
                  if (value !== null && value !== undefined && value !== '') {
                    displayValue = String(value);
                    break;
                  }
                }
              }

              // If still no value, try to find any non-empty string field
              if (!displayValue) {
                for (const [key, value] of Object.entries(entry)) {
                  // Skip internal fields
                  if (
                    [
                      'id',
                      'documentId',
                      'createdAt',
                      'updatedAt',
                      'publishedAt',
                      'createdBy',
                      'updatedBy',
                    ].includes(key)
                  ) {
                    continue;
                  }
                  if (
                    value !== null &&
                    value !== undefined &&
                    value !== '' &&
                    typeof value === 'string'
                  ) {
                    displayValue = String(value);
                    break;
                  }
                }
              }

              // Final fallback to documentId or id
              if (!displayValue) {
                displayValue = entry.documentId || String(entry.id);
              }

              return {
                id: entry.documentId || String(entry.id),
                label: displayValue,
              };
            });

            setFilterOptions(options);
            return;
          } catch (error: any) {
            // If request failed, log error but don't retry with sort (we never use sort)
            console.error('Failed to fetch relation options:', error);
            setFilterOptions([]);
            return;
          }
        }

        // For other field types (string, number, boolean, date, etc.), we can't fetch options
        // User will need to type the value manually - show empty options
        setFilterOptions([]);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
        setFilterOptions([]);
      } finally {
        setIsLoadingOptions(false);
      }
    },
    [contentType, fetchClient]
  );

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
   * Gets all filterable fields from contentType attributes.
   * Includes: relation, enumeration, string, number, boolean, date, email, etc.
   * Excludes: system fields and complex types that can't be easily filtered.
   */
  const getFilterableFieldsMemo = useMemo(() => {
    if (!contentType || !contentType.attributes) {
      return [];
    }
    const filterableFields: string[] = [];
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
      'strapi_stage',
      'strapi_assignee',
    ];

    Object.keys(contentType.attributes).forEach((fieldName) => {
      // Skip system fields
      if (systemFields.includes(fieldName)) {
        return;
      }

      const attribute = contentType.attributes[fieldName];
      if (!attribute || !attribute.type) {
        return;
      }

      // Include all filterable field types
      const filterableTypes = [
        'relation',
        'media',
        'enumeration',
        'string',
        'text',
        'richtext',
        'email',
        'password',
        'integer',
        'biginteger',
        'float',
        'decimal',
        'date',
        'time',
        'datetime',
        'timestamp',
        'boolean',
      ];

      if (
        filterableTypes.includes(attribute.type) ||
        (attribute.type &&
          typeof attribute.type === 'string' &&
          attribute.type.includes('relation'))
      ) {
        filterableFields.push(fieldName);
      }
    });
    return filterableFields;
  }, [contentType]);

  /**
   * Gets all displayable fields from contentType attributes.
   * Includes: string, text, email, enumeration, relation, media, number, boolean, date, etc.
   * Excludes: system fields and the sort order field.
   */
  const getDisplayableFieldsMemo = useMemo(() => {
    if (!contentType || !contentType.attributes) {
      return [];
    }
    const displayableFields: string[] = [];
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
      'strapi_stage',
      'strapi_assignee',
    ];

    Object.keys(contentType.attributes).forEach((fieldName) => {
      // Skip system fields
      if (systemFields.includes(fieldName)) {
        return;
      }

      // Skip the sort order field
      if (fieldName === resolvedSortField) {
        return;
      }

      const attribute = contentType.attributes[fieldName];
      if (!attribute || !attribute.type) {
        return;
      }

      // Include all displayable field types
      const displayableTypes = [
        'string',
        'text',
        'richtext',
        'email',
        'password',
        'enumeration',
        'integer',
        'biginteger',
        'float',
        'decimal',
        'boolean',
        'date',
        'time',
        'datetime',
        'timestamp',
        'relation',
        'media',
      ];

      if (
        displayableTypes.includes(attribute.type) ||
        (attribute.type &&
          typeof attribute.type === 'string' &&
          attribute.type.includes('relation'))
      ) {
        displayableFields.push(fieldName);
      }
    });
    return displayableFields;
  }, [contentType, resolvedSortField]);

  // Use ref to track if we're currently fetching to prevent duplicate calls
  const isFetchingRef = useRef(false);
  // Use ref to store abort controller for canceling requests
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetches the entries of the current collection type.
   */
  const fetchEntries = useCallback(async () => {
    // Prevent duplicate calls
    if (isFetchingRef.current) {
      return;
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    isFetchingRef.current = true;
    setEntriesFetchState({ status: FetchStatus.Loading });

    try {
      // Collect all display fields (main + additional)
      const allDisplayFields = [
        selectedDisplayField,
        additionalDisplayField1,
        additionalDisplayField2,
      ].filter((field) => field && field !== '');

      // Determine which relation fields should be populated on the backend.
      // - Always include relation/media fields that are used as display fields.
      // - If no relation display field is selected, keep the previous behaviour:
      //   when using only system fields as display fields, fall back to all
      //   relation fields from the content type (for backwards compatibility).
      const relationDisplayFields: string[] = allDisplayFields.filter((fieldName) => {
        const attr = contentType?.attributes?.[fieldName];
        return attr?.type === 'relation' || attr?.type === 'media';
      });

      const hasSystemDisplayField = allDisplayFields.some((field) => isSystemField(field));

      let relationFieldsForPopulate: string[] = [...relationDisplayFields];

      if (relationFieldsForPopulate.length === 0 && hasSystemDisplayField) {
        relationFieldsForPopulate = getFilterableFieldsMemo.filter((fieldName) => {
          const attr = contentType?.attributes?.[fieldName];
          return attr?.type === 'relation' || attr?.type === 'media';
        });
      }

      const relationFieldsParam =
        relationFieldsForPopulate.length > 0 ? relationFieldsForPopulate.join(',') : undefined;

      // Collect additional fields (excluding empty and main field)
      const additionalFieldsArray = [additionalDisplayField1, additionalDisplayField2].filter(
        (field) => field && field !== '' && field !== selectedDisplayField
      );
      const additionalFieldsParam =
        additionalFieldsArray.length > 0 ? additionalFieldsArray.join(',') : undefined;

      const { data: entries } = await fetchClient.get<Entries>(
        mode === 'scoped'
          ? `/sortable-entries/fetch-entries-scoped/${uid}`
          : config.fetchEntriesRequest.path(uid),
        {
          params: {
            mainField: selectedDisplayField,
            filters,
            locale,
            relationFields: relationFieldsParam,
            additionalFields: additionalFieldsParam,
          },
          signal: abortController.signal,
        }
      );

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      setEntriesFetchState({ status: FetchStatus.Resolved, value: entries });
    } catch (error: any) {
      // Ignore abort errors
      if (error?.name === 'AbortError' || abortController.signal.aborted) {
        return;
      }

      // Only log non-abort errors
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error(`Failed to fetch data:`, error.message);
      }

      // This will show a corresponding error message in the modal.
      // We therefore don't need to trigger an extra notification here.
      if (!abortController.signal.aborted) {
        setEntriesFetchState({ status: FetchStatus.Failed });
      }
    } finally {
      // Only reset if this is still the current request
      if (abortControllerRef.current === abortController) {
        isFetchingRef.current = false;
        abortControllerRef.current = null;
      }
    }
  }, [
    uid,
    selectedDisplayField,
    additionalDisplayField1,
    additionalDisplayField2,
    mode,
    filters,
    locale,
    getFilterableFieldsMemo,
    contentType,
    fetchClient,
  ]);

  // Fetch filter options when field selection changes
  useEffect(() => {
    if (isOpen && mode === 'scoped' && selectedFilterField) {
      fetchFilterOptions(selectedFilterField);
    } else {
      setFilterOptions([]);
    }
  }, [selectedFilterField, isOpen, mode, fetchFilterOptions]);

  // Reset selections when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Cancel any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setSelectedDisplayField(mainField);
      setAdditionalDisplayField1('');
      setAdditionalDisplayField2('');
      setSelectedFilterField('');
      setSelectedFilterValue('');
      setFilterOptions([]);
      // Reset refs to prevent stale state
      isFetchingRef.current = false;
      prevFetchParamsRef.current = '';
    }
  }, [isOpen, mainField]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Use ref to track previous values to prevent unnecessary fetches
  const prevFetchParamsRef = useRef<string>('');

  // Fetch the entries when modal opens or filter changes
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // For scoped mode, only fetch if filter is selected
    if (mode === 'scoped') {
      if (!selectedFilterField || !selectedFilterValue) {
        return;
      }
    }

    // Create a unique key for current fetch parameters
    const fetchKey = JSON.stringify({
      isOpen,
      mode,
      selectedDisplayField,
      additionalDisplayField1,
      additionalDisplayField2,
      selectedFilterField,
      selectedFilterValue,
      filtersString,
      locale,
    });

    // Only fetch if parameters actually changed
    if (prevFetchParamsRef.current === fetchKey) {
      return;
    }

    prevFetchParamsRef.current = fetchKey;

    // Increased delay to debounce rapid changes and reduce API calls
    const timeoutId = setTimeout(() => {
      fetchEntries();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    isOpen,
    mode,
    selectedDisplayField,
    additionalDisplayField1,
    additionalDisplayField2,
    selectedFilterField,
    selectedFilterValue,
    filtersString,
    locale,
    fetchEntries,
  ]);

  /**
   * The callback for the drag-end event.
   *
   * - See also: https://docs.dndkit.com/presets/sortable
   */
  const handleDragEnd: DragEndEvent = (activeID: UniqueIdentifier, overID: UniqueIdentifier) => {
    setEntriesFetchState((entriesFetchState) => {
      if (entriesFetchState.status !== FetchStatus.Resolved) {
        return entriesFetchState;
      }

      const oldEntries = entriesFetchState.value;
      const oldIndex = oldEntries.findIndex((entry) => entry.documentId === activeID);
      const newIndex = oldEntries.findIndex((entry) => entry.documentId === overID);
      const newEntries = arrayMove(oldEntries, oldIndex, newIndex);

      return { status: FetchStatus.Resolved, value: newEntries };
    });
  };

  /**
   * The callback for the submit event.
   */
  const handleSubmit = async () => {
    if (entriesFetchState.status !== FetchStatus.Resolved) {
      console.error('Expect submit button to be disabled in a non `resolved` fetch state.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Converts the data-models into data-models for the POST request below.
      const entries = entriesFetchState.value;
      const sortedDocumentIds = entries.map((entry) => entry.documentId);

      await fetchClient.post(
        mode === 'scoped'
          ? `/sortable-entries/update-sort-order-scoped/${uid}`
          : config.updateSortOrderRequest.path(uid),
        {
          data: {
            sortedDocumentIds,
            filters,
            locale,
          },
        }
      );

      setIsOpen(false);

      // Workaround to refresh only the list view without reloading the entire page:
      // Appends a timestamp-based query parameter to trigger a targeted refresh.
      //
      // Based on:
      // https://stackoverflow.com/a/71466484
      const timestamp = String(Date.now());
      searchParams.set('t', timestamp);
      setSearchParams(searchParams);
    } catch (error) {
      console.error(`Failed to submit data: ${error}`);

      // We failed to submit the data.
      // This can e.g. happen when the entries of a filtered modal are outdated.
      toggleNotification({ type: 'danger', message: translate('notification.failure') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitButtonDisabled = isSubmitting || entriesFetchState.status !== FetchStatus.Resolved;
  const isSubmitButtonLoading = isSubmitting;

  return (
    <Modal.Root open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Trigger>
        {mode === 'scoped' && label ? (
          <Button variant="secondary" size="S">
            {label}
          </Button>
        ) : (
          <IconButton>
            <Drag />
          </IconButton>
        )}
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <FormattedMessage id={prefixKey('title')} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TooltipProvider>
            {/* Main Display Field Section */}
            <Box paddingBottom={4}>
              <Typography variant="omega" fontWeight="semiBold" as="label" textColor="neutral800">
                Sort by field
              </Typography>
              <Box paddingTop={2}>
                <SingleSelect
                  value={selectedDisplayField || mainField}
                  onChange={(value: string) => {
                    if (value) {
                      setSelectedDisplayField(value);
                    }
                  }}
                  disabled={isSubmitting}
                  placeholder="Select a field"
                  error={undefined}
                >
                  <SingleSelectOption value={mainField}>{mainField} (default)</SingleSelectOption>
                  {getDisplayableFieldsMemo
                    .filter((fieldName) => fieldName !== mainField)
                    .map((fieldName) => {
                      const attr = contentType?.attributes?.[fieldName];
                      const fieldType =
                        attr?.type === 'enumeration'
                          ? ' (enum)'
                          : attr?.type === 'relation'
                            ? ' (relation)'
                            : attr?.type === 'media'
                              ? ' (media)'
                              : '';
                      return (
                        <SingleSelectOption key={fieldName} value={fieldName}>
                          {fieldName}
                          {fieldType}
                        </SingleSelectOption>
                      );
                    })}
                </SingleSelect>
              </Box>
            </Box>

            {/* Divider */}
            <Divider />

            {/* Additional Fields Section */}
            <Box paddingTop={4} paddingBottom={4}>
              <Typography
                variant="omega"
                fontWeight="semiBold"
                as="label"
                textColor="neutral600"
                paddingBottom={3}
              >
                Additional display fields (optional)
              </Typography>
              <Grid.Root gap={3} columns={2}>
                <Grid.Item col={1}>
                  <Box>
                    <Typography variant="pi" fontWeight="medium" as="label" textColor="neutral700">
                      Field 1
                    </Typography>
                    <Box paddingTop={2}>
                      <SingleSelect
                        value={additionalDisplayField1 || undefined}
                        onChange={(value: string) => {
                          setAdditionalDisplayField1(value || '');
                        }}
                        disabled={isSubmitting}
                        placeholder="None"
                        clearLabel="Clear selection"
                        onClear={() => setAdditionalDisplayField1('')}
                        error={undefined}
                      >
                        <SingleSelectOption value="">None</SingleSelectOption>
                        {getDisplayableFieldsMemo
                          .filter(
                            (fieldName) =>
                              fieldName !== selectedDisplayField &&
                              fieldName !== additionalDisplayField2
                          )
                          .map((fieldName) => {
                            const attr = contentType?.attributes?.[fieldName];
                            const fieldType =
                              attr?.type === 'enumeration'
                                ? ' (enum)'
                                : attr?.type === 'relation'
                                  ? ' (relation)'
                                  : attr?.type === 'media'
                                    ? ' (media)'
                                    : '';
                            return (
                              <SingleSelectOption key={fieldName} value={fieldName}>
                                {fieldName}
                                {fieldType}
                              </SingleSelectOption>
                            );
                          })}
                      </SingleSelect>
                    </Box>
                  </Box>
                </Grid.Item>
                <Grid.Item col={1}>
                  <Box>
                    <Typography variant="pi" fontWeight="medium" as="label" textColor="neutral700">
                      Field 2
                    </Typography>
                    <Box paddingTop={2}>
                      <SingleSelect
                        value={additionalDisplayField2 || undefined}
                        onChange={(value: string) => {
                          setAdditionalDisplayField2(value || '');
                        }}
                        disabled={isSubmitting}
                        placeholder="None"
                        clearLabel="Clear selection"
                        onClear={() => setAdditionalDisplayField2('')}
                        error={undefined}
                      >
                        <SingleSelectOption value="">None</SingleSelectOption>
                        {getDisplayableFieldsMemo
                          .filter(
                            (fieldName) =>
                              fieldName !== selectedDisplayField &&
                              fieldName !== additionalDisplayField1
                          )
                          .map((fieldName) => {
                            const attr = contentType?.attributes?.[fieldName];
                            const fieldType =
                              attr?.type === 'enumeration'
                                ? ' (enum)'
                                : attr?.type === 'relation'
                                  ? ' (relation)'
                                  : attr?.type === 'media'
                                    ? ' (media)'
                                    : '';
                            return (
                              <SingleSelectOption key={fieldName} value={fieldName}>
                                {fieldName}
                                {fieldType}
                              </SingleSelectOption>
                            );
                          })}
                      </SingleSelect>
                    </Box>
                  </Box>
                </Grid.Item>
              </Grid.Root>
            </Box>
            {mode === 'scoped' && (
              <>
                <Divider />
                <Box paddingTop={4} paddingBottom={4}>
                  <Box paddingBottom={3}>
                    <Typography
                      variant="omega"
                      fontWeight="semiBold"
                      as="label"
                      textColor="neutral800"
                    >
                      Filter by field
                    </Typography>
                    <Box paddingTop={2}>
                      <SingleSelect
                        value={selectedFilterField || undefined}
                        onChange={(value: string) => {
                          setSelectedFilterField(value || '');
                          setSelectedFilterValue(''); // Reset value when field changes
                        }}
                        disabled={isSubmitting}
                        placeholder="Select a field to filter by"
                        clearLabel="Clear selection"
                        onClear={() => {
                          setSelectedFilterField('');
                          setSelectedFilterValue('');
                        }}
                        error={undefined}
                      >
                        {getFilterableFieldsMemo.map((fieldName) => {
                          const attr = contentType?.attributes?.[fieldName];
                          const fieldType =
                            attr?.type === 'enumeration'
                              ? ' (enum)'
                              : attr?.type === 'relation'
                                ? ' (relation)'
                                : '';
                          return (
                            <SingleSelectOption key={fieldName} value={fieldName}>
                              {fieldName}
                              {fieldType}
                            </SingleSelectOption>
                          );
                        })}
                      </SingleSelect>
                    </Box>
                  </Box>
                  {selectedFilterField &&
                    (() => {
                      const selectedAttr = contentType?.attributes?.[selectedFilterField];
                      const isRelationOrEnum =
                        selectedAttr?.type === 'relation' || selectedAttr?.type === 'enumeration';
                      const needsTextInput = !isRelationOrEnum && filterOptions.length === 0;

                      return (
                        <Box>
                          <Typography
                            variant="omega"
                            fontWeight="semiBold"
                            as="label"
                            textColor="neutral800"
                          >
                            Filter value
                          </Typography>
                          <Box paddingTop={2}>
                            {needsTextInput ? (
                              // Text input for string, number, boolean, date, etc.
                              <TextInput
                                type={
                                  selectedAttr?.type === 'boolean'
                                    ? 'text'
                                    : selectedAttr?.type === 'date' ||
                                        selectedAttr?.type === 'datetime'
                                      ? 'date'
                                      : ['integer', 'biginteger', 'float', 'decimal'].includes(
                                            selectedAttr?.type || ''
                                          )
                                        ? 'number'
                                        : 'text'
                                }
                                value={selectedFilterValue}
                                onChange={(e: { target: { value: string } }) =>
                                  setSelectedFilterValue(e.target.value)
                                }
                                disabled={isSubmitting}
                                placeholder={
                                  selectedAttr?.type === 'boolean'
                                    ? 'Enter true/false'
                                    : selectedAttr?.type === 'date' ||
                                        selectedAttr?.type === 'datetime'
                                      ? 'Select date'
                                      : `Enter ${selectedAttr?.type || 'value'}`
                                }
                              />
                            ) : (
                              // Select dropdown for relation and enumeration
                              <SingleSelect
                                value={selectedFilterValue || undefined}
                                onChange={(value: string) => setSelectedFilterValue(value || '')}
                                disabled={
                                  isSubmitting || isLoadingOptions || filterOptions.length === 0
                                }
                                placeholder={
                                  isLoadingOptions ? 'Loading options...' : 'Select a value'
                                }
                                clearLabel="Clear selection"
                                onClear={() => setSelectedFilterValue('')}
                                error={undefined}
                              >
                                {filterOptions.map((option) => (
                                  <SingleSelectOption key={option.id} value={option.id}>
                                    {option.label}
                                  </SingleSelectOption>
                                ))}
                              </SingleSelect>
                            )}
                          </Box>
                        </Box>
                      );
                    })()}
                </Box>
              </>
            )}
            {mode === 'scoped' && (!selectedFilterField || !selectedFilterValue) ? (
              <Box padding={4}>
                <Typography variant="omega" textColor="neutral600">
                  Please select a field and value to filter entries.
                </Typography>
              </Box>
            ) : (
              <SortModalBody
                entriesFetchState={entriesFetchState}
                mainField={selectedDisplayField}
                additionalFields={[additionalDisplayField1, additionalDisplayField2].filter(
                  (f) => f && f !== ''
                )}
                contentType={contentType}
                handleDragEnd={handleDragEnd}
                disabled={isSubmitting}
              />
            )}
          </TooltipProvider>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button variant="tertiary">
              <FormattedMessage id={prefixKey('cancel-button.title')} />
            </Button>
          </Modal.Close>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitButtonDisabled}
            loading={isSubmitButtonLoading}
          >
            <FormattedMessage id={prefixKey('submit-button.title')} />
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default SortModal;
