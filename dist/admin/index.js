"use strict";
const React = require("react");
const jsxRuntime = require("react/jsx-runtime");
const admin = require("@strapi/strapi/admin");
const sortable = require("@dnd-kit/sortable");
const reactIntl = require("react-intl");
const reactRouterDom = require("react-router-dom");
const designSystem = require("@strapi/design-system");
const icons = require("@strapi/icons");
require("react-dom");
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
  const ref = React.useRef(setPlugin);
  React.useEffect(() => {
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
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function $6ed0406888f73fc4$var$setRef(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref !== null && ref !== void 0) ref.current = value;
}
function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
  return (node) => refs.forEach(
    (ref) => $6ed0406888f73fc4$var$setRef(ref, node)
  );
}
function $c512c27ab02ef895$export$50c7b4e9d9f19c1(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootComponentName, defaultContext) {
    const BaseContext = /* @__PURE__ */ React.createContext(defaultContext);
    const index2 = defaultContexts.length;
    defaultContexts = [
      ...defaultContexts,
      defaultContext
    ];
    function Provider(props) {
      const { scope, children, ...context } = props;
      const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index2]) || BaseContext;
      const value = React.useMemo(
        () => context,
        Object.values(context)
      );
      return /* @__PURE__ */ React.createElement(Context.Provider, {
        value
      }, children);
    }
    function useContext(consumerName, scope) {
      const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index2]) || BaseContext;
      const context = React.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    Provider.displayName = rootComponentName + "Provider";
    return [
      Provider,
      useContext
    ];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return /* @__PURE__ */ React.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope === null || scope === void 0 ? void 0 : scope[scopeName]) || scopeContexts;
      return React.useMemo(
        () => ({
          [`__scope${scopeName}`]: {
            ...scope,
            [scopeName]: contexts
          }
        }),
        [
          scope,
          contexts
        ]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [
    $c512c27ab02ef895$export$fd42f52fd3ae1109,
    $c512c27ab02ef895$var$composeContextScopes(createScope, ...createContextScopeDeps)
  ];
}
function $c512c27ab02ef895$var$composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope1 = () => {
    const scopeHooks = scopes.map(
      (createScope) => ({
        useScope: createScope(),
        scopeName: createScope.scopeName
      })
    );
    return function useComposedScopes(overrideScopes) {
      const nextScopes1 = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return {
          ...nextScopes,
          ...currentScope
        };
      }, {});
      return React.useMemo(
        () => ({
          [`__scope${baseScope.scopeName}`]: nextScopes1
        }),
        [
          nextScopes1
        ]
      );
    };
  };
  createScope1.scopeName = baseScope.scopeName;
  return createScope1;
}
const $5e63c961fc1ce211$export$8c6ed5c666ac1360 = /* @__PURE__ */ React.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (React.Children.count(newElement) > 1) return React.Children.only(null);
        return /* @__PURE__ */ React.isValidElement(newElement) ? newElement.props.children : null;
      } else return child;
    });
    return /* @__PURE__ */ React.createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
      ref: forwardedRef
    }), /* @__PURE__ */ React.isValidElement(newElement) ? /* @__PURE__ */ React.cloneElement(newElement, void 0, newChildren) : null);
  }
  return /* @__PURE__ */ React.createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
    ref: forwardedRef
  }), children);
});
$5e63c961fc1ce211$export$8c6ed5c666ac1360.displayName = "Slot";
const $5e63c961fc1ce211$var$SlotClone = /* @__PURE__ */ React.forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if (/* @__PURE__ */ React.isValidElement(children)) return /* @__PURE__ */ React.cloneElement(children, {
    ...$5e63c961fc1ce211$var$mergeProps(slotProps, children.props),
    ref: forwardedRef ? $6ed0406888f73fc4$export$43e446d32b3d21af(forwardedRef, children.ref) : children.ref
  });
  return React.Children.count(children) > 1 ? React.Children.only(null) : null;
});
$5e63c961fc1ce211$var$SlotClone.displayName = "SlotClone";
const $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = ({ children }) => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
};
function $5e63c961fc1ce211$var$isSlottable(child) {
  return /* @__PURE__ */ React.isValidElement(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45;
}
function $5e63c961fc1ce211$var$mergeProps(slotProps, childProps) {
  const overrideProps = {
    ...childProps
  };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
        childPropValue(...args);
        slotPropValue(...args);
      };
      else if (slotPropValue) overrideProps[propName] = slotPropValue;
    } else if (propName === "style") overrideProps[propName] = {
      ...slotPropValue,
      ...childPropValue
    };
    else if (propName === "className") overrideProps[propName] = [
      slotPropValue,
      childPropValue
    ].filter(Boolean).join(" ");
  }
  return {
    ...slotProps,
    ...overrideProps
  };
}
const $8927f6f2acc4f386$var$NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
const $8927f6f2acc4f386$export$250ffa63cdc0d034 = $8927f6f2acc4f386$var$NODES.reduce((primitive, node) => {
  const Node = /* @__PURE__ */ React.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : node;
    React.useEffect(() => {
      window[Symbol.for("radix-ui")] = true;
    }, []);
    return /* @__PURE__ */ React.createElement(Comp, _extends({}, primitiveProps, {
      ref: forwardedRef
    }));
  });
  Node.displayName = `Primitive.${node}`;
  return {
    ...primitive,
    [node]: Node
  };
}, {});
const $7e8f5cd07187803e$export$21b07c8f274aebd5 = /* @__PURE__ */ React.forwardRef((props, forwardedRef) => {
  const { children, width = 10, height = 5, ...arrowProps } = props;
  return /* @__PURE__ */ React.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.svg, _extends({}, arrowProps, {
    ref: forwardedRef,
    width,
    height,
    viewBox: "0 0 30 10",
    preserveAspectRatio: "none"
  }), props.asChild ? children : /* @__PURE__ */ React.createElement("polygon", {
    points: "0,0 30,0 15,10"
  }));
});
const $7e8f5cd07187803e$export$be92b6f5f03c0fe9 = $7e8f5cd07187803e$export$21b07c8f274aebd5;
const $cf1ac5d9fe0e8206$var$POPPER_NAME = "Popper";
const [$cf1ac5d9fe0e8206$var$createPopperContext, $cf1ac5d9fe0e8206$export$722aac194ae923] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($cf1ac5d9fe0e8206$var$POPPER_NAME);
const [$cf1ac5d9fe0e8206$var$PopperProvider, $cf1ac5d9fe0e8206$var$usePopperContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$POPPER_NAME);
const $cf1ac5d9fe0e8206$var$CONTENT_NAME = "PopperContent";
const [$cf1ac5d9fe0e8206$var$PopperContentProvider, $cf1ac5d9fe0e8206$var$useContentContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$CONTENT_NAME);
const $cf1ac5d9fe0e8206$var$ARROW_NAME = "PopperArrow";
const $cf1ac5d9fe0e8206$var$OPPOSITE_SIDE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
const $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd0 = /* @__PURE__ */ React.forwardRef(function $cf1ac5d9fe0e8206$export$79d62cd4e10a3fd02(props, forwardedRef) {
  const { __scopePopper, ...arrowProps } = props;
  const contentContext = $cf1ac5d9fe0e8206$var$useContentContext($cf1ac5d9fe0e8206$var$ARROW_NAME, __scopePopper);
  const baseSide = $cf1ac5d9fe0e8206$var$OPPOSITE_SIDE[contentContext.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ React.createElement("span", {
      ref: contentContext.onArrowChange,
      style: {
        position: "absolute",
        left: contentContext.arrowX,
        top: contentContext.arrowY,
        [baseSide]: 0,
        transformOrigin: {
          top: "",
          right: "0 0",
          bottom: "center 0",
          left: "100% 0"
        }[contentContext.placedSide],
        transform: {
          top: "translateY(100%)",
          right: "translateY(50%) rotate(90deg) translateX(-50%)",
          bottom: `rotate(180deg)`,
          left: "translateY(50%) rotate(-90deg) translateX(50%)"
        }[contentContext.placedSide],
        visibility: contentContext.shouldHideArrow ? "hidden" : void 0
      }
    }, /* @__PURE__ */ React.createElement($7e8f5cd07187803e$export$be92b6f5f03c0fe9, _extends({}, arrowProps, {
      ref: forwardedRef,
      style: {
        ...arrowProps.style,
        // ensures the element can be measured correctly (mostly for if SVG)
        display: "block"
      }
    })))
  );
});
/* @__PURE__ */ Object.assign($cf1ac5d9fe0e8206$export$79d62cd4e10a3fd0, {
  displayName: $cf1ac5d9fe0e8206$var$ARROW_NAME
});
const [$a093c7e1ec25a057$var$createTooltipContext] = $c512c27ab02ef895$export$50c7b4e9d9f19c1("Tooltip", [
  $cf1ac5d9fe0e8206$export$722aac194ae923
]);
$cf1ac5d9fe0e8206$export$722aac194ae923();
const $a093c7e1ec25a057$var$PROVIDER_NAME = "TooltipProvider";
const $a093c7e1ec25a057$var$DEFAULT_DELAY_DURATION = 700;
const [$a093c7e1ec25a057$var$TooltipProviderContextProvider, $a093c7e1ec25a057$var$useTooltipProviderContext] = $a093c7e1ec25a057$var$createTooltipContext($a093c7e1ec25a057$var$PROVIDER_NAME);
const $a093c7e1ec25a057$export$f78649fb9ca566b8 = (props) => {
  const { __scopeTooltip, delayDuration = $a093c7e1ec25a057$var$DEFAULT_DELAY_DURATION, skipDelayDuration = 300, disableHoverableContent = false, children } = props;
  const [isOpenDelayed, setIsOpenDelayed] = React.useState(true);
  const isPointerInTransitRef = React.useRef(false);
  const skipDelayTimerRef = React.useRef(0);
  React.useEffect(() => {
    const skipDelayTimer = skipDelayTimerRef.current;
    return () => window.clearTimeout(skipDelayTimer);
  }, []);
  return /* @__PURE__ */ React.createElement($a093c7e1ec25a057$var$TooltipProviderContextProvider, {
    scope: __scopeTooltip,
    isOpenDelayed,
    delayDuration,
    onOpen: React.useCallback(() => {
      window.clearTimeout(skipDelayTimerRef.current);
      setIsOpenDelayed(false);
    }, []),
    onClose: React.useCallback(() => {
      window.clearTimeout(skipDelayTimerRef.current);
      skipDelayTimerRef.current = window.setTimeout(
        () => setIsOpenDelayed(true),
        skipDelayDuration
      );
    }, [
      skipDelayDuration
    ]),
    isPointerInTransitRef,
    onPointerInTransitChange: React.useCallback((inTransit) => {
      isPointerInTransitRef.current = inTransit;
    }, []),
    disableHoverableContent
  }, children);
};
const $a093c7e1ec25a057$var$TOOLTIP_NAME = "Tooltip";
const [$a093c7e1ec25a057$var$TooltipContextProvider, $a093c7e1ec25a057$var$useTooltipContext] = $a093c7e1ec25a057$var$createTooltipContext($a093c7e1ec25a057$var$TOOLTIP_NAME);
const $a093c7e1ec25a057$var$PORTAL_NAME = "TooltipPortal";
const [$a093c7e1ec25a057$var$PortalProvider, $a093c7e1ec25a057$var$usePortalContext] = $a093c7e1ec25a057$var$createTooltipContext($a093c7e1ec25a057$var$PORTAL_NAME, {
  forceMount: void 0
});
const [$a093c7e1ec25a057$var$VisuallyHiddenContentContextProvider, $a093c7e1ec25a057$var$useVisuallyHiddenContentContext] = $a093c7e1ec25a057$var$createTooltipContext($a093c7e1ec25a057$var$TOOLTIP_NAME, {
  isInside: false
});
const $a093c7e1ec25a057$export$2881499e37b75b9a = $a093c7e1ec25a057$export$f78649fb9ca566b8;
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [searchParams, setSearchParams] = reactRouterDom.useSearchParams();
  const { toggleNotification } = admin.useNotification();
  const { formatMessage } = reactIntl.useIntl();
  const translate = (key) => formatMessage({ id: prefixKey(key) });
  const fetchClient = admin.useFetchClient();
  const [entriesFetchState, setEntriesFetchState] = React.useState({
    status: FetchStatus.Initial
  });
  const [selectedDisplayField, setSelectedDisplayField] = React.useState(mainField);
  const [additionalDisplayField1, setAdditionalDisplayField1] = React.useState("");
  const [additionalDisplayField2, setAdditionalDisplayField2] = React.useState("");
  const [selectedFilterField, setSelectedFilterField] = React.useState("");
  const [selectedFilterValue, setSelectedFilterValue] = React.useState("");
  const [filterOptions, setFilterOptions] = React.useState([]);
  const [isLoadingOptions, setIsLoadingOptions] = React.useState(false);
  const resolvedSortField = React.useMemo(() => {
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
  const filters = React.useMemo(() => {
    if (mode === "scoped" && selectedFilterField && selectedFilterValue) {
      return buildFilterFromSelection(selectedFilterField, selectedFilterValue);
    }
    return listViewFilters;
  }, [mode, selectedFilterField, selectedFilterValue, listViewFilters]);
  const filtersString = React.useMemo(() => JSON.stringify(filters), [filters]);
  const fetchFilterOptions = React.useCallback(
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
  const getFilterableFieldsMemo = React.useMemo(() => {
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
  const getDisplayableFieldsMemo = React.useMemo(() => {
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
  const isFetchingRef = React.useRef(false);
  const abortControllerRef = React.useRef(null);
  const fetchEntries = React.useCallback(async () => {
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
      const relationDisplayFields = allDisplayFields.filter((fieldName) => {
        const attr = contentType?.attributes?.[fieldName];
        return attr?.type === "relation" || attr?.type === "media";
      });
      const hasSystemDisplayField = allDisplayFields.some((field) => isSystemField2(field));
      let relationFieldsForPopulate = [...relationDisplayFields];
      if (relationFieldsForPopulate.length === 0 && hasSystemDisplayField) {
        relationFieldsForPopulate = getFilterableFieldsMemo.filter((fieldName) => {
          const attr = contentType?.attributes?.[fieldName];
          return attr?.type === "relation" || attr?.type === "media";
        });
      }
      const relationFieldsParam = relationFieldsForPopulate.length > 0 ? relationFieldsForPopulate.join(",") : void 0;
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
  React.useEffect(() => {
    if (isOpen && mode === "scoped" && selectedFilterField) {
      fetchFilterOptions(selectedFilterField);
    } else {
      setFilterOptions([]);
    }
  }, [selectedFilterField, isOpen, mode, fetchFilterOptions]);
  React.useEffect(() => {
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
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);
  const prevFetchParamsRef = React.useRef("");
  React.useEffect(() => {
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
    /* @__PURE__ */ jsxRuntime.jsx($a093c7e1ec25a057$export$2881499e37b75b9a, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Content, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Header, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Modal.Title, { children: /* @__PURE__ */ jsxRuntime.jsx(reactIntl.FormattedMessage, { id: prefixKey("title") }) }) }),
      /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Modal.Body, { children: [
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingBottom: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "omega", fontWeight: "semiBold", as: "label", textColor: "neutral800", children: "Sort by field" }),
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
    ] }) })
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
