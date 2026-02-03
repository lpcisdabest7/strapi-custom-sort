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
const SortModal = ({
  uid,
  mainField,
  contentType
}) => {
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
  const initialParams = { filters: void 0, plugins: { i18n: { locale: void 0 } } };
  const [queryParams, _] = admin.useQueryParams(initialParams);
  const filters = queryParams.query.filters;
  const locale = queryParams.query.plugins.i18n.locale;
  const getRelationFields2 = () => {
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
  const fetchEntries = async () => {
    setEntriesFetchState({ status: FetchStatus.Loading });
    try {
      const relationFields = getRelationFields2();
      const useRelationFields = isSystemField2(mainField);
      const relationFieldsParam = useRelationFields && relationFields.length > 0 ? relationFields.join(",") : void 0;
      const { data: entries } = await fetchClient.get(
        config.fetchEntriesRequest.path(uid),
        {
          params: { mainField, filters, locale, relationFields: relationFieldsParam }
        }
      );
      setEntriesFetchState({ status: FetchStatus.Resolved, value: entries });
    } catch (error) {
      console.error(`Failed to fetch data: ${error}`);
      setEntriesFetchState({ status: FetchStatus.Failed });
    }
  };
  react.useEffect(() => {
    if (isOpen) {
      fetchEntries();
    }
  }, [isOpen]);
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
      await fetchClient.post(config.updateSortOrderRequest.path(uid), {
        data: {
          sortedDocumentIds,
          filters,
          locale
        }
      });
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
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Trigger, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.IconButton, { children: /* @__PURE__ */ jsxRuntime.jsx(icons.Drag, {}) }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Content, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Header, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Title, { children: /* @__PURE__ */ jsxRuntime.jsx(reactIntl.FormattedMessage, { id: prefixKey("title") }) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Body, { children: /* @__PURE__ */ jsxRuntime.jsx(
        SortModalBody,
        {
          entriesFetchState,
          mainField,
          contentType,
          handleDragEnd,
          disabled: isSubmitting
        }
      ) }),
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
  return /* @__PURE__ */ jsxRuntime.jsx(SortModal, { uid, mainField, contentType });
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
