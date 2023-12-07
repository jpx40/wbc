(() => {
  // node_modules/.pnpm/nanostores@0.9.5/node_modules/nanostores/clean-stores/index.js
  var clean = Symbol("clean");

  // node_modules/.pnpm/nanostores@0.9.5/node_modules/nanostores/atom/index.js
  var listenerQueue = [];
  var atom = (initialValue, level) => {
    let listeners = [];
    let $atom = {
      get() {
        if (!$atom.lc) {
          $atom.listen(() => {
          })();
        }
        return $atom.value;
      },
      l: level || 0,
      lc: 0,
      listen(listener, listenerLevel) {
        $atom.lc = listeners.push(listener, listenerLevel || $atom.l) / 2;
        return () => {
          let index = listeners.indexOf(listener);
          if (~index) {
            listeners.splice(index, 2);
            if (!--$atom.lc)
              $atom.off();
          }
        };
      },
      notify(changedKey) {
        let runListenerQueue = !listenerQueue.length;
        for (let i = 0; i < listeners.length; i += 2) {
          listenerQueue.push(
            listeners[i],
            listeners[i + 1],
            $atom.value,
            changedKey
          );
        }
        if (runListenerQueue) {
          for (let i = 0; i < listenerQueue.length; i += 4) {
            let skip;
            for (let j = i + 1; !skip && (j += 4) < listenerQueue.length; ) {
              if (listenerQueue[j] < listenerQueue[i + 1]) {
                skip = listenerQueue.push(
                  listenerQueue[i],
                  listenerQueue[i + 1],
                  listenerQueue[i + 2],
                  listenerQueue[i + 3]
                );
              }
            }
            if (!skip) {
              listenerQueue[i](listenerQueue[i + 2], listenerQueue[i + 3]);
            }
          }
          listenerQueue.length = 0;
        }
      },
      off() {
      },
      /* It will be called on last listener unsubscribing.
         We will redefine it in onMount and onStop. */
      set(data) {
        if ($atom.value !== data) {
          $atom.value = data;
          $atom.notify();
        }
      },
      subscribe(listener, listenerLevel) {
        let unbind = $atom.listen(listener, listenerLevel);
        listener($atom.value);
        return unbind;
      },
      value: initialValue
    };
    if (true) {
      $atom[clean] = () => {
        listeners = [];
        $atom.lc = 0;
        $atom.off();
      };
    }
    return $atom;
  };

  // node_modules/.pnpm/nanostores@0.9.5/node_modules/nanostores/map/index.js
  var map = (value = {}) => {
    let $map = atom(value);
    $map.setKey = function(key, newValue) {
      if (typeof newValue === "undefined") {
        if (key in $map.value) {
          $map.value = { ...$map.value };
          delete $map.value[key];
          $map.notify(key);
        }
      } else if ($map.value[key] !== newValue) {
        $map.value = {
          ...$map.value,
          [key]: newValue
        };
        $map.notify(key);
      }
    };
    return $map;
  };

  // src/lib/nanomap.js
  var isCartOpen = atom(false);
  var cartItems = map({});
  function addCartItem({ id, name, imageSrc }) {
    const existingEntry = cartItems.get()[id];
    if (existingEntry) {
      cartItems.setKey(id, {
        ...existingEntry,
        quantity: existingEntry.quantity + 1
      });
    } else {
      cartItems.setKey(id, { id, name, imageSrc, quantity: 1 });
    }
  }
})();
