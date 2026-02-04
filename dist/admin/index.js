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
  sortOrderField: "sortOrder"
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
const SortModalBody = ({
  entriesFetchState,
  mainField,
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
        let label;
        if (!isMainFieldSystem) {
          const mainFieldValue = entry[mainField];
          if (mainFieldValue !== null && mainFieldValue !== void 0 && mainFieldValue !== "") {
            label = String(mainFieldValue);
          } else if (shouldUseRelationFields && relationFields.length > 0) {
            label = formatRelationLabel(entry, relationFields);
            if (!label) {
              label = `Entry ${entry.documentId}`;
            }
          } else {
            label = `Entry ${entry.documentId}`;
          }
        } else if (shouldUseRelationFields && relationFields.length > 0) {
          label = formatRelationLabel(entry, relationFields);
          if (!label || label.trim() === "") {
            const hasAnyRelation = relationFields.some((field) => {
              const value = entry[field];
              return value !== null && value !== void 0;
            });
            if (hasAnyRelation) {
              label = `Entry ${entry.documentId}`;
            } else {
              label = `Entry ${entry.documentId}`;
            }
          }
        } else {
          label = `Entry ${entry.documentId}`;
        }
        return {
          id: entry.documentId,
          label
        };
      });
      const heading = shouldUseRelationFields && relationFields.length > 0 ? relationFields.join("-") : mainField;
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
  const [selectedFilterField, setSelectedFilterField] = react.useState("");
  const [selectedFilterValue, setSelectedFilterValue] = react.useState("");
  const [filterOptions, setFilterOptions] = react.useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = react.useState(false);
  const initialParams = { filters: void 0, plugins: { i18n: { locale: void 0 } } };
  const [queryParams, _] = admin.useQueryParams(initialParams);
  const listViewFilters = queryParams.query.filters;
  const locale = queryParams.query.plugins.i18n.locale;
  const buildFilterFromSelection = (field, value) => {
    const isRelationField = contentType?.attributes?.[field]?.type === "relation";
    if (isRelationField) {
      return {
        [field]: {
          documentId: {
            $in: [value]
          }
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
  const fetchFilterOptions = react.useCallback(
    async (fieldName) => {
      if (!fieldName || !contentType?.attributes?.[fieldName]) {
        setFilterOptions([]);
        return;
      }
      setIsLoadingOptions(true);
      try {
        const attribute = contentType.attributes[fieldName];
        if (attribute.type !== "relation" || !attribute.target) {
          setFilterOptions([]);
          return;
        }
        const targetUid = attribute.target;
        const targetEntries = await fetchClient.get(
          `/content-manager/collection-types/${targetUid}`,
          {
            params: {
              pageSize: 100,
              // Limit to 100 options to avoid lag
              sort: "name:asc"
              // Sort by name if available
            }
          }
        );
        const entries = targetEntries?.data?.results || targetEntries?.data || [];
        const options = entries.map((entry) => {
          const displayValue = entry.name || entry.title || entry.label || entry.documentId || String(entry.id);
          return {
            id: entry.documentId || String(entry.id),
            label: displayValue
          };
        });
        setFilterOptions(options);
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
  const getRelationFieldsMemo = react.useMemo(() => {
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
  }, [contentType]);
  const fetchEntries = react.useCallback(async () => {
    setEntriesFetchState({ status: FetchStatus.Loading });
    try {
      const useRelationFields = isSystemField2(mainField);
      const relationFieldsParam = useRelationFields && getRelationFieldsMemo.length > 0 ? getRelationFieldsMemo.join(",") : void 0;
      const { data: entries } = await fetchClient.get(
        mode === "scoped" ? `/sortable-entries/fetch-entries-scoped/${uid}` : config.fetchEntriesRequest.path(uid),
        {
          params: { mainField, filters, locale, relationFields: relationFieldsParam }
        }
      );
      setEntriesFetchState({ status: FetchStatus.Resolved, value: entries });
    } catch (error) {
      console.error(`Failed to fetch data:`, error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          response: error.response?.data,
          status: error.response?.status
        });
      }
      setEntriesFetchState({ status: FetchStatus.Failed });
    }
  }, [uid, mainField, mode, filters, locale, getRelationFieldsMemo, fetchClient]);
  react.useEffect(() => {
    if (isOpen && mode === "scoped" && selectedFilterField) {
      fetchFilterOptions(selectedFilterField);
    } else {
      setFilterOptions([]);
    }
  }, [selectedFilterField, isOpen, mode, fetchFilterOptions]);
  react.useEffect(() => {
    if (!isOpen) {
      setSelectedFilterField("");
      setSelectedFilterValue("");
      setFilterOptions([]);
    }
  }, [isOpen]);
  react.useEffect(() => {
    if (isOpen) {
      if (mode === "scoped") {
        if (selectedFilterField && selectedFilterValue) {
          fetchEntries();
        }
      } else {
        fetchEntries();
      }
    }
  }, [isOpen, mode, selectedFilterField, selectedFilterValue, fetchEntries]);
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
        mode === "scoped" && /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingBottom: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingBottom: 3, children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", fontWeight: "semiBold", as: "label", children: "Filter by field" }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(
              "select",
              {
                value: selectedFilterField,
                onChange: (e) => {
                  setSelectedFilterField(e.target.value);
                  setSelectedFilterValue("");
                },
                disabled: isSubmitting,
                style: {
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #dcdce4",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  cursor: isSubmitting ? "not-allowed" : "pointer"
                },
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "Select a field to filter by" }),
                  getRelationFieldsMemo.map((fieldName) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: fieldName, children: fieldName }, fieldName))
                ]
              }
            ) })
          ] }),
          selectedFilterField && /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", fontWeight: "semiBold", as: "label", children: "Filter value" }),
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(
              "select",
              {
                value: selectedFilterValue,
                onChange: (e) => setSelectedFilterValue(e.target.value),
                disabled: isSubmitting || isLoadingOptions || filterOptions.length === 0,
                style: {
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #dcdce4",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  cursor: isSubmitting || isLoadingOptions || filterOptions.length === 0 ? "not-allowed" : "pointer"
                },
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: isLoadingOptions ? "Loading options..." : "Select a value" }),
                  filterOptions.map((option) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: option.id, children: option.label }, option.id))
                ]
              }
            ) })
          ] })
        ] }),
        mode === "scoped" && (!selectedFilterField || !selectedFilterValue) ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { padding: 4, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", textColor: "neutral600", children: "Please select a field and value to filter entries." }) }) : /* @__PURE__ */ jsxRuntime.jsx(
          SortModalBody,
          {
            entriesFetchState,
            mainField,
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
  if (!(config$1.sortOrderField in attributes)) {
    return null;
  }
  const sortOrderFieldAttributes = attributes[config$1.sortOrderField];
  if (sortOrderFieldAttributes.type !== "integer") {
    console.warn(`${config$1.sortOrderField} needs to be of type integer.`);
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
