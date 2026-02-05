"use strict";
const react = require("react");
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const sortable = require("@dnd-kit/sortable");
const reactIntl = require("react-intl");
const reactRouterDom = require("react-router-dom");
const designSystem = require("@strapi/design-system");
const icons = require("@strapi/icons");
const core = require("@dnd-kit/core");
const styled = require("styled-components");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const styled__default = /* @__PURE__ */ _interopDefault(styled);
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "sortable-entries";
const Initializer = ({ setPlugin }) => {
  const ref = react.useRef(setPlugin);
  react.useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const config$1 = {
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
  sortOrderField: "sortOrder",
  /**
   * Candidate sort field names.
   *
   * - The admin UI will look for the first field in this list that exists on the
   *   current content type and is of type "integer".
   * - This allows using different field names such as "sort", "order" or "orderIndex".
   */
  sortFieldCandidates: ["sort", "sortOrder", "order", "orderIndex"]
};
var FetchStatus = /* @__PURE__ */ ((FetchStatus2) => {
  FetchStatus2["Initial"] = "initial";
  FetchStatus2["Loading"] = "loading";
  FetchStatus2["Resolved"] = "resolved";
  FetchStatus2["Failed"] = "failed";
  return FetchStatus2;
})(FetchStatus || {});
const prefixKey = (key) => `${PLUGIN_ID}.${key}`;
const CSS = /* @__PURE__ */ Object.freeze({
  Translate: {
    toString(transform) {
      if (!transform) {
        return;
      }
      const {
        x,
        y
      } = transform;
      return "translate3d(" + (x ? Math.round(x) : 0) + "px, " + (y ? Math.round(y) : 0) + "px, 0)";
    }
  },
  Scale: {
    toString(transform) {
      if (!transform) {
        return;
      }
      const {
        scaleX,
        scaleY
      } = transform;
      return "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
    }
  },
  Transform: {
    toString(transform) {
      if (!transform) {
        return;
      }
      return [CSS.Translate.toString(transform), CSS.Scale.toString(transform)].join(" ");
    }
  },
  Transition: {
    toString(_ref) {
      let {
        property,
        duration,
        easing
      } = _ref;
      return property + " " + duration + "ms " + easing;
    }
  }
});
const restrictToVerticalAxis = (_ref) => {
  let {
    transform
  } = _ref;
  return {
    ...transform,
    x: 0
  };
};
const SortableListItemLayout = ({ children }) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { marginTop: 4, marginBottom: 4, marginRight: 5, marginLeft: 5, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { gap: 4, children }) });
const DividedListItem = styled__default.default.li`
  border-top: 1px solid ${({ theme }) => theme.colors.neutral150};
  background: ${({ theme }) => theme.colors.neutral0};
`;
const SortableListItem = ({ id, label }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = sortable.useSortable({
    id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Based on:
    // https://github.com/clauderic/dnd-kit/issues/1466
    position: isDragging ? "relative" : "inherit",
    zIndex: isDragging ? 1e3 : 0
  };
  return /* @__PURE__ */ jsxRuntime.jsx(DividedListItem, { ref: setNodeRef, style, ...attributes, ...listeners, children: /* @__PURE__ */ jsxRuntime.jsxs(SortableListItemLayout, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(icons.Drag, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", children: label })
  ] }) });
};
const Container = styled__default.default.div`
  border: 1px solid ${({ theme }) => theme.colors.neutral150};
  border-radius: 4px;
`;
const FadeableList = styled__default.default.ul`
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
`;
const SortableList = ({
  list,
  onDragEnd,
  disabled,
  heading
}) => {
  const sensors = core.useSensors(
    core.useSensor(core.PointerSensor),
    core.useSensor(core.KeyboardSensor, {
      coordinateGetter: sortable.sortableKeyboardCoordinates
    })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    if (active.id === over.id) {
      return;
    }
    onDragEnd(active.id, over.id);
  };
  return /* @__PURE__ */ jsxRuntime.jsx(Container, { children: /* @__PURE__ */ jsxRuntime.jsx(
    core.DndContext,
    {
      sensors,
      collisionDetection: core.closestCenter,
      modifiers: [restrictToVerticalAxis],
      onDragEnd: handleDragEnd,
      children: /* @__PURE__ */ jsxRuntime.jsxs(sortable.SortableContext, { items: list, strategy: sortable.verticalListSortingStrategy, disabled, children: [
        /* @__PURE__ */ jsxRuntime.jsxs(SortableListItemLayout, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.Drag, { fill: "neutral600" }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: heading })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(FadeableList, { disabled, children: list.map((listItem) => /* @__PURE__ */ jsxRuntime.jsx(SortableListItem, { id: listItem.id, label: listItem.label }, listItem.id)) })
      ] })
    }
  ) });
};
const isSystemField = (fieldName) => {
  const systemFields = [
    "documentId",
    "id",
    "createdAt",
    "updatedAt",
    "publishedAt",
    "createdBy",
    "updatedBy",
    "locale",
    "localizations"
  ];
  return systemFields.includes(fieldName);
};
const getRelationFields = (contentType) => {
  if (!contentType || !contentType.attributes) {
    return [];
  }
  const relationFields = [];
  Object.keys(contentType.attributes).forEach((fieldName) => {
    const attribute = contentType.attributes[fieldName];
    if (attribute.type === "relation" || attribute.type === "media" || attribute.type && typeof attribute.type === "string" && attribute.type.includes("relation")) {
      relationFields.push(fieldName);
    }
  });
  return relationFields;
};
const getRelationDisplayValue = (relationItem) => {
  if (typeof relationItem === "string" || typeof relationItem === "number") {
    return String(relationItem);
  }
  if (typeof relationItem !== "object" || relationItem === null) {
    return String(relationItem);
  }
  const displayFields = [
    "title",
    "name",
    "label",
    "slug",
    "code",
    "description",
    "text",
    "value",
    "displayName",
    "display_name"
  ];
  for (const field of displayFields) {
    const value = relationItem[field];
    if (value !== null && value !== void 0 && value !== "") {
      return String(value);
    }
  }
  for (const key in relationItem) {
    if (relationItem.hasOwnProperty(key) && typeof relationItem[key] === "string" && relationItem[key] !== "" && !["documentId", "id", "createdAt", "updatedAt", "publishedAt"].includes(key)) {
      return relationItem[key];
    }
  }
  return relationItem.documentId || relationItem.id || "Unknown";
};
const formatRelationLabel = (entry, relationFields) => {
  const labels = [];
  relationFields.forEach((fieldName) => {
    const relationValue = entry[fieldName];
    if (relationValue) {
      if (Array.isArray(relationValue)) {
        const arrayLabels = relationValue.map((item) => getRelationDisplayValue(item)).filter((label) => label && label !== "Unknown");
        if (arrayLabels.length > 0) {
          labels.push(arrayLabels.join(", "));
        }
      } else if (typeof relationValue === "object" && relationValue !== null) {
        const displayValue = getRelationDisplayValue(relationValue);
        if (displayValue && displayValue !== "Unknown") {
          labels.push(displayValue);
        }
      } else if (relationValue !== null && relationValue !== void 0 && relationValue !== "") {
        labels.push(String(relationValue));
      }
    }
  });
  return labels.length > 0 ? labels.join(" - ") : "";
};
const getFieldDisplayValue = (entry, fieldName, contentType) => {
  if (!fieldName || !contentType?.attributes?.[fieldName]) {
    return null;
  }
  const attribute = contentType.attributes[fieldName];
  const value = entry[fieldName];
  if (attribute.type === "relation" || attribute.type === "media") {
    if (Array.isArray(value)) {
      const labels = value.map((item) => getRelationDisplayValue(item)).filter((label) => label && label !== "Unknown");
      return labels.length > 0 ? labels.join(", ") : null;
    } else if (value && typeof value === "object") {
      const displayValue = getRelationDisplayValue(value);
      return displayValue && displayValue !== "Unknown" ? displayValue : null;
    }
    return null;
  }
  if (value !== null && value !== void 0 && value !== "") {
    return String(value);
  }
  return null;
};
const SortModalBody = ({
  entriesFetchState,
  mainField,
  additionalFields = [],
  contentType,
  handleDragEnd,
  disabled
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const translate = (key) => formatMessage({ id: prefixKey(key) });
  switch (entriesFetchState.status) {
    case FetchStatus.Initial:
    case FetchStatus.Loading:
      return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Loader, {});
    case FetchStatus.Failed:
      return /* @__PURE__ */ jsxRuntime.jsx(designSystem.EmptyStateLayout, { content: translate("empty-state.failure") });
    case FetchStatus.Resolved:
      const entries = entriesFetchState.value;
      if (entries.length === 0) {
        return /* @__PURE__ */ jsxRuntime.jsx(designSystem.EmptyStateLayout, { content: translate("empty-state.noContent") });
      }
      contentType?.attributes && mainField in contentType.attributes;
      const isMainFieldSystem = isSystemField(mainField);
      const relationFields = getRelationFields(contentType);
      const shouldUseRelationFields = isMainFieldSystem && relationFields.length > 0;
      if (process.env.NODE_ENV === "development") {
        console.log("[SortModalBody] Debug info:", {
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
            {}
          )
        });
      }
      const sortableList = entries.map((entry) => {
        const labelParts = [];
        const mainFieldValue = getFieldDisplayValue(entry, mainField, contentType);
        if (mainFieldValue) {
          labelParts.push(mainFieldValue);
        } else if (!isMainFieldSystem && shouldUseRelationFields && relationFields.length > 0) {
          const relationLabel = formatRelationLabel(entry, relationFields);
          if (relationLabel) {
            labelParts.push(relationLabel);
          }
        } else if (isMainFieldSystem && shouldUseRelationFields && relationFields.length > 0) {
          const relationLabel = formatRelationLabel(entry, relationFields);
          if (relationLabel) {
            labelParts.push(relationLabel);
          }
        }
        additionalFields.forEach((fieldName) => {
          const fieldValue = getFieldDisplayValue(entry, fieldName, contentType);
          if (fieldValue) {
            labelParts.push(fieldValue);
          }
        });
        let label;
        if (labelParts.length > 0) {
          label = labelParts.join(" - ");
        } else {
          label = `Entry ${entry.documentId}`;
        }
        return {
          id: entry.documentId,
          label
        };
      });
      const headingParts = [mainField];
      if (additionalFields.length > 0) {
        headingParts.push(...additionalFields);
      }
      const heading = headingParts.join(" - ");
      return /* @__PURE__ */ jsxRuntime.jsx(
        SortableList,
        {
          list: sortableList,
          onDragEnd: handleDragEnd,
          disabled,
          heading
        }
      );
  }
};
const config = {
  /** The configuration for the fetch entries request. */
  fetchEntriesRequest: {
    /** The path to fetch the entries of the collection type with the given `uid`. */
    path: (uid) => `/sortable-entries/fetch-entries/${uid}`
  },
  /** The configuration for the update sort order request. */
  updateSortOrderRequest: {
    /** The path to update the sort order of the collection type with the given `uid`. */
    path: (uid) => `/sortable-entries/update-sort-order/${uid}`
  }
};
const SortModal = ({ uid, mainField, contentType, mode = "global", label }) => {
  const [isOpen, setIsOpen] = react.useState(false);
  const [isSubmitting, setIsSubmitting] = react.useState(false);
  const [searchParams, setSearchParams] = reactRouterDom.useSearchParams();
  const { toggleNotification } = admin.useNotification();
  const { formatMessage } = reactIntl.useIntl();
  const translate = (key) => formatMessage({ id: prefixKey(key) });
  const fetchClient = admin.useFetchClient();
  const [entriesFetchState, setEntriesFetchState] = react.useState({
    status: FetchStatus.Initial
  });
  const [selectedDisplayField, setSelectedDisplayField] = react.useState(mainField);
  const [additionalDisplayField1, setAdditionalDisplayField1] = react.useState("");
  const [additionalDisplayField2, setAdditionalDisplayField2] = react.useState("");
  const [selectedFilterField, setSelectedFilterField] = react.useState("");
  const [selectedFilterValue, setSelectedFilterValue] = react.useState("");
  const [filterOptions, setFilterOptions] = react.useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = react.useState(false);
  const resolvedSortField = react.useMemo(() => {
    if (!contentType?.attributes) {
      return config$1.sortOrderField;
    }
    const attributes = contentType.attributes;
    for (const candidate of config$1.sortFieldCandidates) {
      const attribute = attributes[candidate];
      if (attribute && attribute.type === "integer") {
        return candidate;
      }
    }
    const fallbackAttr = attributes[config$1.sortOrderField];
    if (fallbackAttr && fallbackAttr.type === "integer") {
      return config$1.sortOrderField;
    }
    return config$1.sortOrderField;
  }, [contentType]);
  const initialParams = { filters: void 0, plugins: { i18n: { locale: void 0 } } };
  const [queryParams, _] = admin.useQueryParams(initialParams);
  const listViewFilters = queryParams.query.filters;
  const locale = queryParams.query.plugins.i18n.locale;
  const buildFilterFromSelection = (field, value) => {
    const attribute = contentType?.attributes?.[field];
    if (!attribute) {
      return {};
    }
    if (attribute.type === "relation") {
      return {
        [field]: {
          documentId: {
            $in: [value]
          }
        }
      };
    }
    if (attribute.type === "enumeration") {
      return {
        [field]: {
          $eq: value
        }
      };
    }
    if (["integer", "biginteger", "float", "decimal"].includes(attribute.type)) {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        return {
          [field]: {
            $eq: numValue
          }
        };
      }
      return {
        [field]: {
          $contains: [value]
        }
      };
    }
    if (attribute.type === "boolean") {
      const boolValue = value === "true" || value === "1" || value === "yes";
      return {
        [field]: {
          $eq: boolValue
        }
      };
    }
    if (["date", "datetime", "time", "timestamp"].includes(attribute.type)) {
      return {
        [field]: {
          $eq: value
        }
      };
    }
    return {
      [field]: {
        $contains: [value]
      }
    };
  };
  const filters = react.useMemo(() => {
    if (mode === "scoped" && selectedFilterField && selectedFilterValue) {
      return buildFilterFromSelection(selectedFilterField, selectedFilterValue);
    }
    return listViewFilters;
  }, [mode, selectedFilterField, selectedFilterValue, listViewFilters]);
  const filtersString = react.useMemo(() => JSON.stringify(filters), [filters]);
  const fetchFilterOptions = react.useCallback(
    async (fieldName) => {
      if (!fieldName || !contentType?.attributes?.[fieldName]) {
        setFilterOptions([]);
        return;
      }
      setIsLoadingOptions(true);
      try {
        const attribute = contentType.attributes[fieldName];
        if (attribute.type === "enumeration" && attribute.enum) {
          const enumValues = Array.isArray(attribute.enum) ? attribute.enum : [];
          const options = enumValues.map((enumValue) => ({
            id: enumValue,
            label: enumValue
          }));
          setFilterOptions(options);
          return;
        }
        if (attribute.type === "relation" && attribute.target) {
          const targetUid = attribute.target;
          const params = {
            pageSize: 100
            // Limit to 100 options to avoid lag
            // Explicitly do NOT include sort parameter
          };
          try {
            let targetContentType = null;
            try {
              const contentTypeResponse = await fetchClient.get(
                `/content-type-builder/content-types/${targetUid}`
              );
              targetContentType = contentTypeResponse?.data?.data;
            } catch (schemaError) {
              console.warn("Could not fetch target contentType schema:", schemaError);
            }
            const targetEntries = await fetchClient.get(
              `/content-manager/collection-types/${targetUid}`,
              { params }
            );
            const entries = targetEntries?.data?.results || targetEntries?.data || [];
            const displayableFieldNames = [];
            if (targetContentType?.attributes) {
              Object.keys(targetContentType.attributes).forEach((fieldName2) => {
                const field = targetContentType.attributes[fieldName2];
                if (["string", "text", "email", "enumeration"].includes(field.type) || fieldName2 === "name" || fieldName2 === "title" || fieldName2 === "label" || fieldName2 === "slug") {
                  displayableFieldNames.push(fieldName2);
                }
              });
            }
            const commonDisplayFields = ["name", "title", "label", "slug", "code", "value"];
            const options = entries.map((entry) => {
              let displayValue = null;
              for (const fieldName2 of displayableFieldNames) {
                const value = entry[fieldName2];
                if (value !== null && value !== void 0 && value !== "") {
                  displayValue = String(value);
                  break;
                }
              }
              if (!displayValue) {
                for (const fieldName2 of commonDisplayFields) {
                  const value = entry[fieldName2];
                  if (value !== null && value !== void 0 && value !== "") {
                    displayValue = String(value);
                    break;
                  }
                }
              }
              if (!displayValue) {
                for (const [key, value] of Object.entries(entry)) {
                  if ([
                    "id",
                    "documentId",
                    "createdAt",
                    "updatedAt",
                    "publishedAt",
                    "createdBy",
                    "updatedBy"
                  ].includes(key)) {
                    continue;
                  }
                  if (value !== null && value !== void 0 && value !== "" && typeof value === "string") {
                    displayValue = String(value);
                    break;
                  }
                }
              }
              if (!displayValue) {
                displayValue = entry.documentId || String(entry.id);
              }
              return {
                id: entry.documentId || String(entry.id),
                label: displayValue
              };
            });
            setFilterOptions(options);
            return;
          } catch (error) {
            console.error("Failed to fetch relation options:", error);
            setFilterOptions([]);
            return;
          }
        }
        setFilterOptions([]);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
        setFilterOptions([]);
      } finally {
        setIsLoadingOptions(false);
      }
    },
    [contentType, fetchClient]
  );
  const isSystemField2 = (fieldName) => {
    const systemFields = [
      "documentId",
      "id",
      "createdAt",
      "updatedAt",
      "publishedAt",
      "createdBy",
      "updatedBy",
      "locale",
      "localizations"
    ];
    return systemFields.includes(fieldName);
  };
  const getFilterableFieldsMemo = react.useMemo(() => {
    if (!contentType || !contentType.attributes) {
      return [];
    }
    const filterableFields = [];
    const systemFields = [
      "documentId",
      "id",
      "createdAt",
      "updatedAt",
      "publishedAt",
      "createdBy",
      "updatedBy",
      "locale",
      "localizations",
      "strapi_stage",
      "strapi_assignee"
    ];
    Object.keys(contentType.attributes).forEach((fieldName) => {
      if (systemFields.includes(fieldName)) {
        return;
      }
      const attribute = contentType.attributes[fieldName];
      if (!attribute || !attribute.type) {
        return;
      }
      const filterableTypes = [
        "relation",
        "media",
        "enumeration",
        "string",
        "text",
        "richtext",
        "email",
        "password",
        "integer",
        "biginteger",
        "float",
        "decimal",
        "date",
        "time",
        "datetime",
        "timestamp",
        "boolean"
      ];
      if (filterableTypes.includes(attribute.type) || attribute.type && typeof attribute.type === "string" && attribute.type.includes("relation")) {
        filterableFields.push(fieldName);
      }
    });
    return filterableFields;
  }, [contentType]);
  const getDisplayableFieldsMemo = react.useMemo(() => {
    if (!contentType || !contentType.attributes) {
      return [];
    }
    const displayableFields = [];
    const systemFields = [
      "documentId",
      "id",
      "createdAt",
      "updatedAt",
      "publishedAt",
      "createdBy",
      "updatedBy",
      "locale",
      "localizations",
      "strapi_stage",
      "strapi_assignee"
    ];
    Object.keys(contentType.attributes).forEach((fieldName) => {
      if (systemFields.includes(fieldName)) {
        return;
      }
      if (fieldName === resolvedSortField) {
        return;
      }
      const attribute = contentType.attributes[fieldName];
      if (!attribute || !attribute.type) {
        return;
      }
      const displayableTypes = [
        "string",
        "text",
        "richtext",
        "email",
        "password",
        "enumeration",
        "integer",
        "biginteger",
        "float",
        "decimal",
        "boolean",
        "date",
        "time",
        "datetime",
        "timestamp",
        "relation",
        "media"
      ];
      if (displayableTypes.includes(attribute.type) || attribute.type && typeof attribute.type === "string" && attribute.type.includes("relation")) {
        displayableFields.push(fieldName);
      }
    });
    return displayableFields;
  }, [contentType, resolvedSortField]);
  const isFetchingRef = react.useRef(false);
  const abortControllerRef = react.useRef(null);
  const fetchEntries = react.useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    isFetchingRef.current = true;
    setEntriesFetchState({ status: FetchStatus.Loading });
    try {
      const allDisplayFields = [
        selectedDisplayField,
        additionalDisplayField1,
        additionalDisplayField2
      ].filter((field) => field && field !== "");
      const useRelationFields = allDisplayFields.some((field) => isSystemField2(field));
      const relationFieldsParam = useRelationFields && getFilterableFieldsMemo.length > 0 ? getFilterableFieldsMemo.filter((field) => {
        const attr = contentType?.attributes?.[field];
        return attr?.type === "relation" || attr?.type === "media";
      }).join(",") : void 0;
      const additionalFieldsArray = [additionalDisplayField1, additionalDisplayField2].filter(
        (field) => field && field !== "" && field !== selectedDisplayField
      );
      const additionalFieldsParam = additionalFieldsArray.length > 0 ? additionalFieldsArray.join(",") : void 0;
      const { data: entries } = await fetchClient.get(
        mode === "scoped" ? `/sortable-entries/fetch-entries-scoped/${uid}` : config.fetchEntriesRequest.path(uid),
        {
          params: {
            mainField: selectedDisplayField,
            filters,
            locale,
            relationFields: relationFieldsParam,
            additionalFields: additionalFieldsParam
          },
          signal: abortController.signal
        }
      );
      if (abortController.signal.aborted) {
        return;
      }
      setEntriesFetchState({ status: FetchStatus.Resolved, value: entries });
    } catch (error) {
      if (error?.name === "AbortError" || abortController.signal.aborted) {
        return;
      }
      if (error instanceof Error && error.name !== "AbortError") {
        console.error(`Failed to fetch data:`, error.message);
      }
      if (!abortController.signal.aborted) {
        setEntriesFetchState({ status: FetchStatus.Failed });
      }
    } finally {
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
    fetchClient
  ]);
  react.useEffect(() => {
    if (isOpen && mode === "scoped" && selectedFilterField) {
      fetchFilterOptions(selectedFilterField);
    } else {
      setFilterOptions([]);
    }
  }, [selectedFilterField, isOpen, mode, fetchFilterOptions]);
  react.useEffect(() => {
    if (!isOpen) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setSelectedDisplayField(mainField);
      setAdditionalDisplayField1("");
      setAdditionalDisplayField2("");
      setSelectedFilterField("");
      setSelectedFilterValue("");
      setFilterOptions([]);
      isFetchingRef.current = false;
      prevFetchParamsRef.current = "";
    }
  }, [isOpen, mainField]);
  react.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);
  const prevFetchParamsRef = react.useRef("");
  react.useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (mode === "scoped") {
      if (!selectedFilterField || !selectedFilterValue) {
        return;
      }
    }
    const fetchKey = JSON.stringify({
      isOpen,
      mode,
      selectedDisplayField,
      additionalDisplayField1,
      additionalDisplayField2,
      selectedFilterField,
      selectedFilterValue,
      filtersString,
      locale
    });
    if (prevFetchParamsRef.current === fetchKey) {
      return;
    }
    prevFetchParamsRef.current = fetchKey;
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
    fetchEntries
  ]);
  const handleDragEnd = (activeID, overID) => {
    setEntriesFetchState((entriesFetchState2) => {
      if (entriesFetchState2.status !== FetchStatus.Resolved) {
        return entriesFetchState2;
      }
      const oldEntries = entriesFetchState2.value;
      const oldIndex = oldEntries.findIndex((entry) => entry.documentId === activeID);
      const newIndex = oldEntries.findIndex((entry) => entry.documentId === overID);
      const newEntries = sortable.arrayMove(oldEntries, oldIndex, newIndex);
      return { status: FetchStatus.Resolved, value: newEntries };
    });
  };
  const handleSubmit = async () => {
    if (entriesFetchState.status !== FetchStatus.Resolved) {
      console.error("Expect submit button to be disabled in a non `resolved` fetch state.");
      return;
    }
    setIsSubmitting(true);
    try {
      const entries = entriesFetchState.value;
      const sortedDocumentIds = entries.map((entry) => entry.documentId);
      await fetchClient.post(
        mode === "scoped" ? `/sortable-entries/update-sort-order-scoped/${uid}` : config.updateSortOrderRequest.path(uid),
        {
          data: {
            sortedDocumentIds,
            filters,
            locale
          }
        }
      );
      setIsOpen(false);
      const timestamp = String(Date.now());
      searchParams.set("t", timestamp);
      setSearchParams(searchParams);
    } catch (error) {
      console.error(`Failed to submit data: ${error}`);
      toggleNotification({ type: "danger", message: translate("notification.failure") });
    } finally {
      setIsSubmitting(false);
    }
  };
  const isSubmitButtonDisabled = isSubmitting || entriesFetchState.status !== FetchStatus.Resolved;
  const isSubmitButtonLoading = isSubmitting;
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Root, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Trigger, { children: mode === "scoped" && label ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "secondary", size: "S", children: label }) : /* @__PURE__ */ jsxRuntime.jsx(designSystem.IconButton, { children: /* @__PURE__ */ jsxRuntime.jsx(icons.Drag, {}) }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Content, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Header, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Title, { children: /* @__PURE__ */ jsxRuntime.jsx(reactIntl.FormattedMessage, { id: prefixKey("title") }) }) }),
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Body, { children: [
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingBottom: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", fontWeight: "semiBold", as: "label", textColor: "neutral800", children: "Display field" }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(
            designSystem.SingleSelect,
            {
              value: selectedDisplayField || mainField,
              onChange: (value) => {
                if (value) {
                  setSelectedDisplayField(value);
                }
              },
              disabled: isSubmitting,
              placeholder: "Select a field",
              error: void 0,
              children: [
                /* @__PURE__ */ jsxRuntime.jsxs(designSystem.SingleSelectOption, { value: mainField, children: [
                  mainField,
                  " (default)"
                ] }),
                getDisplayableFieldsMemo.filter((fieldName) => fieldName !== mainField).map((fieldName) => {
                  const attr = contentType?.attributes?.[fieldName];
                  const fieldType = attr?.type === "enumeration" ? " (enum)" : attr?.type === "relation" ? " (relation)" : attr?.type === "media" ? " (media)" : "";
                  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.SingleSelectOption, { value: fieldName, children: [
                    fieldName,
                    fieldType
                  ] }, fieldName);
                })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}),
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingTop: 4, paddingBottom: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Typography,
            {
              variant: "omega",
              fontWeight: "semiBold",
              as: "label",
              textColor: "neutral600",
              paddingBottom: 3,
              children: "Additional display fields (optional)"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid.Root, { gap: 3, columns: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 1, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "medium", as: "label", textColor: "neutral700", children: "Field 1" }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(
                designSystem.SingleSelect,
                {
                  value: additionalDisplayField1 || void 0,
                  onChange: (value) => {
                    setAdditionalDisplayField1(value || "");
                  },
                  disabled: isSubmitting,
                  placeholder: "None",
                  clearLabel: "Clear selection",
                  onClear: () => setAdditionalDisplayField1(""),
                  error: void 0,
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "", children: "None" }),
                    getDisplayableFieldsMemo.filter(
                      (fieldName) => fieldName !== selectedDisplayField && fieldName !== additionalDisplayField2
                    ).map((fieldName) => {
                      const attr = contentType?.attributes?.[fieldName];
                      const fieldType = attr?.type === "enumeration" ? " (enum)" : attr?.type === "relation" ? " (relation)" : attr?.type === "media" ? " (media)" : "";
                      return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.SingleSelectOption, { value: fieldName, children: [
                        fieldName,
                        fieldType
                      ] }, fieldName);
                    })
                  ]
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid.Item, { col: 1, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "medium", as: "label", textColor: "neutral700", children: "Field 2" }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(
                designSystem.SingleSelect,
                {
                  value: additionalDisplayField2 || void 0,
                  onChange: (value) => {
                    setAdditionalDisplayField2(value || "");
                  },
                  disabled: isSubmitting,
                  placeholder: "None",
                  clearLabel: "Clear selection",
                  onClear: () => setAdditionalDisplayField2(""),
                  error: void 0,
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: "", children: "None" }),
                    getDisplayableFieldsMemo.filter(
                      (fieldName) => fieldName !== selectedDisplayField && fieldName !== additionalDisplayField1
                    ).map((fieldName) => {
                      const attr = contentType?.attributes?.[fieldName];
                      const fieldType = attr?.type === "enumeration" ? " (enum)" : attr?.type === "relation" ? " (relation)" : attr?.type === "media" ? " (media)" : "";
                      return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.SingleSelectOption, { value: fieldName, children: [
                        fieldName,
                        fieldType
                      ] }, fieldName);
                    })
                  ]
                }
              ) })
            ] }) })
          ] })
        ] }),
        mode === "scoped" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}),
          /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingTop: 4, paddingBottom: 4, children: [
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingBottom: 3, children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.Typography,
                {
                  variant: "omega",
                  fontWeight: "semiBold",
                  as: "label",
                  textColor: "neutral800",
                  children: "Filter by field"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 2, children: /* @__PURE__ */ jsxRuntime.jsx(
                designSystem.SingleSelect,
                {
                  value: selectedFilterField || void 0,
                  onChange: (value) => {
                    setSelectedFilterField(value || "");
                    setSelectedFilterValue("");
                  },
                  disabled: isSubmitting,
                  placeholder: "Select a field to filter by",
                  clearLabel: "Clear selection",
                  onClear: () => {
                    setSelectedFilterField("");
                    setSelectedFilterValue("");
                  },
                  error: void 0,
                  children: getFilterableFieldsMemo.map((fieldName) => {
                    const attr = contentType?.attributes?.[fieldName];
                    const fieldType = attr?.type === "enumeration" ? " (enum)" : attr?.type === "relation" ? " (relation)" : "";
                    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.SingleSelectOption, { value: fieldName, children: [
                      fieldName,
                      fieldType
                    ] }, fieldName);
                  })
                }
              ) })
            ] }),
            selectedFilterField && (() => {
              const selectedAttr = contentType?.attributes?.[selectedFilterField];
              const isRelationOrEnum = selectedAttr?.type === "relation" || selectedAttr?.type === "enumeration";
              const needsTextInput = !isRelationOrEnum && filterOptions.length === 0;
              return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Typography,
                  {
                    variant: "omega",
                    fontWeight: "semiBold",
                    as: "label",
                    textColor: "neutral800",
                    children: "Filter value"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 2, children: needsTextInput ? (
                  // Text input for string, number, boolean, date, etc.
                  /* @__PURE__ */ jsxRuntime.jsx(
                    designSystem.TextInput,
                    {
                      type: selectedAttr?.type === "boolean" ? "text" : selectedAttr?.type === "date" || selectedAttr?.type === "datetime" ? "date" : ["integer", "biginteger", "float", "decimal"].includes(
                        selectedAttr?.type || ""
                      ) ? "number" : "text",
                      value: selectedFilterValue,
                      onChange: (e) => setSelectedFilterValue(e.target.value),
                      disabled: isSubmitting,
                      placeholder: selectedAttr?.type === "boolean" ? "Enter true/false" : selectedAttr?.type === "date" || selectedAttr?.type === "datetime" ? "Select date" : `Enter ${selectedAttr?.type || "value"}`
                    }
                  )
                ) : (
                  // Select dropdown for relation and enumeration
                  /* @__PURE__ */ jsxRuntime.jsx(
                    designSystem.SingleSelect,
                    {
                      value: selectedFilterValue || void 0,
                      onChange: (value) => setSelectedFilterValue(value || ""),
                      disabled: isSubmitting || isLoadingOptions || filterOptions.length === 0,
                      placeholder: isLoadingOptions ? "Loading options..." : "Select a value",
                      clearLabel: "Clear selection",
                      onClear: () => setSelectedFilterValue(""),
                      error: void 0,
                      children: filterOptions.map((option) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: option.id, children: option.label }, option.id))
                    }
                  )
                ) })
              ] });
            })()
          ] })
        ] }),
        mode === "scoped" && (!selectedFilterField || !selectedFilterValue) ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { padding: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", textColor: "neutral600", children: "Please select a field and value to filter entries." }) }) : /* @__PURE__ */ jsxRuntime.jsx(
          SortModalBody,
          {
            entriesFetchState,
            mainField: selectedDisplayField,
            additionalFields: [additionalDisplayField1, additionalDisplayField2].filter(
              (f) => f && f !== ""
            ),
            contentType,
            handleDragEnd,
            disabled: isSubmitting
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Footer, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Close, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "tertiary", children: /* @__PURE__ */ jsxRuntime.jsx(reactIntl.FormattedMessage, { id: prefixKey("cancel-button.title") }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Button,
          {
            type: "submit",
            onClick: handleSubmit,
            disabled: isSubmitButtonDisabled,
            loading: isSubmitButtonLoading,
            children: /* @__PURE__ */ jsxRuntime.jsx(reactIntl.FormattedMessage, { id: prefixKey("submit-button.title") })
          }
        )
      ] })
    ] })
  ] });
};
const SortModalContainer = () => {
  const { contentType, layout } = admin.unstable_useContentManagerContext();
  if (!contentType) {
    return null;
  }
  const { attributes } = contentType;
  const resolveSortFieldForContentType = () => {
    if (!attributes) {
      return null;
    }
    for (const candidate of config$1.sortFieldCandidates) {
      const attribute = attributes[candidate];
      if (attribute && attribute.type === "integer") {
        return candidate;
      }
    }
    const fallbackAttr = attributes[config$1.sortOrderField];
    if (fallbackAttr && fallbackAttr.type === "integer") {
      return config$1.sortOrderField;
    }
    return null;
  };
  const sortField = resolveSortFieldForContentType();
  if (!sortField) {
    return null;
  }
  const { uid } = contentType;
  const { mainField } = layout.list.settings;
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(SortModal, { uid, mainField, contentType, mode: "global" }),
    /* @__PURE__ */ jsxRuntime.jsx(
      SortModal,
      {
        uid,
        mainField,
        contentType,
        mode: "scoped",
        label: "Scoped sort (by filters)"
      }
    )
  ] });
};
const index = {
  register(app) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  bootstrap(app) {
    app.getPlugin("content-manager").injectComponent("listView", "actions", {
      name: "SortModalContainer",
      Component: SortModalContainer
    });
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => Promise.resolve().then(() => require("../_chunks/en-DQQmokyt.js")) }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
module.exports = index;
//# sourceMappingURL=index.js.map
