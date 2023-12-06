(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/utils.js
  var camelToDashMap = /* @__PURE__ */ new Map();
  function camelToDash(str) {
    let result = camelToDashMap.get(str);
    if (result === void 0) {
      result = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      camelToDashMap.set(str, result);
    }
    return result;
  }
  function stringifyElement(target) {
    return `<${String(target.tagName).toLowerCase()}>`;
  }
  function walkInShadow(target, cb) {
    if (target.nodeType === globalThis.Node.ELEMENT_NODE) {
      cb(target);
      if (target.shadowRoot) {
        walkInShadow(target.shadowRoot, cb);
      }
    }
    const walker = globalThis.document.createTreeWalker(
      target,
      globalThis.NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
    while (walker.nextNode()) {
      const el = walker.currentNode;
      cb(el);
      if (el.shadowRoot) {
        walkInShadow(el.shadowRoot, cb);
      }
    }
  }
  var deferred = Promise.resolve();
  var storePointer = /* @__PURE__ */ new WeakMap();
  var probablyDevMode = walkInShadow.name === "walkInShadow";

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/emitter.js
  var queue = /* @__PURE__ */ new Set();
  function add(fn) {
    if (!queue.size)
      deferred.then(execute);
    queue.add(fn);
  }
  function clear(fn) {
    queue.delete(fn);
  }
  function execute() {
    for (const fn of queue) {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    }
    queue.clear();
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/cache.js
  var entries = /* @__PURE__ */ new WeakMap();
  var stack = /* @__PURE__ */ new Set();
  function dispatch(entry) {
    const contexts = [];
    let index = 0;
    while (entry) {
      entry.resolved = false;
      if (entry.deps) {
        for (const depEntry of entry.deps) {
          depEntry.contexts.delete(entry);
        }
        entry.deps.clear();
      }
      if (entry.contexts) {
        for (const context2 of entry.contexts) {
          if (!stack.has(context2)) {
            if (!contexts.includes(context2))
              contexts.push(context2);
            entry.contexts.delete(context2);
          }
        }
      }
      if (entry.observe) {
        add(entry.observe);
      }
      entry = contexts[index++];
    }
  }
  function getEntry(target, key2) {
    let map = entries.get(target);
    if (!map) {
      map = /* @__PURE__ */ new Map();
      entries.set(target, map);
    }
    let entry = map.get(key2);
    if (!entry) {
      entry = {
        key: key2,
        target,
        value: void 0,
        lastValue: void 0,
        resolved: false,
        contexts: void 0,
        deps: void 0,
        observe: void 0
      };
      map.set(key2, entry);
    }
    return entry;
  }
  var context = null;
  function get(target, key2, getter) {
    const entry = getEntry(target, key2);
    if (context) {
      if (!entry.contexts)
        entry.contexts = /* @__PURE__ */ new Set();
      if (!context.deps)
        context.deps = /* @__PURE__ */ new Set();
      entry.contexts.add(context);
      context.deps.add(entry);
    }
    if (entry.resolved)
      return entry.value;
    const lastContext = context;
    try {
      if (stack.has(entry)) {
        throw Error(`Circular get invocation is forbidden: '${key2}'`);
      }
      context = entry;
      stack.add(entry);
      entry.value = getter(target, entry.value);
      entry.resolved = true;
      context = lastContext;
      stack.delete(entry);
    } catch (e) {
      context = lastContext;
      stack.delete(entry);
      if (context) {
        context.deps.delete(entry);
        entry.contexts.delete(context);
      }
      throw e;
    }
    return entry.value;
  }
  function set(target, key2, setter, value2) {
    const entry = getEntry(target, key2);
    const newValue = setter(target, value2, entry.value);
    if (newValue !== entry.value) {
      entry.value = newValue;
      dispatch(entry);
    }
  }
  function observe(target, key2, getter, fn) {
    const entry = getEntry(target, key2);
    entry.observe = () => {
      const value2 = get(target, key2, getter);
      if (value2 !== entry.lastValue) {
        fn(target, value2, entry.lastValue);
        entry.lastValue = value2;
      }
    };
    try {
      entry.observe();
    } catch (e) {
      console.error(e);
    }
    return () => {
      clear(entry.observe);
      entry.observe = void 0;
      entry.lastValue = void 0;
    };
  }
  var gc = /* @__PURE__ */ new Set();
  function deleteEntry(entry) {
    if (!gc.size) {
      setTimeout(() => {
        for (const e of gc) {
          if (!e.contexts || e.contexts.size === 0) {
            if (e.deps) {
              for (const depEntry of e.deps) {
                depEntry.contexts.delete(e);
              }
            }
            const targetMap = entries.get(e.target);
            targetMap.delete(e.key);
          }
        }
        gc.clear();
      });
    }
    gc.add(entry);
  }
  function invalidateEntry(entry, options) {
    dispatch(entry);
    if (options.clearValue) {
      entry.value = void 0;
      entry.lastValue = void 0;
    }
    if (options.deleteEntry) {
      deleteEntry(entry);
    }
  }
  function invalidate(target, key2, options = {}) {
    const entry = getEntry(target, key2);
    invalidateEntry(entry, options);
  }
  function invalidateAll(target, options = {}) {
    const targetMap = entries.get(target);
    if (targetMap) {
      for (const entry of targetMap.values()) {
        invalidateEntry(entry, options);
      }
    }
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/render.js
  function render(fn, useShadow) {
    return {
      get: useShadow ? (host) => {
        const updateDOM = fn(host);
        const target = host.shadowRoot || host.attachShadow({
          mode: "open",
          delegatesFocus: fn.delegatesFocus || false
        });
        return () => {
          updateDOM(host, target);
          return target;
        };
      } : (host) => {
        const updateDOM = fn(host);
        return () => {
          updateDOM(host, host);
          return host;
        };
      },
      observe(host, flush) {
        flush();
      }
    };
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/value.js
  var setters = {
    string: (host, value2, attrName) => {
      const nextValue = value2 ? String(value2) : "";
      if (nextValue) {
        host.setAttribute(attrName, nextValue);
      } else {
        host.removeAttribute(attrName);
      }
      return nextValue;
    },
    number: (host, value2, attrName) => {
      const nextValue = Number(value2);
      host.setAttribute(attrName, nextValue);
      return nextValue;
    },
    boolean: (host, value2, attrName) => {
      const nextValue = Boolean(value2);
      if (nextValue) {
        host.setAttribute(attrName, "");
      } else {
        host.removeAttribute(attrName);
      }
      return nextValue;
    },
    undefined: (host, value2, attrName) => {
      const type = typeof value2;
      const set3 = type !== "undefined" && setters[type];
      if (set3) {
        return set3(host, value2, attrName);
      } else if (host.hasAttribute(attrName)) {
        host.removeAttribute(attrName);
      }
      return value2;
    }
  };
  var getters = {
    string: (host, attrName) => host.getAttribute(attrName),
    number: (host, attrName) => Number(host.getAttribute(attrName)) || 0,
    boolean: (host, attrName) => host.hasAttribute(attrName),
    undefined: (host, attrName) => host.getAttribute(attrName)
  };
  function value(key2, desc) {
    const type = typeof desc.value;
    const set3 = setters[type];
    const get3 = getters[type];
    if (!set3) {
      throw TypeError(
        `Invalid default value for '${key2}' property - it must be a string, number, boolean or undefined: ${type}`
      );
    }
    const attrName = camelToDash(key2);
    return {
      get: (host, value2) => value2 === void 0 ? get3(host, attrName) || desc.value : value2,
      set: (host, value2) => set3(host, value2, attrName),
      connect: type !== "undefined" ? (host, key3, invalidate2) => {
        if (!host.hasAttribute(attrName) && host[key3] === desc.value) {
          host[key3] = set3(host, desc.value, attrName);
        }
        return desc.connect && desc.connect(host, key3, invalidate2);
      } : desc.connect,
      observe: desc.observe
    };
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/define.js
  var constructors = /* @__PURE__ */ new WeakMap();
  var disconnects = /* @__PURE__ */ new WeakMap();
  function compile(hybrids, HybridsElement) {
    if (HybridsElement) {
      const prevHybrids = constructors.get(HybridsElement);
      if (hybrids === prevHybrids)
        return HybridsElement;
      for (const key2 of Object.keys(prevHybrids)) {
        if (key2 === "tag")
          continue;
        delete HybridsElement.prototype[key2];
      }
    } else {
      HybridsElement = class extends globalThis.HTMLElement {
        connectedCallback() {
          for (const key2 of HybridsElement.settable) {
            if (!hasOwnProperty.call(this, key2))
              continue;
            const value2 = this[key2];
            delete this[key2];
            this[key2] = value2;
          }
          const set3 = /* @__PURE__ */ new Set();
          disconnects.set(this, set3);
          add(() => {
            if (set3 === disconnects.get(this)) {
              for (const fn of HybridsElement.connects)
                set3.add(fn(this));
              for (const fn of HybridsElement.observers)
                set3.add(fn(this));
            }
          });
        }
        disconnectedCallback() {
          const callbacks = disconnects.get(this);
          for (const fn of callbacks) {
            if (fn)
              fn();
          }
          disconnects.delete(this);
          invalidateAll(this);
        }
      };
    }
    constructors.set(HybridsElement, Object.freeze(hybrids));
    const connects = /* @__PURE__ */ new Set();
    const observers = /* @__PURE__ */ new Set();
    const settable = /* @__PURE__ */ new Set();
    for (const key2 of Object.keys(hybrids)) {
      if (key2 === "tag")
        continue;
      let desc = hybrids[key2];
      const type = typeof desc;
      if (type === "function") {
        if (key2 === "render") {
          desc = render(desc, true);
        } else if (key2 === "content") {
          desc = render(desc);
        } else {
          desc = { get: desc };
        }
      } else if (type !== "object" || desc === null) {
        desc = { value: desc };
      } else if (desc.set) {
        if (hasOwnProperty.call(desc, "value")) {
          throw TypeError(
            `Invalid property descriptor for '${key2}' property - it must not have 'value' and 'set' properties at the same time.`
          );
        }
        const attrName = camelToDash(key2);
        const get3 = desc.get || ((host, value2) => value2);
        desc.get = (host, value2) => {
          if (value2 === void 0) {
            value2 = desc.set(host, host.getAttribute(attrName) || value2);
          }
          return get3(host, value2);
        };
      }
      if (hasOwnProperty.call(desc, "value")) {
        desc = value(key2, desc);
      } else if (!desc.get) {
        throw TypeError(
          `Invalid descriptor for '${key2}' property - it must contain 'value' or 'get' option`
        );
      }
      if (desc.set)
        settable.add(key2);
      Object.defineProperty(HybridsElement.prototype, key2, {
        get: function get3() {
          return get(this, key2, desc.get);
        },
        set: desc.set && function set3(newValue) {
          set(this, key2, desc.set, newValue);
        },
        enumerable: true,
        configurable: true
      });
      if (desc.connect) {
        connects.add(
          (host) => desc.connect(host, key2, () => {
            invalidate(host, key2);
          })
        );
      }
      if (desc.observe) {
        observers.add((host) => observe(host, key2, desc.get, desc.observe));
      }
    }
    HybridsElement.connects = connects;
    HybridsElement.observers = observers;
    HybridsElement.settable = settable;
    return HybridsElement;
  }
  var updateQueue = /* @__PURE__ */ new Map();
  function update(HybridsElement) {
    if (!updateQueue.size) {
      deferred.then(() => {
        walkInShadow(globalThis.document.body, (node) => {
          if (updateQueue.has(node.constructor)) {
            const prevHybrids = updateQueue.get(node.constructor);
            const hybrids = constructors.get(node.constructor);
            node.disconnectedCallback();
            for (const key2 of Object.keys(hybrids)) {
              const type = typeof hybrids[key2];
              const clearValue = type !== "object" && type !== "function" && hybrids[key2] !== prevHybrids[key2];
              if (clearValue)
                node.removeAttribute(camelToDash(key2));
              invalidate(node, key2, { clearValue });
            }
            node.connectedCallback();
          }
        });
        updateQueue.clear();
      });
    }
    updateQueue.set(HybridsElement, constructors.get(HybridsElement));
  }
  function define(hybrids) {
    if (!hybrids.tag) {
      throw TypeError(
        "Error while defining hybrids: 'tag' property with dashed tag name is required"
      );
    }
    const HybridsElement = globalThis.customElements.get(hybrids.tag);
    if (HybridsElement) {
      if (constructors.get(HybridsElement)) {
        update(HybridsElement);
        compile(hybrids, HybridsElement);
        return hybrids;
      }
      throw TypeError(
        `Custom element with '${hybrids.tag}' tag name already defined outside of the hybrids context`
      );
    }
    globalThis.customElements.define(hybrids.tag, compile(hybrids));
    return hybrids;
  }
  function from(components, { root = "", prefix } = {}) {
    for (const key2 of Object.keys(components)) {
      const hybrids = components[key2];
      if (!hybrids.tag) {
        const tag = camelToDash(
          [].concat(root).reduce((acc, root2) => acc.replace(root2, ""), key2).replace(/^[./]+/, "").replace(/\//g, "-").replace(/\.[a-zA-Z]+$/, "")
        );
        hybrids.tag = prefix ? `${prefix}-${tag}` : tag;
      }
      define(hybrids);
    }
    return components;
  }
  var define_default = Object.freeze(
    Object.assign(define, {
      compile: (hybrids) => compile(hybrids),
      from
    })
  );

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/utils.js
  var metaMap = /* @__PURE__ */ new WeakMap();
  function getMeta(key2) {
    let value2 = metaMap.get(key2);
    if (value2)
      return value2;
    metaMap.set(key2, value2 = {});
    return value2;
  }
  function getTemplateEnd(node) {
    let meta;
    while (node && (meta = getMeta(node)) && meta.endNode) {
      node = meta.endNode;
    }
    return node;
  }
  function removeTemplate(target) {
    if (target.nodeType === globalThis.Node.TEXT_NODE) {
      const data = metaMap.get(target);
      if (data && data.startNode) {
        const endNode = getTemplateEnd(data.endNode);
        let node = data.startNode;
        const lastNextSibling = endNode.nextSibling;
        while (node) {
          const nextSibling = node.nextSibling;
          node.parentNode.removeChild(node);
          node = nextSibling !== lastNextSibling && nextSibling;
        }
        metaMap.set(target, {});
      }
    } else {
      let child = target.childNodes[0];
      while (child) {
        target.removeChild(child);
        child = target.childNodes[0];
      }
      metaMap.set(target, {});
    }
  }
  var TIMESTAMP = Date.now();
  var getPlaceholder = (id = 0) => `H-${TIMESTAMP}-${id}`;

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/layout.js
  var hasAdoptedStylesheets = !!(globalThis.document && globalThis.document.adoptedStyleSheets);
  var NUMBER_REGEXP = /^\d+$/;
  var rules = {
    // base
    block: (props, align) => ({
      display: "block",
      "text-align": align
    }),
    inline: ({ display }) => ({
      display: `inline${display ? `-${display}` : ""}`
    }),
    contents: { display: "contents" },
    hidden: { display: "none" },
    // flexbox
    ...["row", "row-reverse", "column", "column-reverse"].reduce((acc, type) => {
      acc[type] = (props, wrap = "nowrap") => ({
        display: "flex",
        "flex-flow": `${type} ${wrap}`
      });
      return acc;
    }, {}),
    grow: (props, value2 = 1) => ({ "flex-grow": value2 }),
    shrink: (props, value2 = 1) => ({ "flex-shrink": value2 }),
    basis: (props, value2) => ({ "flex-basis": dimension(value2) }),
    order: (props, value2 = 0) => ({ order: value2 }),
    // grid
    grid: (props, columns = "1", rows = "", autoFlow = "", dense = "") => ({
      display: "grid",
      ...["columns", "rows"].reduce((acc, type) => {
        const value2 = type === "columns" ? columns : rows;
        acc[`grid-template-${type}`] = value2 && value2.split("|").map(
          (v) => v.match(NUMBER_REGEXP) ? `repeat(${v}, minmax(0, 1fr))` : dimension(v)
        ).join(" ");
        return acc;
      }, {}),
      "grid-auto-flow": `${autoFlow} ${dense && "dense"}`
    }),
    area: (props, column = "", row = "") => ({
      "grid-column": column.match(NUMBER_REGEXP) ? `span ${column}` : column,
      "grid-row": row.match(NUMBER_REGEXP) ? `span ${row}` : row
    }),
    gap: (props, column = 1, row = "") => ({
      "column-gap": dimension(column),
      "row-gap": dimension(row || column)
    }),
    // alignment
    items: (props, v1 = "start", v2 = "") => ({
      "place-items": `${v1} ${v2}`
    }),
    content: (props, v1 = "start", v2 = "") => ({
      "place-content": `${v1} ${v2}`
    }),
    self: (props, v1 = "start", v2 = "") => ({
      "place-self": `${v1} ${v2}`
    }),
    center: { "place-items": "center", "place-content": "center" },
    // size
    size: (props, width, height = width) => ({
      width: dimension(width),
      height: dimension(height),
      "box-sizing": "border-box"
    }),
    width: (props, base, min, max) => ({
      width: dimension(base),
      "min-width": dimension(min),
      "max-width": dimension(max),
      "box-sizing": "border-box"
    }),
    height: (props, base, min, max) => ({
      height: dimension(base),
      "min-height": dimension(min),
      "max-height": dimension(max),
      "box-sizing": "border-box"
    }),
    ratio: (props, v1) => ({ "aspect-ratio": v1 }),
    overflow: (props, v1 = "hidden", v2 = "") => {
      const type = v2 ? `-${v1}` : "";
      const value2 = v2 ? v2 : v1;
      return {
        [`overflow${type}`]: value2,
        ...value2 === "scroll" ? {
          "flex-grow": props["flex-grow"] || 1,
          "flex-basis": 0,
          "overscroll-behavior": "contain",
          "--webkit-overflow-scrolling": "touch"
        } : {}
      };
    },
    margin: (props, v1 = "1", v2, v3, v4) => {
      if (v1.match(/top|bottom|left|right/)) {
        return {
          [`margin-${v1}`]: dimension(v2 || "1")
        };
      }
      return {
        margin: `${dimension(v1)} ${dimension(v2)} ${dimension(v3)} ${dimension(
          v4
        )}`
      };
    },
    padding: (props, v1 = "1", v2, v3, v4) => {
      if (v1.match(/top|bottom|left|right/)) {
        return {
          [`padding-${v1}`]: dimension(v2 || "1")
        };
      }
      return {
        padding: `${dimension(v1)} ${dimension(v2)} ${dimension(v3)} ${dimension(
          v4
        )}`
      };
    },
    // position types
    absolute: { position: "absolute" },
    relative: { position: "relative" },
    fixed: { position: "fixed" },
    sticky: { position: "sticky" },
    static: { position: "static" },
    // position values
    inset: (props, value2 = 0) => {
      const d = dimension(value2);
      return { top: d, right: d, bottom: d, left: d };
    },
    top: (props, value2 = 0) => ({ top: dimension(value2) }),
    bottom: (props, value2 = 0) => ({ bottom: dimension(value2) }),
    left: (props, value2 = 0) => ({ left: dimension(value2) }),
    right: (props, value2 = 0) => ({ right: dimension(value2) }),
    layer: (props, value2 = 1) => ({ "z-index": value2 }),
    "": (props, _, ...args) => {
      if (args.length < 2) {
        throw new Error(
          "Generic rule '::' requires at least two arguments, eg.: ::[property]:[name]"
        );
      }
      return {
        [args[args.length - 2]]: `var(--${args.join("-")})`
      };
    },
    view: (props, value2) => ({ "view-transition-name": value2 })
  };
  var dimensions = {
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    full: "100%"
  };
  var queries = {
    portrait: "orientation: portrait",
    landscape: "orientation: landscape"
  };
  function dimension(value2) {
    value2 = dimensions[value2] || value2;
    if (/^-?\d+(\.\d+)*$/.test(String(value2))) {
      return `${value2 * 8}px`;
    }
    return value2 || "";
  }
  var globalSheet;
  function getCSSStyleSheet() {
    if (globalSheet)
      return globalSheet;
    if (hasAdoptedStylesheets) {
      globalSheet = new globalThis.CSSStyleSheet();
    } else {
      const el = globalThis.document.createElement("style");
      el.appendChild(globalThis.document.createTextNode(""));
      globalThis.document.head.appendChild(el);
      globalSheet = el.sheet;
    }
    globalSheet.insertRule(":host([hidden]) { display: none; }");
    return globalSheet;
  }
  var styleElements = /* @__PURE__ */ new WeakMap();
  var injectedTargets = /* @__PURE__ */ new WeakSet();
  function inject(target) {
    const root = target.getRootNode();
    if (injectedTargets.has(root))
      return;
    const sheet = getCSSStyleSheet();
    if (hasAdoptedStylesheets) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    } else {
      if (root === globalThis.document)
        return;
      let el = styleElements.get(root);
      if (!el) {
        el = globalThis.document.createElement("style");
        root.appendChild(el);
        styleElements.set(root, el);
      }
      let result = "";
      for (let i = 0; i < sheet.cssRules.length; i++) {
        result += sheet.cssRules[i].cssText;
      }
      el.textContent = result;
    }
    injectedTargets.add(root);
  }
  var classNames = /* @__PURE__ */ new Map();
  function insertRule(node, query, tokens, hostMode) {
    let className = classNames.get(node);
    if (!className) {
      className = `l-${Math.random().toString(36).substr(2, 5)}`;
      classNames.set(node, className);
    }
    if (!hasAdoptedStylesheets)
      injectedTargets = /* @__PURE__ */ new WeakSet();
    const sheet = getCSSStyleSheet();
    const [selectors, mediaQueries = ""] = query.split("@");
    const cssRules = Object.entries(
      tokens.replace(/\s+/g, " ").trim().split(" ").reduce((acc, token) => {
        const [id, ...args] = token.split(":");
        const rule = rules[id];
        if (!rule) {
          throw TypeError(`Unsupported layout rule: '${id}'`);
        }
        return Object.assign(
          acc,
          typeof rule === "function" ? rule(acc, ...args.map((v) => v.match(/--.*/) ? `var(${v})` : v)) : rule
        );
      }, {})
    ).reduce(
      (acc, [key2, value2]) => value2 !== void 0 && value2 !== "" ? acc + `${key2}: ${value2};` : acc,
      ""
    );
    const mediaSelector = mediaQueries.split(":").reduce((acc, query2) => {
      if (query2 === "")
        return acc;
      return acc + ` and (${queries[query2] || `min-width: ${query2}`})`;
    }, "@media screen");
    if (hostMode) {
      const shadowSelector = `:host(:where(.${className}-s${selectors}))`;
      const contentSelector = `:where(.${className}-c${selectors})`;
      [shadowSelector, contentSelector].forEach((selector) => {
        sheet.insertRule(
          mediaQueries ? `${mediaSelector} { ${selector} { ${cssRules} } }` : `${selector} { ${cssRules} }`,
          sheet.cssRules.length - 1
        );
      });
    } else {
      const selector = `.${className}${selectors}`;
      sheet.insertRule(
        mediaQueries ? `${mediaSelector} { ${selector} { ${cssRules} } }` : `${selector} { ${cssRules} }`,
        sheet.cssRules.length - 1
      );
    }
    return className;
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/resolvers/array.js
  var arrayMap = /* @__PURE__ */ new WeakMap();
  function movePlaceholder(target, previousSibling) {
    const meta = getMeta(target);
    const startNode = meta.startNode;
    const endNode = getTemplateEnd(meta.endNode);
    previousSibling.parentNode.insertBefore(target, previousSibling.nextSibling);
    let prevNode = target;
    let node = startNode;
    while (node) {
      const nextNode = node.nextSibling;
      prevNode.parentNode.insertBefore(node, prevNode.nextSibling);
      prevNode = node;
      node = nextNode !== endNode.nextSibling && nextNode;
    }
  }
  function resolveArray(host, target, value2, resolveValue3, useLayout) {
    let lastEntries = arrayMap.get(target);
    const entries2 = value2.map((item, index) => ({
      id: hasOwnProperty.call(item, "id") ? item.id : index,
      value: item,
      placeholder: null,
      available: true
    }));
    arrayMap.set(target, entries2);
    if (lastEntries) {
      const ids = /* @__PURE__ */ new Set();
      for (const entry of entries2) {
        ids.add(entry.id);
      }
      lastEntries = lastEntries.filter((entry) => {
        if (!ids.has(entry.id)) {
          removeTemplate(entry.placeholder);
          entry.placeholder.parentNode.removeChild(entry.placeholder);
          return false;
        }
        return true;
      });
    }
    let previousSibling = target;
    const lastIndex = value2.length - 1;
    const meta = getMeta(target);
    for (let index = 0; index < entries2.length; index += 1) {
      const entry = entries2[index];
      let matchedEntry;
      if (lastEntries) {
        for (let i = 0; i < lastEntries.length; i += 1) {
          if (lastEntries[i].available && lastEntries[i].id === entry.id) {
            matchedEntry = lastEntries[i];
            break;
          }
        }
      }
      if (matchedEntry) {
        matchedEntry.available = false;
        entry.placeholder = matchedEntry.placeholder;
        if (entry.placeholder.previousSibling !== previousSibling) {
          movePlaceholder(entry.placeholder, previousSibling);
        }
        if (matchedEntry.value !== entry.value) {
          resolveValue3(
            host,
            entry.placeholder,
            entry.value,
            matchedEntry.value,
            useLayout
          );
        }
      } else {
        entry.placeholder = globalThis.document.createTextNode("");
        previousSibling.parentNode.insertBefore(
          entry.placeholder,
          previousSibling.nextSibling
        );
        resolveValue3(host, entry.placeholder, entry.value, void 0, useLayout);
      }
      previousSibling = getTemplateEnd(
        getMeta(entry.placeholder, {}).endNode || entry.placeholder
      );
      if (index === 0)
        meta.startNode = entry.placeholder;
      if (index === lastIndex)
        meta.endNode = previousSibling;
    }
    if (lastEntries) {
      for (const entry of lastEntries) {
        if (entry.available) {
          removeTemplate(entry.placeholder);
          entry.placeholder.parentNode.removeChild(entry.placeholder);
        }
      }
    }
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/resolvers/node.js
  function resolveNode(host, target, value2) {
    removeTemplate(target);
    const meta = getMeta(target);
    meta.startNode = meta.endNode = value2;
    target.parentNode.insertBefore(value2, target.nextSibling);
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/resolvers/value.js
  function typeOf(value2) {
    const type = typeof value2;
    if (type === "object") {
      if (Array.isArray(value2))
        return "array";
      if (value2 instanceof globalThis.Node)
        return "node";
    }
    return type;
  }
  function resolveValue(host, target, value2, lastValue, useLayout) {
    const type = typeOf(value2);
    const lastType = typeOf(lastValue);
    if (lastType !== "undefined" && type !== lastType) {
      if (type !== "function")
        removeTemplate(target);
      if (lastType === "array") {
        arrayMap.delete(target);
      } else if (lastType !== "node" && lastType !== "function") {
        target.textContent = "";
      }
    }
    switch (type) {
      case "array":
        resolveArray(host, target, value2, resolveValue, useLayout);
        break;
      case "node":
        resolveNode(host, target, value2);
        break;
      case "function":
        if (useLayout)
          value2.useLayout = true;
        value2(host, target);
        break;
      default:
        target.textContent = type === "number" || value2 ? value2 : "";
    }
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/resolvers/event.js
  var targets = /* @__PURE__ */ new WeakMap();
  function resolveEventListener(eventType) {
    return (host, target, value2, lastValue) => {
      if (lastValue) {
        const eventMap = targets.get(target);
        target.removeEventListener(
          eventType,
          eventMap.get(lastValue),
          lastValue.options !== void 0 ? lastValue.options : false
        );
      }
      if (value2) {
        if (typeof value2 !== "function") {
          throw Error(`Event listener must be a function: ${typeof value2}`);
        }
        let eventMap = targets.get(target);
        if (!eventMap) {
          eventMap = /* @__PURE__ */ new WeakMap();
          targets.set(target, eventMap);
        }
        const callback = value2.bind(null, host);
        eventMap.set(value2, callback);
        target.addEventListener(
          eventType,
          callback,
          value2.options !== void 0 ? value2.options : false
        );
      }
    };
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/resolvers/class.js
  function addClassNames(set3, value2) {
    if (value2) {
      for (const className of String(value2).split(/\s+/)) {
        if (className)
          set3.add(className);
      }
    }
  }
  function normalizeValue(value2) {
    const set3 = /* @__PURE__ */ new Set();
    if (Array.isArray(value2)) {
      for (const v of value2) {
        addClassNames(set3, v);
      }
    } else if (value2 !== null && typeof value2 === "object") {
      for (const [v, condition] of Object.entries(value2)) {
        if (v && condition)
          addClassNames(set3, v);
      }
    } else {
      addClassNames(set3, value2);
    }
    return set3;
  }
  var classMap = /* @__PURE__ */ new WeakMap();
  function resolveClassList(host, target, value2) {
    const previousList = classMap.get(target) || /* @__PURE__ */ new Set();
    const list = normalizeValue(value2);
    classMap.set(target, list);
    for (const className of list) {
      target.classList.add(className);
      previousList.delete(className);
    }
    for (const className of previousList) {
      target.classList.remove(className);
    }
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/resolvers/style.js
  var styleMap = /* @__PURE__ */ new WeakMap();
  function resolveStyle(host, target, value2) {
    if (value2 === null || typeof value2 !== "object") {
      throw TypeError(
        `Style value must be an object in ${stringifyElement(target)}:`,
        value2
      );
    }
    const previousMap = styleMap.get(target) || /* @__PURE__ */ new Map();
    const nextMap = /* @__PURE__ */ new Map();
    for (const key2 of Object.keys(value2)) {
      const dashKey = camelToDash(key2);
      const styleValue = value2[key2];
      if (!styleValue && styleValue !== 0) {
        target.style.removeProperty(dashKey);
      } else {
        target.style.setProperty(dashKey, styleValue);
      }
      nextMap.set(dashKey, styleValue);
      previousMap.delete(dashKey);
    }
    for (const key2 of previousMap.keys()) {
      target.style[key2] = "";
    }
    styleMap.set(target, nextMap);
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/resolvers/property.js
  function resolveProperty(attrName, propertyName, isSVG) {
    if (propertyName.substr(0, 2) === "on") {
      const eventType = propertyName.substr(2);
      return resolveEventListener(eventType);
    }
    switch (attrName) {
      case "class":
        return resolveClassList;
      case "style":
        return resolveStyle;
      default: {
        let isProp = false;
        return (host, target, value2) => {
          isProp = isProp || !isSVG && !(target instanceof globalThis.SVGElement) && propertyName in target;
          if (isProp) {
            target[propertyName] = value2;
          } else if (value2 === false || value2 === void 0 || value2 === null) {
            target.removeAttribute(attrName);
          } else {
            const attrValue = value2 === true ? "" : String(value2);
            target.setAttribute(attrName, attrValue);
          }
        };
      }
    }
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/core.js
  var PLACEHOLDER_REGEXP_TEXT = getPlaceholder("(\\d+)");
  var PLACEHOLDER_REGEXP_EQUAL = new RegExp(`^${PLACEHOLDER_REGEXP_TEXT}$`);
  var PLACEHOLDER_REGEXP_ALL = new RegExp(PLACEHOLDER_REGEXP_TEXT, "g");
  var PLACEHOLDER_REGEXP_ONLY = /^[^A-Za-z]+$/;
  function createSignature(parts) {
    let signature = parts[0];
    let tableMode = false;
    for (let index = 1; index < parts.length; index += 1) {
      tableMode = tableMode || signature.match(
        /<\s*(table|th|tr|td|thead|tbody|tfoot|caption|colgroup)([^<>]|"[^"]*"|'[^']*')*>\s*$/
      );
      signature += (tableMode ? `<!--${getPlaceholder(index - 1)}-->` : getPlaceholder(index - 1)) + parts[index];
      tableMode = tableMode && !signature.match(
        /<\/\s*(table|th|tr|td|thead|tbody|tfoot|caption|colgroup)\s*>/
      );
    }
    return signature;
  }
  function getPropertyName(string) {
    return string.replace(/\s*=\s*['"]*$/g, "").split(/\s+/).pop();
  }
  function createWalker(context2) {
    return globalThis.document.createTreeWalker(
      context2,
      globalThis.NodeFilter.SHOW_ELEMENT | globalThis.NodeFilter.SHOW_TEXT | globalThis.NodeFilter.SHOW_COMMENT,
      null,
      false
    );
  }
  function normalizeWhitespace(input, startIndent = 0) {
    input = input.replace(/(^[\n\s\t ]+)|([\n\s\t ]+$)+/g, "");
    let i = input.indexOf("\n");
    if (i > -1) {
      let indent = 0 - startIndent - 2;
      for (i += 1; input[i] === " " && i < input.length; i += 1) {
        indent += 1;
      }
      return input.replace(
        /\n +/g,
        (t) => t.substr(0, Math.max(t.length - indent, 1))
      );
    }
    return input;
  }
  function beautifyTemplateLog(input, index) {
    const placeholder = getPlaceholder(index);
    const output = normalizeWhitespace(input).split("\n").filter((i) => i).map((line) => {
      const startIndex = line.indexOf(placeholder);
      if (startIndex > -1) {
        return `| ${line}
--${"-".repeat(startIndex)}${"^".repeat(6)}`;
      }
      return `| ${line}`;
    }).join("\n").replace(PLACEHOLDER_REGEXP_ALL, "${...}");
    return `${output}`;
  }
  var styleSheetsMap = /* @__PURE__ */ new Map();
  var prevStyleSheetsMap = /* @__PURE__ */ new WeakMap();
  function updateAdoptedStylesheets(target, styles) {
    const prevStyleSheets = prevStyleSheetsMap.get(target);
    if (!prevStyleSheets && !styles)
      return;
    const styleSheets = styles && styles.map((style2) => {
      let styleSheet = style2;
      if (!(styleSheet instanceof globalThis.CSSStyleSheet)) {
        styleSheet = styleSheetsMap.get(style2);
        if (!styleSheet) {
          styleSheet = new globalThis.CSSStyleSheet();
          styleSheet.replaceSync(style2);
          styleSheetsMap.set(style2, styleSheet);
        }
      }
      return styleSheet;
    });
    let adoptedStyleSheets;
    if (prevStyleSheets) {
      if (styleSheets && styleSheets.length === prevStyleSheets.length && styleSheets.every((s, i) => s === prevStyleSheets[i])) {
        return;
      }
      adoptedStyleSheets = target.adoptedStyleSheets.filter(
        (s) => !prevStyleSheets.includes(s)
      );
    }
    if (styleSheets) {
      adoptedStyleSheets = (adoptedStyleSheets || target.adoptedStyleSheets).concat(styleSheets);
    }
    target.adoptedStyleSheets = adoptedStyleSheets;
    prevStyleSheetsMap.set(target, styleSheets);
  }
  var styleElementMap = /* @__PURE__ */ new WeakMap();
  function updateStyleElement(target, styles) {
    let styleEl = styleElementMap.get(target);
    if (styles) {
      if (!styleEl || styleEl.parentNode !== target) {
        styleEl = globalThis.document.createElement("style");
        styleElementMap.set(target, styleEl);
        target = getTemplateEnd(target);
        if (target.nodeType === globalThis.Node.TEXT_NODE) {
          target.parentNode.insertBefore(styleEl, target.nextSibling);
        } else {
          target.appendChild(styleEl);
        }
      }
      const result = [...styles].join("\n/*------*/\n");
      if (styleEl.textContent !== result) {
        styleEl.textContent = result;
      }
    } else if (styleEl) {
      styleEl.parentNode.removeChild(styleEl);
      styleElementMap.set(target, null);
    }
  }
  var updateStyleFns = /* @__PURE__ */ new WeakMap();
  function updateStyles(target, styles) {
    let fn = updateStyleFns.get(target);
    if (!fn) {
      fn = target.adoptedStyleSheets ? updateAdoptedStylesheets : updateStyleElement;
      updateStyleFns.set(target, fn);
    }
    fn(target, styles);
  }
  function compileTemplate(rawParts, isSVG, isMsg, useLayout) {
    let template = globalThis.document.createElement("template");
    const parts = {};
    const signature = isMsg ? rawParts : createSignature(rawParts);
    template.innerHTML = isSVG ? `<svg>${signature}</svg>` : signature;
    if (isSVG) {
      const svgRoot = template.content.firstChild;
      template.content.removeChild(svgRoot);
      for (const node of Array.from(svgRoot.childNodes)) {
        template.content.appendChild(node);
      }
    }
    let hostLayout;
    const layoutTemplate = template.content.children[0];
    if (layoutTemplate instanceof globalThis.HTMLTemplateElement) {
      for (const attr of Array.from(layoutTemplate.attributes)) {
        const value2 = attr.value.trim();
        if (value2 && attr.name.startsWith("layout")) {
          if (value2.match(PLACEHOLDER_REGEXP_ALL)) {
            throw Error("Layout attribute cannot contain expressions");
          }
          hostLayout = insertRule(
            layoutTemplate,
            attr.name.substr(6),
            value2,
            true
          );
        }
      }
      if (hostLayout !== void 0 && template.content.children.length > 1) {
        throw Error(
          "Template, which uses layout system must have only the '<template>' root element"
        );
      }
      useLayout = hostLayout || layoutTemplate.hasAttribute("layout");
      template = layoutTemplate;
    }
    const compileWalker = createWalker(template.content);
    const notDefinedElements = [];
    let compileIndex = 0;
    let noTranslate = null;
    while (compileWalker.nextNode()) {
      let node = compileWalker.currentNode;
      if (noTranslate && !noTranslate.contains(node)) {
        noTranslate = null;
      }
      if (node.nodeType === globalThis.Node.COMMENT_NODE) {
        if (PLACEHOLDER_REGEXP_EQUAL.test(node.textContent)) {
          node.parentNode.insertBefore(
            globalThis.document.createTextNode(node.textContent),
            node.nextSibling
          );
          compileWalker.nextNode();
          node.parentNode.removeChild(node);
          node = compileWalker.currentNode;
        }
      }
      if (node.nodeType === globalThis.Node.TEXT_NODE) {
        let text = node.textContent;
        const equal = text.match(PLACEHOLDER_REGEXP_EQUAL);
        if (equal) {
          node.textContent = "";
          parts[equal[1]] = [compileIndex, resolveValue];
        } else {
          if (isLocalizeEnabled() && !isMsg && !noTranslate && !text.match(/^\s*$/)) {
            let offset;
            const key2 = text.trim();
            const localizedKey = key2.replace(/\s+/g, " ").replace(PLACEHOLDER_REGEXP_ALL, (_, index) => {
              index = Number(index);
              if (offset === void 0)
                offset = index;
              return `\${${index - offset}}`;
            });
            if (!localizedKey.match(PLACEHOLDER_REGEXP_ONLY)) {
              let context2 = node.previousSibling && node.previousSibling.nodeType === globalThis.Node.COMMENT_NODE ? node.previousSibling : "";
              if (context2) {
                context2.parentNode.removeChild(context2);
                compileIndex -= 1;
                context2 = (context2.textContent.split("|")[1] || "").trim().replace(/\s+/g, " ");
              }
              const resultKey = get2(localizedKey, context2).replace(
                /\${(\d+)}/g,
                (_, index) => getPlaceholder(Number(index) + offset)
              );
              text = text.replace(key2, resultKey);
              node.textContent = text;
            }
          }
          const results = text.match(PLACEHOLDER_REGEXP_ALL);
          if (results) {
            let currentNode = node;
            results.reduce(
              (acc, placeholder) => {
                const [before, next] = acc.pop().split(placeholder);
                if (before)
                  acc.push(before);
                acc.push(placeholder);
                if (next)
                  acc.push(next);
                return acc;
              },
              [text]
            ).forEach((part, index) => {
              if (index === 0) {
                currentNode.textContent = part;
              } else {
                currentNode = currentNode.parentNode.insertBefore(
                  globalThis.document.createTextNode(part),
                  currentNode.nextSibling
                );
                compileWalker.currentNode = currentNode;
                compileIndex += 1;
              }
              const equal2 = currentNode.textContent.match(
                PLACEHOLDER_REGEXP_EQUAL
              );
              if (equal2) {
                currentNode.textContent = "";
                parts[equal2[1]] = [compileIndex, resolveValue];
              }
            });
          }
        }
      } else {
        if (node.nodeType === globalThis.Node.ELEMENT_NODE) {
          if (!noTranslate && (node.getAttribute("translate") === "no" || node.tagName.toLowerCase() === "script" || node.tagName.toLowerCase() === "style")) {
            noTranslate = node;
          }
          if (probablyDevMode) {
            const tagName = node.tagName.toLowerCase();
            if (tagName.match(/.+-.+/) && !globalThis.customElements.get(tagName) && !notDefinedElements.includes(tagName)) {
              notDefinedElements.push(tagName);
            }
          }
          for (const attr of Array.from(node.attributes)) {
            const value2 = attr.value.trim();
            const name = attr.name;
            if (useLayout && name.startsWith("layout") && value2) {
              if (value2.match(PLACEHOLDER_REGEXP_ALL)) {
                throw Error("Layout attribute cannot contain expressions");
              }
              const className = insertRule(node, name.substr(6), value2);
              node.removeAttribute(name);
              node.classList.add(className);
              continue;
            }
            const equal = value2.match(PLACEHOLDER_REGEXP_EQUAL);
            if (equal) {
              const propertyName = getPropertyName(rawParts[equal[1]]);
              parts[equal[1]] = [
                compileIndex,
                resolveProperty(name, propertyName, isSVG)
              ];
              node.removeAttribute(attr.name);
            } else {
              const results = value2.match(PLACEHOLDER_REGEXP_ALL);
              if (results) {
                const partialName = `attr__${name}`;
                for (const [index, placeholder] of results.entries()) {
                  const [, id] = placeholder.match(PLACEHOLDER_REGEXP_EQUAL);
                  let isProp = false;
                  parts[id] = [
                    compileIndex,
                    (host, target, attrValue) => {
                      const meta = getMeta(target);
                      meta[partialName] = (meta[partialName] || value2).replace(
                        placeholder,
                        attrValue == null ? "" : attrValue
                      );
                      if (results.length === 1 || index + 1 === results.length) {
                        isProp = isProp || !isSVG && !(target instanceof globalThis.SVGElement) && name in target;
                        if (isProp) {
                          target[name] = meta[partialName];
                        } else {
                          target.setAttribute(name, meta[partialName]);
                        }
                        meta[partialName] = void 0;
                      }
                    }
                  ];
                }
                attr.value = "";
              }
            }
          }
        }
      }
      compileIndex += 1;
    }
    if (probablyDevMode && notDefinedElements.length) {
      console.warn(
        `Not defined ${notDefinedElements.map((e) => `<${e}>`).join(", ")} element${notDefinedElements.length > 1 ? "s" : ""} found in the template:
${beautifyTemplateLog(signature, -1)}`
      );
    }
    const partsKeys = Object.keys(parts);
    return function updateTemplateInstance(host, target, args, { styleSheets }) {
      let meta = getMeta(target);
      if (template !== meta.template) {
        const fragment = globalThis.document.importNode(template.content, true);
        const renderWalker = createWalker(fragment);
        const markers = [];
        let renderIndex = 0;
        let keyIndex = 0;
        let currentPart = parts[partsKeys[keyIndex]];
        while (renderWalker.nextNode()) {
          const node = renderWalker.currentNode;
          while (currentPart && currentPart[0] === renderIndex) {
            markers.push({
              index: partsKeys[keyIndex],
              node,
              fn: currentPart[1]
            });
            keyIndex += 1;
            currentPart = parts[partsKeys[keyIndex]];
          }
          renderIndex += 1;
        }
        if (meta.hostLayout) {
          host.classList.remove(meta.hostLayout);
        }
        removeTemplate(target);
        meta = getMeta(target);
        meta.template = template;
        meta.markers = markers;
        if (target.nodeType === globalThis.Node.TEXT_NODE) {
          updateStyleElement(target);
          meta.startNode = fragment.childNodes[0];
          meta.endNode = fragment.childNodes[fragment.childNodes.length - 1];
          let previousChild = target;
          let child = fragment.childNodes[0];
          while (child) {
            target.parentNode.insertBefore(child, previousChild.nextSibling);
            previousChild = child;
            child = fragment.childNodes[0];
          }
        } else {
          if (useLayout) {
            const className = `${hostLayout}-${host === target ? "c" : "s"}`;
            host.classList.add(className);
            meta.hostLayout = className;
          }
          target.appendChild(fragment);
        }
        if (useLayout)
          inject(target);
      }
      updateStyles(target, styleSheets);
      for (const marker of meta.markers) {
        const value2 = args[marker.index];
        const prevValue = meta.prevArgs && meta.prevArgs[marker.index];
        if (meta.prevArgs && value2 === prevValue)
          continue;
        try {
          marker.fn(host, marker.node, value2, prevValue, useLayout);
        } catch (error) {
          console.error(
            `Error while updating template expression in ${stringifyElement(
              host
            )}:
${beautifyTemplateLog(signature, marker.index)}`
          );
          throw error;
        }
      }
      meta.prevArgs = args;
    };
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/helpers/index.js
  var helpers_exports = {};
  __export(helpers_exports, {
    resolve: () => resolve,
    set: () => set2,
    transition: () => transition_default
  });

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/helpers/resolve.js
  var promiseMap = /* @__PURE__ */ new WeakMap();
  function resolve(promise, placeholder, delay = 200) {
    return function fn(host, target) {
      const useLayout = fn.useLayout;
      let timeout;
      if (placeholder) {
        timeout = setTimeout(() => {
          timeout = void 0;
          resolveValue(host, target, placeholder, void 0, useLayout);
        }, delay);
      }
      promiseMap.set(target, promise);
      promise.then((value2) => {
        if (timeout)
          clearTimeout(timeout);
        if (promiseMap.get(target) === promise) {
          resolveValue(
            host,
            target,
            value2,
            placeholder && !timeout ? placeholder : void 0,
            useLayout
          );
          promiseMap.set(target, null);
        }
      });
    };
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/helpers/set.js
  function resolveValue2({ target, detail }, setter) {
    let value2;
    switch (target.type) {
      case "radio":
      case "checkbox":
        value2 = target.checked && target.value;
        break;
      case "file":
        value2 = target.files;
        break;
      default:
        value2 = detail && hasOwnProperty.call(detail, "value") ? detail.value : target.value;
    }
    setter(value2);
  }
  function getPartialObject(name, value2) {
    return name.split(".").reverse().reduce((acc, key2) => {
      if (!acc)
        return { [key2]: value2 };
      return { [key2]: acc };
    }, null);
  }
  var stringCache = /* @__PURE__ */ new Map();
  function set2(property, valueOrPath) {
    if (!property) {
      throw Error(
        `The first argument must be a property name or an object instance: ${property}`
      );
    }
    if (typeof property === "object") {
      if (valueOrPath === void 0) {
        throw Error(
          "For model instance property the second argument must be defined"
        );
      }
      const store = storePointer.get(property);
      if (!store) {
        throw Error("Provided object must be a model instance of the store");
      }
      if (valueOrPath === null) {
        return () => {
          store.set(property, null);
        };
      }
      return (host, event) => {
        resolveValue2(event, (value2) => {
          store.set(property, getPartialObject(valueOrPath, value2));
        });
      };
    }
    if (arguments.length === 2) {
      return (host) => {
        host[property] = valueOrPath;
      };
    }
    let fn = stringCache.get(property);
    if (!fn) {
      fn = (host, event) => {
        resolveValue2(event, (value2) => {
          host[property] = value2;
        });
      };
      stringCache.set(property, fn);
    }
    return fn;
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/helpers/transition.js
  var instance;
  var transition_default = globalThis.document && globalThis.document.startViewTransition !== void 0 && function transition(template) {
    return function fn(host, target) {
      if (instance) {
        console.warn(
          `${stringifyElement(
            host
          )}: view transition already started in ${stringifyElement(instance)}`
        );
        template(host, target);
        return;
      }
      template.useLayout = fn.useLayout;
      instance = host;
      globalThis.document.startViewTransition(() => {
        template(host, target);
        return deferred.then(() => {
          instance = void 0;
        });
      });
    };
  } || // istanbul ignore next
  ((fn) => fn);

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/methods.js
  var methods_exports = {};
  __export(methods_exports, {
    css: () => css,
    key: () => key,
    style: () => style,
    use: () => use
  });
  function key(id) {
    this.id = id;
    return this;
  }
  function style(...styles) {
    this.styleSheets = this.styleSheets || [];
    this.styleSheets.push(...styles);
    return this;
  }
  function css(parts, ...args) {
    this.styleSheets = this.styleSheets || [];
    let result = parts[0];
    for (let index = 1; index < parts.length; index++) {
      result += (args[index - 1] !== void 0 ? args[index - 1] : "") + parts[index];
    }
    this.styleSheets.push(result);
    return this;
  }
  function use(plugin) {
    this.plugins = this.plugins || [];
    this.plugins.push(plugin);
    return this;
  }

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/template/index.js
  var PLACEHOLDER = getPlaceholder();
  var PLACEHOLDER_SVG = getPlaceholder("svg");
  var PLACEHOLDER_MSG = getPlaceholder("msg");
  var PLACEHOLDER_LAYOUT = getPlaceholder("layout");
  var templates = /* @__PURE__ */ new Map();
  function compile2(parts, args, isSVG, isMsg) {
    function template(host, target = host) {
      let id = isMsg ? parts + PLACEHOLDER_MSG : parts.join(PLACEHOLDER);
      if (isSVG)
        id += PLACEHOLDER_SVG;
      const useLayout = template.useLayout;
      if (useLayout)
        id += PLACEHOLDER_LAYOUT;
      let render2 = templates.get(id);
      if (!render2) {
        render2 = compileTemplate(parts, isSVG, isMsg, useLayout);
        templates.set(id, render2);
      }
      if (template.plugins) {
        template.plugins.reduce(
          (acc, plugin) => plugin(acc),
          () => render2(host, target, args, template)
        )(host, target);
      } else {
        render2(host, target, args, template);
      }
    }
    return Object.assign(template, methods_exports);
  }
  function html(parts, ...args) {
    return compile2(parts, args, false, false);
  }
  Object.freeze(Object.assign(html, helpers_exports));

  // node_modules/.pnpm/hybrids@8.2.7/node_modules/hybrids/src/localize.js
  var dictionary = /* @__PURE__ */ new Map();
  var cache = /* @__PURE__ */ new Map();
  var translate = null;
  var languages = (() => {
    let list;
    try {
      list = globalThis.navigator.languages || [globalThis.navigator.language];
    } catch (e) {
      list = [];
    }
    return list.reduce((set3, code) => {
      const codeWithoutRegion = code.split("-")[0];
      set3.add(code);
      if (code !== codeWithoutRegion)
        set3.add(codeWithoutRegion);
      return set3;
    }, /* @__PURE__ */ new Set());
  })();
  function isLocalizeEnabled() {
    return translate !== null || dictionary.size;
  }
  var pluralRules = /* @__PURE__ */ new Map();
  function get2(key2, context2, args = []) {
    key2 = key2.trim().replace(/\s+/g, " ");
    context2 = context2.trim();
    const cacheKey = `${key2} | ${context2}`;
    let msg2 = cache.get(cacheKey);
    if (!msg2) {
      if (dictionary.size) {
        for (const lang of languages) {
          const msgs = dictionary.get(lang);
          if (msgs) {
            msg2 = msgs[cacheKey] || msgs[key2];
            if (msg2) {
              msg2 = msg2.message;
              if (typeof msg2 === "object") {
                let rules2 = pluralRules.get(lang);
                if (!rules2) {
                  rules2 = new Intl.PluralRules(lang);
                  pluralRules.set(lang, rules2);
                }
                const pluralForms = msg2;
                msg2 = (number) => number === 0 && pluralForms.zero || pluralForms[rules2.select(number)] || pluralForms.other || "";
              }
              break;
            }
          }
        }
      }
      if (!msg2) {
        if (translate) {
          msg2 = translate(key2, context2);
        }
        if (!msg2) {
          msg2 = key2;
          if ((dictionary.size || translate) && probablyDevMode) {
            console.warn(
              `Missing translation: "${key2}"${context2 ? ` [${context2}]` : ""}`
            );
          }
        }
      }
      cache.set(cacheKey, msg2);
    }
    return typeof msg2 === "function" ? msg2(args[0]) : msg2;
  }
  function getKeyInChromeI18nFormat(key2) {
    return key2.replace("$", "@").replace(/[^a-zA-Z0-9_@]/g, "_").toLowerCase();
  }
  function localize(lang, messages) {
    switch (typeof lang) {
      case "function": {
        const options = messages || {};
        if (options.format === "chrome.i18n") {
          const cachedKeys = /* @__PURE__ */ new Map();
          translate = (key2, context2) => {
            key2 = context2 ? `${key2} | ${context2}` : key2;
            let cachedKey = cachedKeys.get(key2);
            if (!cachedKey) {
              cachedKey = getKeyInChromeI18nFormat(key2);
              cachedKeys.set(key2, cachedKey);
            }
            return lang(cachedKey, context2);
          };
        } else {
          translate = lang;
        }
        break;
      }
      case "string": {
        if (!messages || typeof messages !== "object") {
          throw TypeError("Messages must be an object");
        }
        if (lang === "default") {
          languages.add("default");
        }
        const current = dictionary.get(lang) || {};
        dictionary.set(lang, { ...current, ...messages });
        break;
      }
      default:
        throw TypeError("The first argument must be a string or a function");
    }
  }
  Object.defineProperty(localize, "languages", {
    get: () => Array.from(languages)
  });
  function getString(parts, args) {
    let string = "";
    for (const [index, part] of parts.entries()) {
      string += index ? `\${${index - 1}}${part}` : part;
    }
    const [key2, , context2 = ""] = string.split("|");
    return get2(key2, context2, args);
  }
  var EXP_REGEX = /\$\{(\d+)\}/g;
  function msg(parts, ...args) {
    return getString(parts, args).replace(EXP_REGEX, (_, index) => args[index]);
  }
  msg.html = function html2(parts, ...args) {
    const input = getString(parts, args);
    return compile2(
      input.replace(EXP_REGEX, (_, index) => getPlaceholder(index)),
      args,
      false,
      true
    );
  };
  msg.svg = function svg(parts, ...args) {
    const input = getString(parts, args);
    return compile2(
      input.replace(EXP_REGEX, (_, index) => getPlaceholder(index)),
      args,
      true,
      true
    );
  };

  // src/lib/counter.js
  function increaseCount(host) {
    host.count += 1;
  }
  var counter_default = define_default({
    tag: "simple-counter",
    count: 0,
    render: ({ count }) => html`
    <button onclick="${increaseCount}">Count: ${count}</button>
  `
  });
})();
