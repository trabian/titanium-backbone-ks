(function() {
  var log, stringify, _oldAlert,
    __slice = [].slice;

  stringify = function(statements) {
    var statement, strings;
    strings = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = statements.length; _i < _len; _i++) {
        statement = statements[_i];
        if (_.isString(statement)) {
          _results.push(statement);
        } else {
          _results.push(JSON.stringify(statement));
        }
      }
      return _results;
    })();
    return strings.join(' ');
  };

  log = function(level, statements) {
    Ti.API.log(level, stringify(statements));
  };

  this.console = {
    debug: function() {
      var statements;
      statements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.log(statements);
    },
    log: function() {
      var statements;
      statements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return log('debug', statements);
    },
    info: function() {
      var statements;
      statements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return log('info', statements);
    },
    warn: function() {
      var statements;
      statements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return log('warn', statements);
    },
    error: function() {
      var statements;
      statements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return log('error', statements);
    }
  };

  _oldAlert = this.alert;

  this.alert = function() {
    var statements;
    statements = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    _oldAlert(stringify(statements));
  };

}).call(this);

//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  root['_'] = _;

  // Current version.
  _.VERSION = '1.3.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      rand = Math.floor(Math.random() * (index + 1));
      shuffled[index] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, val, context) {
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a === void 0) return 1;
      if (b === void 0) return -1;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj)                                     return [];
    if (_.isArray(obj))                           return slice.call(obj);
    if (_.isArguments(obj))                       return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    // The `isSorted` flag is irrelevant if the array only contains two elements.
    if (array.length < 3) isSorted = true;
    _.reduce(initial, function (memo, value, index) {
      if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
        memo.push(value);
        results.push(array[index]);
      }
      return memo;
    }, []);
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1), true);
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        result = func.apply(context, args);
      }
      whenDone();
      throttling = true;
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var result = {};
    each(_.flatten(slice.call(arguments, 1)), function(key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    '\\': '\\',
    "'": "'",
    'r': '\r',
    'n': '\n',
    't': '\t',
    'u2028': '\u2028',
    'u2029': '\u2029'
  };

  for (var p in escapes) escapes[escapes[p]] = p;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(unescaper, function(match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p+='" + text
      .replace(escaper, function(match) {
        return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function(match, code) {
        return "'+\n_.escape(" + unescape(code) + ")+\n'";
      })
      .replace(settings.interpolate || noMatch, function(match, code) {
        return "'+\n(" + unescape(code) + ")+\n'";
      })
      .replace(settings.evaluate || noMatch, function(match, code) {
        return "';\n" + unescape(code) + "\n;__p+='";
      }) + "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __p='';" +
      "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
      source + "return __p;\n";

    var render = new Function(settings.variable || 'obj', '_', source);
    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for build time
    // precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
      source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);

var _ = this._;

//     Backbone.js 0.9.9

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org
(function() {

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to array methods.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone = root.Backbone = {};

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.9';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
      if (!name) return true;
      if (typeof name === 'object') {
        for (var key in name) {
          obj[action].apply(obj, [key, name[key]].concat(rest));
        }
      } else if (eventSplitter.test(name)) {
        var names = name.split(eventSplitter);
        for (var i = 0, l = names.length; i < l; i++) {
          obj[action].apply(obj, [names[i]].concat(rest));
        }
      } else {
        return true;
      }
    };

  // Optimized internal dispatch function for triggering events. Tries to
  // keep the usual cases speedy (most Backbone events have 3 arguments).
  var triggerEvents = function(obj, events, args) {
      var ev, i = -1,
        l = events.length;
      switch (args.length) {
      case 0:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx);
        return;
      case 1:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx, args[0]);
        return;
      case 2:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx, args[0], args[1]);
        return;
      case 3:
        while (++i < l)(ev = events[i]).callback.call(ev.ctx, args[0], args[1], args[2]);
        return;
      default:
        while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args);
      }
    };

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind one or more space separated events, or an events map,
    // to a `callback` function. Passing `"all"` will bind the callback to
    // all events fired.
    on: function(name, callback, context) {
      if (!(eventsApi(this, 'on', name, [callback, context]) && callback)) return this;
      this._events || (this._events = {});
      var list = this._events[name] || (this._events[name] = []);
      list.push({
        callback: callback,
        context: context,
        ctx: context || this
      });
      return this;
    },

    // Bind events to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!(eventsApi(this, 'once', name, [callback, context]) && callback)) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      this.on(name, once, context);
      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `events` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var list, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (list = this._events[name]) {
          events = [];
          if (callback || context) {
            for (j = 0, k = list.length; j < k; j++) {
              ev = list[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) || (context && context !== ev.context)) {
                events.push(ev);
              }
            }
          }
          this._events[name] = events;
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(this, events, args);
      if (allEvents) triggerEvents(this, allEvents, arguments);
      return this;
    },

    // An inversion-of-control version of `on`. Tell *this* object to listen to
    // an event in another object ... keeping track of what it's listening to.
    listenTo: function(object, events, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = object._listenerId || (object._listenerId = _.uniqueId('l'));
      listeners[id] = object;
      object.on(events, callback || this, this);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(object, events, callback) {
      var listeners = this._listeners;
      if (!listeners) return;
      if (object) {
        object.off(events, callback, this);
        if (!events && !callback) delete listeners[object._listenerId];
      } else {
        for (var id in listeners) {
          listeners[id].off(null, null, this);
        }
        this._listeners = {};
      }
      return this;
    }
  };

  // Aliases for backwards compatibility.
  Events.bind = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
      var defaults;
      var attrs = attributes || {};
      this.cid = _.uniqueId('c');
      this.attributes = {};
      if (options && options.collection) this.collection = options.collection;
      if (options && options.parse) attrs = this.parse(attrs, options) || {};
      if (defaults = _.result(this, 'defaults')) {
        attrs = _.defaults({}, attrs, defaults);
      }
      this.set(attrs, options);
      this.changed = {};
      this.initialize.apply(this, arguments);
    };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function() {},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // ----------------------------------------------------------------------

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset = options.unset;
      silent = options.silent;
      changes = [];
      changing = this._changing;
      this._changing = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {
        unset: true
      }));
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {
        unset: true
      }));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // ---------------------------------------------------------------------

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      options.success = function(model, resp, options) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
      };
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, model, success, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
      if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;

      options = _.extend({
        validate: true
      }, options);

      // Do not persist invalid models.
      if (!this._validate(attrs, options)) return false;

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      success = options.success;
      options.success = function(model, resp, options) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
      };

      // Finish configuring and sending the Ajax request.
      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method == 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
          model.trigger('destroy', model, model.collection, options);
        };

      options.success = function(model, resp, options) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
      };

      if (this.isNew()) {
        options.success(this, null, options);
        return false;
      }

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return !this.validate || !this.validate(this.attributes, options);
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire a general
    // `"error"` event and call the error callback, if specified.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, options || {});
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
      options || (options = {});
      if (options.model) this.model = options.model;
      if (options.comparator !== void 0) this.comparator = options.comparator;
      this._reset();
      this.initialize.apply(this, arguments);
      if (models) this.reset(models, _.extend({
        silent: true
      }, options));
    };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function() {},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model) {
        return model.toJSON(options);
      });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, model, attrs, existing, sort, doSort, sortAttr, at, add;
      add = [];
      at = options.at;
      sort = this.comparator && (at == null) && (options.sort == null || options.sort);
      sortAttr = _.isString(this.comparator) ? this.comparator : null;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i];
        if (!(model = this._prepareModel(attrs, options))) {
          this.trigger('invalid', this, attrs, options);
          continue;
        }
        models[i] = model;

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(model)) {
          if (options.merge) {
            existing.set(attrs === model ? model.attributes : attrs, options);
            if (sort && !doSort && existing.hasChanged(sortAttr)) doSort = true;
          }
          continue;
        }

        // This is a new model, push it to the `add` list.
        add.push(model);

        // Listen to added models' events, and index models for lookup by
        // `id` and by `cid`.
        model.on('all', this._onModelEvent, this);
        this._byId[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (add.length) {
        if (sort) doSort = true;
        this.length += add.length;
        if (at != null) {
          splice.apply(this.models, [at, 0].concat(add));
        } else {
          push.apply(this.models, add);
        }
      }

      // Silently sort the collection if appropriate.
      if (doSort) this.sort({
        silent: true
      });

      if (options.silent) return this;

      // Trigger `add` events.
      for (i = 0, l = add.length; i < l; i++) {
        (model = add[i]).trigger('add', model, this, options);
      }

      // Trigger `sort` if the collection was sorted.
      if (doSort) this.trigger('sort', this, options);

      return this;
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({
        at: this.length
      }, options));
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({
        at: 0
      }, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function(begin, end) {
      return this.models.slice(begin, end);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      this._idAttr || (this._idAttr = this.model.prototype.idAttribute);
      return this._byId[obj.id || obj.cid || obj[this._idAttr] || obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of `filter`.
    where: function(attrs) {
      if (_.isEmpty(attrs)) return [];
      return this.filter(function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) {
        throw new Error('Cannot sort a set without a comparator');
      }
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Smartly update a collection with a change set of models, adding,
    // removing, and merging as necessary.
    update: function(models, options) {
      options = _.extend({
        add: true,
        merge: true,
        remove: true
      }, options);
      if (options.parse) models = this.parse(models, options);
      var model, i, l, existing;
      var add = [],
        remove = [],
        modelMap = {};

      // Allow a single model (or no argument) to be passed.
      if (!_.isArray(models)) models = models ? [models] : [];

      // Proxy to `add` for this case, no need to iterate...
      if (options.add && !options.remove) return this.add(models, options);

      // Determine which models to add and merge, and which to remove.
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i];
        existing = this.get(model);
        if (options.remove && existing) modelMap[existing.cid] = true;
        if ((options.add && !existing) || (options.merge && existing)) {
          add.push(model);
        }
      }
      if (options.remove) {
        for (i = 0, l = this.models.length; i < l; i++) {
          model = this.models[i];
          if (!modelMap[model.cid]) remove.push(model);
        }
      }

      // Remove models (if applicable) before we add and merge the rest.
      if (remove.length) this.remove(remove, options);
      if (add.length) this.add(add, options);
      return this;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      options || (options = {});
      if (options.parse) models = this.parse(models, options);
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      if (models) this.add(models, _.extend({
        silent: true
      }, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      options.success = function(collection, resp, options) {
        var method = options.update ? 'update' : 'reset';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
      };
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp, options) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) return false;
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl', 'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortedIndex', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest', 'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
          return model.get(value);
        };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
      options || (options = {});
      if (options.routes) this.routes = options.routes;
      this._bindRoutes();
      this.initialize.apply(this, arguments);
    };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam = /(\(\?)?:\w+/g;
  var splatParam = /\*\w+/g;
  var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function() {},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam, function(match, optional) {
        return optional ? match : '([^\/]+)';
      }).replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  var History = Backbone.History = function() {
      this.handlers = [];
      _.bindAll(this, 'checkUrl');

      // Ensure that `History` can be used outside of the browser.
      if (typeof window !== 'undefined') {
        this.location = window.location;
        this.history = window.history;
      }
    };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options = _.extend({}, {
        root: '/'
      }, this.options, options);
      this.root = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState = !! this.options.pushState;
      this._hasPushState = !! (this.options.pushState && this.history && this.history.pushState);
      var fragment = this.getFragment();
      var docMode = document.documentMode;
      var oldIE = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({
        route: route,
        callback: callback
      });
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {
        trigger: options
      };
      fragment = this.getFragment(fragment || '');
      if (this.fragment === fragment) return;
      this.fragment = fragment;
      var url = this.root + fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

        // If hash changes haven't been explicitly disabled, update the hash
        // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if (!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

        // If you've told us that you explicitly don't want fallback hashchange-
        // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
      this.cid = _.uniqueId('view');
      this._configure(options || {});
      this._ensureElement();
      this.initialize.apply(this, arguments);
      this.delegateEvents();
    };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function() {},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Method "' + events[key] + '" does not exist');
        var match = key.match(delegateEventSplitter);
        var eventName = match[1],
          selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      _.extend(this, _.pick(options, viewOptions));
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch': 'PATCH',
    'delete': 'DELETE',
    'read': 'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {
      type: type,
      dataType: 'json'
    };

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {
        model: params.data
      } : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    var success = options.success;
    options.success = function(resp) {
      if (success) success(model, resp, options);
      model.trigger('sync', model, resp, options);
    };

    var error = options.error;
    options.error = function(xhr) {
      if (error) error(model, xhr, options);
      model.trigger('error', model, xhr, options);
    };

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
      var parent = this;
      var child;

      // The constructor function for the new subclass is either defined by you
      // (the "constructor" property in your `extend` definition), or defaulted
      // by us to simply call the parent's constructor.
      if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
      } else {
        child = function() {
          return parent.apply(this, arguments);
        };
      }

      // Add static properties to the constructor function, if supplied.
      _.extend(child, parent, staticProps);

      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      var Surrogate = function() {
          this.constructor = child;
        };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate;

      // Add prototype properties (instance properties) to the subclass,
      // if supplied.
      if (protoProps) _.extend(child.prototype, protoProps);

      // Set a convenience property in case the parent's prototype is needed
      // later.
      child.__super__ = parent.prototype;

      return child;
    };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };

}).call(this);

Backbone = this.Backbone;
// Copyright 2013 jQuery Foundation and other contributors
// http://jquery.com/

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {

  // Used for splitting on whitespace
  var core_rnotwhite = /\S+/g,

    // String to Object options format cache
    optionsCache = {},
    class2type = {},
    core_toString = class2type.toString,
    core_hasOwn = class2type.hasOwnProperty;

  var jQuery = {

    each: function(array, callback) {
      _.each(array, function (result, index) { callback(index, result); });
    },

    isFunction: _.isFunction,

    isArray: _.isArray,

    // isPlainObject: function (object) { return _.isObject(object); },

    isPlainObject: function( obj ) {

      // Not plain objects:
      // - Any object or value whose internal [[Class]] property is not "[object Object]"
      // - DOM nodes
      // - window
      if ( jQuery.type( obj ) !== "object" || obj.nodeType ) {
        return false;
      }

      // Support: Firefox >16
      // The try/catch supresses exceptions thrown when attempting to access
      // the "constructor" property of certain host objects, ie. |window.location|
      try {
        if ( obj.constructor &&
            !core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
          return false;
        }
      } catch ( e ) {
        console.warn('error', e);
        return false;
      }

      // If the function hasn't returned already, we're confident that
      // |obj| is a plain object, created by {} or constructed with new Object
      return true;
    },

    type: function( obj ) {
      if ( obj === null ) {
        return String( obj );
      }
      return typeof obj === "object" || typeof obj === "function" ?
        class2type[ core_toString.call(obj) ] || "object" :
        typeof obj;
    }

  };


// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
  class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// Convert String-formatted options into Object-formatted ones and store in cache
var createOptions = function(options) {
  var object = optionsCache[ options ] = {};
  jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
    object[ flag ] = true;
  });
  return object;
}

jQuery.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {

          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];

          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

/*
 * Create a callback list using the following parameters:
 *
 *  options: an optional list of space-separated options that will change how
 *      the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *  once:     will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:     will keep track of previous values and will call any callback added
 *          after the list has been fired right away with the latest "memorized"
 *          values (like a Deferred)
 *
 *  unique:     will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:  interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

  // Convert options from String-formatted to Object-formatted if needed
  // (we check in cache first)
  options = typeof options === "string" ?
    ( optionsCache[ options ] || createOptions( options ) ) :
    jQuery.extend( {}, options );

  var // Last fire value (for non-forgettable lists)
    memory,
    // Flag to know if list was already fired
    fired,
    // Flag to know if list is currently firing
    firing,
    // First callback to fire (used internally by add and fireWith)
    firingStart,
    // End of the loop when firing
    firingLength,
    // Index of currently firing callback (modified by remove if needed)
    firingIndex,
    // Actual callback list
    list = [],
    // Stack of fire calls for repeatable lists
    stack = !options.once && [],
    // Fire callbacks
    fire = function( data ) {
      memory = options.memory && data;
      fired = true;
      firingIndex = firingStart || 0;
      firingStart = 0;
      firingLength = list.length;
      firing = true;
      for ( ; list && firingIndex < firingLength; firingIndex++ ) {
        if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
          memory = false; // To prevent further calls using add
          break;
        }
      }
      firing = false;
      if ( list ) {
        if ( stack ) {
          if ( stack.length ) {
            fire( stack.shift() );
          }
        } else if ( memory ) {
          list = [];
        } else {
          self.disable();
        }
      }
    },
    // Actual Callbacks object
    self = {
      // Add a callback or a collection of callbacks to the list
      add: function() {
        if ( list ) {
          // First, we save the current length
          var start = list.length;
          (function add( args ) {
            jQuery.each( args, function( _, arg ) {
              var type = jQuery.type( arg );
              if ( type === "function" ) {
                if ( !options.unique || !self.has( arg ) ) {
                  list.push( arg );
                }
              } else if ( arg && arg.length && type !== "string" ) {
                // Inspect recursively
                add( arg );
              }
            });
          })( arguments );
          // Do we need to add the callbacks to the
          // current firing batch?
          if ( firing ) {
            firingLength = list.length;
          // With memory, if we're not firing then
          // we should call right away
          } else if ( memory ) {
            firingStart = start;
            fire( memory );
          }
        }
        return this;
      },
      // Remove a callback from the list
      remove: function() {
        if ( list ) {
          jQuery.each( arguments, function( _, arg ) {
            var index;
            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
              list.splice( index, 1 );
              // Handle firing indexes
              if ( firing ) {
                if ( index <= firingLength ) {
                  firingLength--;
                }
                if ( index <= firingIndex ) {
                  firingIndex--;
                }
              }
            }
          });
        }
        return this;
      },
      // Control if a given callback is in the list
      has: function( fn ) {
        return jQuery.inArray( fn, list ) > -1;
      },
      // Remove all callbacks from the list
      empty: function() {
        list = [];
        return this;
      },
      // Have the list do nothing anymore
      disable: function() {
        list = stack = memory = undefined;
        return this;
      },
      // Is it disabled?
      disabled: function() {
        return !list;
      },
      // Lock the list in its current state
      lock: function() {
        stack = undefined;
        if ( !memory ) {
          self.disable();
        }
        return this;
      },
      // Is it locked?
      locked: function() {
        return !stack;
      },
      // Call all callbacks with the given context and arguments
      fireWith: function( context, args ) {
        args = args || [];
        args = [ context, args.slice ? args.slice() : args ];
        if ( list && ( !fired || stack ) ) {
          if ( firing ) {
            stack.push( args );
          } else {
            fire( args );
          }
        }
        return this;
      },
      // Call all the callbacks with the given arguments
      fire: function() {
        self.fireWith( this, arguments );
        return this;
      },
      // To know if the callbacks have already been called at least once
      fired: function() {
        return !!fired;
      }
    };

  return self;
};

jQuery.extend({

  Deferred: function( func ) {
    var tuples = [
        // action, add listener, listener list, final state
        [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
        [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
        [ "notify", "progress", jQuery.Callbacks("memory") ]
      ],
      state = "pending",
      promise = {
        state: function() {
          return state;
        },
        always: function() {
          deferred.done( arguments ).fail( arguments );
          return this;
        },
        then: function( /* fnDone, fnFail, fnProgress */ ) {
          var fns = arguments;
          return jQuery.Deferred(function( newDefer ) {
            jQuery.each( tuples, function( i, tuple ) {
              var action = tuple[ 0 ],
                fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
              // deferred[ done | fail | progress ] for forwarding actions to newDefer
              deferred[ tuple[1] ](function() {
                var returned = fn && fn.apply( this, arguments );
                if ( returned && jQuery.isFunction( returned.promise ) ) {
                  returned.promise()
                    .done( newDefer.resolve )
                    .fail( newDefer.reject )
                    .progress( newDefer.notify );
                } else {
                  newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                }
              });
            });
            fns = null;
          }).promise();
        },
        // Get a promise for this deferred
        // If obj is provided, the promise aspect is added to the object
        promise: function( obj ) {
          return obj != null ? jQuery.extend( obj, promise ) : promise;
        }
      },
      deferred = {};

    // Keep pipe for back-compat
    promise.pipe = promise.then;

    // Add list-specific methods
    jQuery.each( tuples, function( i, tuple ) {
      var list = tuple[ 2 ],
        stateString = tuple[ 3 ];

      // promise[ done | fail | progress ] = list.add
      promise[ tuple[1] ] = list.add;

      // Handle state
      if ( stateString ) {
        list.add(function() {
          // state = [ resolved | rejected ]
          state = stateString;

        // [ reject_list | resolve_list ].disable; progress_list.lock
        }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
      }

      // deferred[ resolve | reject | notify ]
      deferred[ tuple[0] ] = function() {
        deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
        return this;
      };
      deferred[ tuple[0] + "With" ] = list.fireWith;
    });

    // Make the deferred a promise
    promise.promise( deferred );

    // Call given func if any
    if ( func ) {
      func.call( deferred, deferred );
    }

    // All done!
    return deferred;
  },

  // Deferred helper
  when: function( subordinate /* , ..., subordinateN */ ) {
    var i = 0,
      resolveValues = core_slice.call( arguments ),
      length = resolveValues.length,

      // the count of uncompleted subordinates
      remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

      // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
      deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

      // Update function for both resolve and progress values
      updateFunc = function( i, contexts, values ) {
        return function( value ) {
          contexts[ i ] = this;
          values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
          if( values === progressValues ) {
            deferred.notifyWith( contexts, values );
          } else if ( !( --remaining ) ) {
            deferred.resolveWith( contexts, values );
          }
        };
      },

      progressValues, progressContexts, resolveContexts;

    // add listeners to Deferred subordinates; treat others as resolved
    if ( length > 1 ) {
      progressValues = new Array( length );
      progressContexts = new Array( length );
      resolveContexts = new Array( length );
      for ( ; i < length; i++ ) {
        if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
          resolveValues[ i ].promise()
            .done( updateFunc( i, resolveContexts, resolveValues ) )
            .fail( deferred.reject )
            .progress( updateFunc( i, progressContexts, progressValues ) );
        } else {
          --remaining;
        }
      }
    }

    // if we're not waiting on anything, resolve the master
    if ( !remaining ) {
      deferred.resolveWith( resolveContexts, resolveValues );
    }

    return deferred.promise();
  }

});

  this.jQuery = jQuery;

}).call(this);

// Export globally
jQuery = this.jQuery;


// Copyright 2013 jQuery Foundation and other contributors
// http://jquery.com/

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {

var r20 = /%20/g,
  rbracket = /\[\]$/,
  rCRLF = /\r?\n/g,
  rsubmitterTypes = /^(?:submit|button|image|reset)$/i,
  rsubmittable = /^(?:input|select|textarea|keygen)/i;

// jQuery.fn.extend({
//   serialize: function() {
//     return jQuery.param( this.serializeArray() );
//   },
//   serializeArray: function() {
//     return this.map(function(){
//       // Can add propHook for "elements" to filter or add form elements
//       var elements = jQuery.prop( this, "elements" );
//       return elements ? jQuery.makeArray( elements ) : this;
//     })
//     .filter(function(){
//       var type = this.type;
//       // Use .is(":disabled") so that fieldset[disabled] works
//       return this.name && !jQuery( this ).is( ":disabled" ) &&
//         rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
//         ( this.checked || !manipulation_rcheckableType.test( type ) );
//     })
//     .map(function( i, elem ){
//       var val = jQuery( this ).val();

//       return val == null ?
//         null :
//         jQuery.isArray( val ) ?
//           jQuery.map( val, function( val ){
//             return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
//           }) :
//           { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
//     }).get();
//   }
// });

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
  var prefix,
    s = [],
    add = function( key, value ) {
      // If value is a function, invoke it and return its value
      value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
      s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
    };

  // Set traditional to true for jQuery <= 1.3.2 behavior.
  if ( traditional === undefined ) {
    traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
  }

  // If an array was passed in, assume that it is an array of form elements.
  if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
    // Serialize the form elements
    jQuery.each( a, function() {
      add( this.name, this.value );
    });

  } else {
    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for ( prefix in a ) {
      buildParams( prefix, a[ prefix ], traditional, add );
    }
  }

  // Return the resulting serialization
  return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
  var name;

  if ( jQuery.isArray( obj ) ) {
    // Serialize array item.
    jQuery.each( obj, function( i, v ) {
      if ( traditional || rbracket.test( prefix ) ) {
        // Treat each array item as a scalar.
        add( prefix, v );

      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
      }
    });

  } else if ( !traditional && jQuery.type( obj ) === "object" ) {
    // Serialize object item.
    for ( name in obj ) {
      buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    }

  } else {
    // Serialize scalar item.
    add( prefix, obj );
  }
}

}).call(this);

(function($) {

	var isFormEl = function($el) {
		return _.indexOf(['CHECKBOX', 'INPUT', 'SELECT', 'TEXTAREA'], $el[0].nodeName, true) > -1;
	};

	var isCheckbox = function($el) { return $el.is('input[type=checkbox]'); };

	var isRadio = function($el) { return $el.is('input[type="radio"]'); };

	var isNumber = function($el) { return $el.is('input[type=number]'); };

	var isSelect = function($el) { return $el.is('select'); };

	var isTextarea = function($el) { return $el.is('textarea'); };

	var isInput = function($el) { return $el.is('input'); };

	var isContenteditable = function($el) { return $el.is('[contenteditable="true"]'); };

	var Stickit = Backbone.Stickit = {

		isObservable: function($el) {
			return isFormEl($el) || isContenteditable($el);
		},

		updateEl: function($el, val, config) {

			var selectConfig = config.selectOptions,
					updateMethod = config.updateMethod || 'text';

			if (isRadio($el)) $el.filter('[value="'+val+'"]').prop('checked', true);
			else if (isCheckbox($el)) {
				if ($el.length > 1) {
					// There are multiple checkboxes so we need to go through them and check
					// any that have value attributes that match what's in the array of `val`s.
					val || (val = []);
					_.each($el, function(el) {
						if (_.indexOf(val, $(el).val()) > -1) $(el).prop('checked', true);
						else $(el).prop('checked', false);
					});
				} else {
					if (_.isBoolean(val)) $el.prop('checked', val);
					else $el.prop('checked', val == $el.val());
				}
			} else if (isInput($el) || isTextarea($el)) $el.val(val);
			else if (isContenteditable($el)) $el.html(val);
			else if (isSelect($el)) {
				var optList, list = selectConfig.collection, isMultiple = $el.prop('multiple');

				$el.html('');

				// The `list` configuration is a function that returns the options list or a string
				// which represents the path to the list relative to `window`.
				optList = _.isFunction(list) ? applyViewFn(view, list) : evaluatePath(window, list);

				// Add an empty default option if the current model attribute isn't defined.
				if (val == null)
					$el.append('<option/>').find('option').prop('selected', true).data('stickit_bind_val', val);

				if (_.isArray(optList)) {
					addSelectOptions(optList, $el, selectConfig, val, isMultiple);
				} else {
					// If the optList is an object, then it should be used to define an optgroup. An
					// optgroup object configuration looks like the following:
					//
					//     {
					//       'opt_labels': ['Looney Tunes', 'Three Stooges'],
					//       'Looney Tunes': [{id: 1, name: 'Bugs Bunny'}, {id: 2, name: 'Donald Duck'}],
					//       'Three Stooges': [{id: 3, name : 'moe'}, {id: 4, name : 'larry'}, {id: 5, name : 'curly'}]
					//     }
					//
					_.each(optList.opt_labels, function(label) {
						var $group = $('<optgroup/>').attr('label', label);
						addSelectOptions(optList[label], $group, selectConfig, val, isMultiple);
						$el.append($group);
					});
				}
			} else {
				$el[updateMethod](val);
			}
		},

		// Gets the value from the given element, with the optional hint that the value is html.
		getElVal: function($el, isHTML) {
			var val;
			if (isFormEl($el)) {
				if (isNumber($el)) val = Number($el.val());
				else if (isRadio($el)) val = $el.filter(':checked').val();
				else if (isCheckbox($el)) {
					if ($el.length > 1) {
						val = _.reduce($el, function(memo, el) {
							if ($(el).prop('checked')) memo.push($(el).val());
							return memo;
						}, []);
					} else {
						val = $el.prop('checked');
						// If the checkbox has a value attribute defined, then
						// use that value. Most browsers use "on" as a default.
						var boxval = $el.val();
						if (boxval != 'on' && boxval != null) {
							if (val) val = $el.val();
							else val = null;
						}
					}
				} else if (isSelect($el)) {
					if ($el.prop('multiple')) {
						val = $el.find('option:selected').map(function() {
							return $(this).data('stickit_bind_val');
						}).get();
					} else {
						val = $el.find('option:selected').data('stickit_bind_val');
					}
				}
				else val = $el.val();
			} else {
				if (isHTML) val = $el.html();
				else val = $el.text();
			}
			return val;
		}

	};

	// Backbone.View Mixins
	// --------------------

	_.extend(Backbone.View.prototype, {

		// Collection of model event bindings.
		//   [{model,event,fn}, ...]
		_modelBindings: null,

		// Unbind the model bindings that are referenced in `this._modelBindings`. If
		// the optional `model` parameter is defined, then only delete bindings for
		// the given `model`.
		unstickModel: function(model) {
			_.each(this._modelBindings, _.bind(function(binding, i) {
				if (model && binding.model !== model) return false;
				binding.model.off(binding.event, binding.fn);
				delete this._modelBindings[i];
			}, this));
			this._modelBindings = _.compact(this._modelBindings);
		},

		// Using `this.bindings` configuration or the `optionalBindingsConfig`, binds `this.model`
		// or the `optionalModel` to elements in the view.
		stickit: function(optionalModel, optionalBindingsConfig) {
			var self = this,
				model = optionalModel || this.model,
				bindings = optionalBindingsConfig || this.bindings || {},
				props = ['autofocus', 'autoplay', 'async', 'checked', 'controls', 'defer', 'disabled', 'hidden', 'loop', 'multiple', 'open', 'readonly', 'required', 'scoped', 'selected'];

			this._modelBindings || (this._modelBindings = []);
			this.unstickModel(model);

			// Since `this.events` may be a function or hash, we'll create a stickitEvents
			// property where we can mix in our own set of events. We also need to support
			// multiple calls to `stickit()` in a single Backbone View.
			this._stickitEvents = _(_.result(this, 'events') || {}).extend(this._stickitEvents);

			// Iterate through the selectors in the bindings configuration and configure
			// the various options for each field.
			_.each(_.keys(bindings), function(selector) {
				var $el, options, modelAttr, visibleCb,
					config = bindings[selector] || {},
					bindKey = _.uniqueId();

				// Support ':el' selector - special case selector for the view managed delegate.
				if (selector != ':el') $el = self.$(selector);
				else {
					$el = self.$el;
					selector = '';
				}

				// Fail fast if the selector didn't match an element.
				if (!$el.length) return false;

				// Allow shorthand setting of model attributes - `'selector':'observe'`.
				if (_.isString(config)) config = {observe:config};

				// Keep backward-compatibility for `modelAttr` which was renamed `observe`.
				modelAttr = config.observe || config.modelAttr;

				if (config.updateModel == null) config.updateModel = true;
				if (config.updateView == null) config.updateView = true;

				// Keep backward-compatibility for `format` which was renamed `onGet`.
				if (config.format && !config.onGet) config.onGet = config.format;

				// Create the model set options with a unique `bindKey` so that we
				// can avoid double-binding in the `change:attribute` event handler.
				options = _.extend({bindKey:bindKey}, config.setOptions || {});

				// Setup the attributes configuration - a list that maps an attribute or
				// property `name`, to an `observe`d model attribute, using an optional
				// `onGet` formatter.
				//
				//     [{
				//       name: 'attributeOrPropertyName',
				//       observe: 'modelAttrName'
				//       onGet: function(modelAttrVal, modelAttrName) { ... }
				//     }, ...]
				//
				_.each(config.attributes || [], function(attrConfig) {
					var lastClass = '',
						observed = attrConfig.observe || modelAttr,
						updateAttr = function() {
							var updateType = _.indexOf(props, attrConfig.name, true) > -1 ? 'prop' : 'attr',
								val = getVal(model, observed, attrConfig, self);
							// If it is a class then we need to remove the last value and add the new.
							if (attrConfig.name == 'class') {
								$el.removeClass(lastClass).addClass(val);
								lastClass = val;
							}
							else $el[updateType](attrConfig.name, val);
						};
					// Keep backward-compatibility for `format` which is now `onGet`.
					if (attrConfig.format && !attrConfig.onGet) attrConfig.onGet = attrConfig.format;
					_.each(_.flatten([observed]), function(attr) {
						observeModelEvent(model, self, 'change:' + attr, updateAttr);
					});
					updateAttr();
				});

				// If `visible` is configured, then the view element will be shown/hidden
				// based on the truthiness of the modelattr's value or the result of the
				// given callback. If a `visibleFn` is also supplied, then that callback
				// will be executed to manually handle showing/hiding the view element.
				if (config.visible != null) {
					visibleCb = function() {
						updateVisibleBindEl($el, getVal(model, modelAttr, config, self), modelAttr, config, self);
					};
					observeModelEvent(model, self, 'change:' + modelAttr, visibleCb);
					visibleCb();
					return false;
				}

				if (modelAttr) {
					if (Stickit.isObservable($el)) {
						// Bind events to the element which will update the model with changes.
						_.each(config.eventsOverride || getModelEvents($el), function(type) {
							self._stickitEvents[type+'.stickit '+selector] = function() {
								var val = Stickit.getElVal($el, isContenteditable($el));
								// Don't update the model if false is returned from the `updateModel` configuration.
								if (evaluateBoolean(self, config.updateModel, val, modelAttr))
								setVal(model, modelAttr, val, options, config.onSet, self);
							};
						});
					}

					// Setup a `change:modelAttr` observer to keep the view element in sync.
					// `modelAttr` may be an array of attributes or a single string value.
					_.each(_.flatten([modelAttr]), function(attr) {
						observeModelEvent(model, self, 'change:'+attr, function(model, val, options) {
							if (options == null || options.bindKey != bindKey)
								updateViewBindEl(self, $el, config, getVal(model, modelAttr, config, self), model);
						});
					});

					updateViewBindEl(self, $el, config, getVal(model, modelAttr, config, self), model, true);
				}
			});

			// Have Backbone delegate any newly added events in `_stickitEvents`.
			this.delegateEvents(this._stickitEvents);

			// Wrap remove so that we can remove model events when this view is removed.
			this.remove = _.wrap(this.remove, function(oldRemove) {
				self.unstickModel();
				if (oldRemove) oldRemove.call(self);
			});
		}
	});

	// Helpers
	// -------

	// Evaluates the given `path` (in object/dot-notation) relative to the given `obj`.
	// If the path is null/undefined, then the given `obj` is returned.
	var evaluatePath = function(obj, path) {
		var parts = (path || '').split('.');
		var result = _.reduce(parts, function(memo, i) { return memo[i]; }, obj);
		return result == null ? obj : result;
	};

	// If the given `fn` is a string, then view[fn] is called, otherwise it is a function
	// that should be executed.
	var applyViewFn = function(view, fn) {
		if (fn) return (_.isString(fn) ? view[fn] : fn).apply(view, _.toArray(arguments).slice(2));
	};

	// Given a function, string (view function reference), or a boolean
	// value, returns the truthy result. Any other types evaluate as false.
	var evaluateBoolean = function(view, reference) {
		if (_.isBoolean(reference)) return reference;
		else if (_.isFunction(reference) || _.isString(reference))
			return applyViewFn.apply(this, _.toArray(arguments));
		return false;
	};

	// Setup a model event binding with the given function, and track the
	// event in the view's _modelBindings.
	var observeModelEvent = function(model, view, event, fn) {
		model.on(event, fn, view);
		view._modelBindings.push({model:model, event:event, fn:fn});
	};

	// Prepares the given value and sets it into the model.
	var setVal = function(model, attr, val, options, onSet, context) {
		if (onSet) val = applyViewFn(context, onSet, val, attr);
		model.set(attr, val, options);
	};

	// Returns the given `field`'s value from the `model`, escaping and formatting if necessary.
	// If `field` is an array, then an array of respective values will be returned.
	var getVal = function(model, field, config, context) {
		var val, retrieveVal = function(attr) {
			var retrieved = config.escape ? model.escape(attr) : model.get(attr);
			return _.isUndefined(retrieved) ? '' : retrieved;
		};
		val = _.isArray(field) ? _.map(field, retrieveVal) : retrieveVal(field);
		return config.onGet ? applyViewFn(context, config.onGet, val, field) : val;
	};

	// Returns the list of events needed to bind to the given form element.
	var getModelEvents = function($el) {
		// Binding to `oninput` is off the table since IE9- has buggy to no support, and
		// using feature detection doesn't work because it is hard to sniff in Firefox.
		if (isInput($el) || isTextarea($el) || isContenteditable($el))
			return ['keyup', 'change', 'paste', 'cut'];
		else return ['change'];
	};

	// Updates the given element according to the rules for the `visible` api key.
	var updateVisibleBindEl = function($el, val, attrName, config, context) {
		var visible = config.visible, visibleFn = config.visibleFn, isVisible = !!val;

		// If `visible` is a function then it should return a boolean result to show/hide.
		if (_.isFunction(visible) || _.isString(visible)) isVisible = applyViewFn(context, visible, val, attrName);

		// Either use the custom `visibleFn`, if provided, or execute a standard jQuery show/hide.
		if (visibleFn) applyViewFn(context, visibleFn, $el, isVisible, attrName);
		else {
			if (isVisible) $el.show();
			else $el.hide();
		}
	};

	// Update the value of `$el` in `view` using the given configuration.
	var updateViewBindEl = function(view, $el, config, val, model, isInitializing) {
		var modelAttr = config.observe || config.modelAttr,
			afterUpdate = config.afterUpdate,
			originalVal = Stickit.getElVal($el, (config.updateMethod == 'html' || isContenteditable($el)));

		// Don't update the view if `updateView` returns false.
		if (!evaluateBoolean(view, config.updateView, val)) return;

		Stickit.updateEl($el, val, config);

		// Execute the `afterUpdate` callback from the `bindings` config.
		if (!isInitializing) applyViewFn(view, afterUpdate, $el, val, originalVal);
	};

	var addSelectOptions = function(optList, $el, selectConfig, fieldVal, isMultiple) {
		_.each(optList, function(obj) {
			var option = $('<option/>'), optionVal = obj;

			// If the list contains a null/undefined value, then an empty option should
			// be appended in the list; otherwise, fill the option with text and value.
			if (obj != null) {
				option.text(evaluatePath(obj, selectConfig.labelPath || "label"));
				optionVal = evaluatePath(obj, selectConfig.valuePath || "value");
			} else if ($el.find('option').length && $el.find('option:eq(0)').data('stickit_bind_val') == null) return false;

			// Save the option value so that we can reference it later.
			option.data('stickit_bind_val', optionVal);

			// Determine if this option is selected.
			if (!isMultiple && optionVal != null && fieldVal != null && optionVal == fieldVal || (_.isObject(fieldVal) && _.isEqual(optionVal, fieldVal)))
				option.prop('selected', true);
			else if (isMultiple && _.isArray(fieldVal)) {
				_.each(fieldVal, function(val) {
					if (_.isObject(val)) val = evaluatePath(val, selectConfig.valuePath);
					if (val == optionVal || (_.isObject(val) && _.isEqual(optionVal, val)))
						option.prop('selected', true);
				});
			}

			$el.append(option);
		});
	};

})(Backbone.$);

/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var jade, exports;
jade = exports = {};

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj){
  var buf = []
    , terse = obj.terse;
  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;
  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];
      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else {
        buf.push(key + '="' + exports.escape(val) + '"');
      }
    }
  }
  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

// Generated by CoffeeScript 1.3.3
var StatusCodes, Ti, Titanium, TitaniumActivityIndicator, TitaniumAdView, TitaniumButton, TitaniumButtonBar, TitaniumHTTPClient, TitaniumImageView, TitaniumLabel, TitaniumNamedNodeMap, TitaniumNavigationGroup, TitaniumNodeList, TitaniumPicker, TitaniumPickerColumn, TitaniumPickerRow, TitaniumProgressBar, TitaniumScrollView, TitaniumSearchBar, TitaniumSlider, TitaniumSplitWindow, TitaniumSwitch, TitaniumTab, TitaniumTabGroup, TitaniumTabbedBar, TitaniumTableView, TitaniumTableViewRow, TitaniumTableViewSection, TitaniumTextArea, TitaniumTextField, TitaniumToolbar, TitaniumView, TitaniumWebView, TitaniumWindow, TitaniumXmlAttr, TitaniumXmlDocument, TitaniumXmlNode, libxmljs,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Ti = Titanium = {};

Ti.App = {};

Ti.App.Properties = {
  store: {},
  getString: function(key) {
    return Ti.App.Properties.store[key];
  },
  setString: function(key, value) {
    return Ti.App.Properties.store[key] = value;
  }
};

Ti.Platform = {
  createUUID: function() {
    return 'this-is-a-random-string';
  }
};

libxmljs = require('libxmljs');

TitaniumXmlAttr = (function() {

  function TitaniumXmlAttr(name, value) {
    this.name = name;
    this.value = value;
  }

  return TitaniumXmlAttr;

})();

TitaniumNamedNodeMap = (function() {

  function TitaniumNamedNodeMap(node) {
    this.node = node;
    this.attrs = this.node.attrs();
    this.length = this.attrs.length;
  }

  TitaniumNamedNodeMap.prototype._buildAttr = function(attr) {
    return new TitaniumXmlAttr(attr.name(), attr.value());
  };

  TitaniumNamedNodeMap.prototype.item = function(index) {
    return this._buildAttr(this.attrs[index]);
  };

  TitaniumNamedNodeMap.prototype.getNamedItem = function(name) {
    return this._buildAttr(this.node.attr(name));
  };

  return TitaniumNamedNodeMap;

})();

TitaniumNodeList = (function() {

  function TitaniumNodeList(node) {
    this.node = node;
    this.children = this.node.childNodes();
    this.length = this.children.length;
  }

  TitaniumNodeList.prototype.item = function(index) {
    return new TitaniumXmlNode(this.children[index]);
  };

  return TitaniumNodeList;

})();

TitaniumXmlNode = (function() {

  function TitaniumXmlNode(node) {
    var prefix, _ref, _ref1;
    this.node = node;
    this.TEXT_NODE = 3;
    this.ELEMENT_NODE = 1;
    this.nodeType = (function() {
      switch (this.node.type()) {
        case 'text':
          return this.TEXT_NODE;
        case 'element':
          return this.ELEMENT_NODE;
      }
    }).call(this);
    if (this.nodeType === this.TEXT_NODE) {
      this.nodeValue = this.node.text();
    } else {
      this.nodeName = this.node.name();
      if (prefix = (_ref = this.node.namespace()) != null ? _ref.prefix() : void 0) {
        this.nodeName = [prefix, this.nodeName].join(':');
      }
      if (((_ref1 = this.node.child(0)) != null ? _ref1.type() : void 0) === 'text') {
        this.textContent = this.node.child(0).text();
      }
      this.attributes = new TitaniumNamedNodeMap(this.node);
      this.childNodes = new TitaniumNodeList(this.node);
    }
  }

  return TitaniumXmlNode;

})();

TitaniumXmlDocument = (function() {

  function TitaniumXmlDocument(xml) {
    var xmlDoc;
    xmlDoc = libxmljs.parseXml(xml);
    this.childNodes = new TitaniumNodeList(xmlDoc.root());
  }

  return TitaniumXmlDocument;

})();

Ti.XML = {
  parseString: function(xml) {
    return new TitaniumXmlDocument(xml);
  }
};

Ti.UI = {
  createWindow: function(attributes) {
    return console.log('Create window');
  },
  SIZE: 'TI:UI:SIZE',
  FILL: 'TI:UI:FILL',
  iOS: {},
  iPad: {}
};

Ti.UI.iPhone = {
  TableViewCellSelectionStyle: 'table-view-cell-selection-style',
  SystemButtonStyle: {
    DONE: 'done'
  }
};

TitaniumView = (function() {

  TitaniumView.prototype.tiClassName = 'TiUIView';

  TitaniumView.prototype.bubbleParent = true;

  function TitaniumView(attributes) {
    this.add = __bind(this.add, this);

    var name, value;
    for (name in attributes) {
      value = attributes[name];
      this[name] = value;
    }
    this.children = [];
    this.hidden = false;
  }

  TitaniumView.prototype.applyProperties = function(properties) {
    var key, value, _results;
    _results = [];
    for (key in properties) {
      value = properties[key];
      _results.push(this[key] = value);
    }
    return _results;
  };

  TitaniumView.prototype.addEventListener = function(name, event) {
    return this.on(name, event);
  };

  TitaniumView.prototype.removeEventListener = function(name, event) {
    return this.off(name, event);
  };

  TitaniumView.prototype.fireEvent = function(name, event) {
    var _ref;
    event = _({}).extend({
      source: this
    }, event || {});
    this.trigger(name, event);
    if (this.bubbleParent) {
      return (_ref = this.parent) != null ? _ref.fireEvent(name, event) : void 0;
    }
  };

  TitaniumView.prototype.add = function(view) {
    view.parent = this;
    return this.children.push(view);
  };

  TitaniumView.prototype.remove = function(view) {
    return this.children = _.without(this.children, view);
  };

  TitaniumView.prototype.getChildren = function() {
    return this.children;
  };

  TitaniumView.prototype.getParent = function() {
    return this.parent;
  };

  TitaniumView.prototype.hide = function() {
    return this.hidden = true;
  };

  TitaniumView.prototype.show = function() {
    return this.hidden = false;
  };

  TitaniumView.prototype.toString = function() {
    return "[object " + this.tiClassName + "]";
  };

  return TitaniumView;

})();

Ti.UI.createView = function(attributes) {
  return new TitaniumView(attributes);
};

_.extend(TitaniumView.prototype, Backbone.Events);

TitaniumActivityIndicator = (function(_super) {

  __extends(TitaniumActivityIndicator, _super);

  function TitaniumActivityIndicator() {
    return TitaniumActivityIndicator.__super__.constructor.apply(this, arguments);
  }

  TitaniumActivityIndicator.prototype.tiClassName = 'TiUIActivityIndicator';

  return TitaniumActivityIndicator;

})(TitaniumView);

Ti.UI.createActivityIndicator = function(attributes) {
  return new TitaniumActivityIndicator(attributes);
};

TitaniumButton = (function(_super) {

  __extends(TitaniumButton, _super);

  function TitaniumButton() {
    return TitaniumButton.__super__.constructor.apply(this, arguments);
  }

  TitaniumButton.prototype.tiClassName = 'TiUIButton';

  return TitaniumButton;

})(TitaniumView);

Ti.UI.createButton = function(attributes) {
  return new TitaniumButton(attributes);
};

TitaniumButtonBar = (function(_super) {

  __extends(TitaniumButtonBar, _super);

  function TitaniumButtonBar() {
    return TitaniumButtonBar.__super__.constructor.apply(this, arguments);
  }

  return TitaniumButtonBar;

})(TitaniumView);

Ti.UI.createButtonBar = function(attributes) {
  return new TitaniumButtonBar(attributes);
};

TitaniumImageView = (function(_super) {

  __extends(TitaniumImageView, _super);

  function TitaniumImageView() {
    return TitaniumImageView.__super__.constructor.apply(this, arguments);
  }

  TitaniumImageView.prototype.tiClassName = 'TiUIImageView';

  return TitaniumImageView;

})(TitaniumView);

Ti.UI.createImageView = function(attributes) {
  return new TitaniumImageView(attributes);
};

TitaniumLabel = (function(_super) {

  __extends(TitaniumLabel, _super);

  function TitaniumLabel() {
    return TitaniumLabel.__super__.constructor.apply(this, arguments);
  }

  TitaniumLabel.prototype.tiClassName = 'TiUILabel';

  return TitaniumLabel;

})(TitaniumView);

Ti.UI.createLabel = function(attributes) {
  return new TitaniumLabel(attributes);
};

TitaniumPicker = (function(_super) {

  __extends(TitaniumPicker, _super);

  function TitaniumPicker() {
    this.columns = [];
    TitaniumPicker.__super__.constructor.apply(this, arguments);
  }

  TitaniumPicker.prototype.tiClassName = 'TiUIPicker';

  TitaniumPicker.prototype.add = function(view) {
    var column, _ref;
    if (view._viewName === 'PickerRow') {
      if (!(column = (_ref = this.columns) != null ? _ref[0] : void 0)) {
        column = Ti.UI.createPickerColumn();
        this.columns.push(column);
      }
      return column.addRow(view);
    } else {
      view.parent = this;
      return this.columns.push(view);
    }
  };

  TitaniumPicker.prototype.setColumns = function(columns) {
    this.columns = columns;
  };

  return TitaniumPicker;

})(TitaniumView);

TitaniumPickerColumn = (function(_super) {

  __extends(TitaniumPickerColumn, _super);

  function TitaniumPickerColumn() {
    this.rows = [];
    TitaniumPickerColumn.__super__.constructor.apply(this, arguments);
  }

  TitaniumPickerColumn.prototype.tiClassName = 'TiUIPickerColumn';

  TitaniumPickerColumn.prototype.add = function(view) {
    throw new Error('Rows can not be added to picker columns via `add`');
  };

  TitaniumPickerColumn.prototype.addRow = function(row) {
    row.parent = this;
    return this.rows.push(row);
  };

  TitaniumPickerColumn.prototype.removeRow = function(row) {
    return this.rows = _.without(this.rows, row);
  };

  TitaniumPickerColumn.prototype.appendSection = function(section) {
    section.parent = this;
    return this.sections.push(section);
  };

  TitaniumPickerColumn.prototype.deleteSection = function(index) {
    return this.sections = _.without(this.sections, this.sections[index]);
  };

  return TitaniumPickerColumn;

})(TitaniumView);

TitaniumPickerRow = (function(_super) {

  __extends(TitaniumPickerRow, _super);

  function TitaniumPickerRow() {
    return TitaniumPickerRow.__super__.constructor.apply(this, arguments);
  }

  TitaniumPickerRow.prototype.tiClassName = 'TiUIPickerRow';

  return TitaniumPickerRow;

})(TitaniumView);

Ti.UI.createPicker = function(attributes) {
  return new TitaniumPicker(attributes);
};

Ti.UI.createPickerColumn = function(attributes) {
  return new TitaniumPickerColumn(attributes);
};

Ti.UI.createPickerRow = function(attributes) {
  return new TitaniumPickerRow(attributes);
};

TitaniumProgressBar = (function(_super) {

  __extends(TitaniumProgressBar, _super);

  function TitaniumProgressBar() {
    return TitaniumProgressBar.__super__.constructor.apply(this, arguments);
  }

  TitaniumProgressBar.prototype.tiClassName = 'TiUIProgressBar';

  return TitaniumProgressBar;

})(TitaniumView);

Ti.UI.createProgressBar = function(attributes) {
  return new TitaniumProgressBar(attributes);
};

TitaniumScrollView = (function(_super) {

  __extends(TitaniumScrollView, _super);

  function TitaniumScrollView() {
    return TitaniumScrollView.__super__.constructor.apply(this, arguments);
  }

  TitaniumScrollView.prototype.tiClassName = 'TiUIScrollView';

  return TitaniumScrollView;

})(TitaniumView);

Ti.UI.createScrollView = function(attributes) {
  return new TitaniumScrollView(attributes);
};

TitaniumSearchBar = (function(_super) {

  __extends(TitaniumSearchBar, _super);

  function TitaniumSearchBar() {
    return TitaniumSearchBar.__super__.constructor.apply(this, arguments);
  }

  TitaniumSearchBar.prototype.tiClassName = 'TiUISearchBar';

  TitaniumSearchBar.prototype.setValue = function(value) {
    this.value = value;
    return this.fireEvent('change', {
      value: this.value
    });
  };

  TitaniumSearchBar.prototype.getValue = function() {
    return this.value;
  };

  return TitaniumSearchBar;

})(TitaniumView);

Ti.UI.createSearchBar = function(attributes) {
  return new TitaniumSearchBar(attributes);
};

TitaniumSlider = (function(_super) {

  __extends(TitaniumSlider, _super);

  function TitaniumSlider() {
    return TitaniumSlider.__super__.constructor.apply(this, arguments);
  }

  TitaniumSlider.prototype.tiClassName = 'TiUISlider';

  TitaniumSlider.prototype.setValue = function(value) {
    this.value = value;
    return this.fireEvent('change', {
      value: this.value
    });
  };

  TitaniumSlider.prototype.getValue = function() {
    return this.value;
  };

  return TitaniumSlider;

})(TitaniumView);

Ti.UI.createSlider = function(attributes) {
  return new TitaniumSlider(attributes);
};

TitaniumSwitch = (function(_super) {

  __extends(TitaniumSwitch, _super);

  function TitaniumSwitch() {
    return TitaniumSwitch.__super__.constructor.apply(this, arguments);
  }

  TitaniumSwitch.prototype.tiClassName = 'TiUISwitch';

  TitaniumSwitch.prototype.setValue = function(value) {
    this.value = value;
    return this.fireEvent('change', {
      value: this.value
    });
  };

  TitaniumSwitch.prototype.getValue = function() {
    return this.value;
  };

  return TitaniumSwitch;

})(TitaniumView);

Ti.UI.createSwitch = function(attributes) {
  return new TitaniumSwitch(attributes);
};

TitaniumTabbedBar = (function(_super) {

  __extends(TitaniumTabbedBar, _super);

  function TitaniumTabbedBar() {
    return TitaniumTabbedBar.__super__.constructor.apply(this, arguments);
  }

  TitaniumTabbedBar.prototype.tiClassName = 'TiUITabbedBar';

  return TitaniumTabbedBar;

})(TitaniumView);

Ti.UI.createTabbedBar = function(attributes) {
  return new TitaniumTabbedBar(attributes);
};

Ti.UI.iOS.createTabbedBar = function(attributes) {
  return new TitaniumTabbedBar(attributes);
};

TitaniumTabGroup = (function(_super) {

  __extends(TitaniumTabGroup, _super);

  TitaniumTabGroup.prototype.tiClassName = 'TiUITabGroup';

  function TitaniumTabGroup() {
    this.tabs = [];
    TitaniumTabGroup.__super__.constructor.apply(this, arguments);
  }

  TitaniumTabGroup.prototype.addTab = function(tab) {
    tab.parent = this;
    return this.tabs.push(tab);
  };

  TitaniumTabGroup.prototype.getTabs = function() {
    return this.tabs;
  };

  TitaniumTabGroup.prototype.removeTab = function(tab) {
    return this.tabs = _.without(this.tabs, tab);
  };

  TitaniumTabGroup.prototype.open = function() {};

  return TitaniumTabGroup;

})(TitaniumView);

TitaniumTab = (function(_super) {

  __extends(TitaniumTab, _super);

  function TitaniumTab() {
    return TitaniumTab.__super__.constructor.apply(this, arguments);
  }

  TitaniumTab.prototype.tiClassName = 'TiUITab';

  return TitaniumTab;

})(TitaniumView);

Ti.UI.createTabGroup = function(attributes) {
  return new TitaniumTabGroup(attributes);
};

Ti.UI.createTab = function(attributes) {
  return new TitaniumTab(attributes);
};

TitaniumTableView = (function(_super) {

  __extends(TitaniumTableView, _super);

  function TitaniumTableView() {
    this.data = [];
    this.sections = [];
    TitaniumTableView.__super__.constructor.apply(this, arguments);
  }

  TitaniumTableView.prototype.tiClassName = 'TiUITableView';

  TitaniumTableView.prototype.add = function(view) {
    throw new Error('Rows can not be added to tables via `add`');
  };

  TitaniumTableView.prototype.appendRow = function(row) {
    var defaultSection;
    if (!this.data.length) {
      defaultSection = new TitaniumTableViewSection;
      defaultSection.parent = this;
      this.data.push(defaultSection);
      this.sections.push(defaultSection);
    }
    return this.data[0].add(row);
  };

  TitaniumTableView.prototype.deleteRow = function(indexOrRow) {
    var _ref;
    if (_.isNumber(indexOrRow)) {

    } else {
      return (_ref = this.data[0]) != null ? _ref._remove(indexOrRow) : void 0;
    }
  };

  TitaniumTableView.prototype.appendSection = function(section) {
    section.parent = this;
    this.data.push(section);
    return this.sections.push(section);
  };

  TitaniumTableView.prototype.deleteSection = function(indexOrSection) {
    var section;
    section = _.isNumber(indexOrSection) ? this.sections[indexOrSection] : indexOrSection;
    this.data = _.without(this.data, section);
    return this.sections = _.without(this.sections, section);
  };

  return TitaniumTableView;

})(TitaniumView);

TitaniumTableViewRow = (function(_super) {

  __extends(TitaniumTableViewRow, _super);

  function TitaniumTableViewRow() {
    return TitaniumTableViewRow.__super__.constructor.apply(this, arguments);
  }

  TitaniumTableViewRow.prototype.tiClassName = 'TiUITableViewRow';

  return TitaniumTableViewRow;

})(TitaniumView);

TitaniumTableViewSection = (function(_super) {

  __extends(TitaniumTableViewSection, _super);

  TitaniumTableViewSection.prototype.tiClassName = 'TiUITableViewSection';

  function TitaniumTableViewSection() {
    this.rows = [];
    TitaniumTableViewSection.__super__.constructor.apply(this, arguments);
  }

  TitaniumTableViewSection.prototype.add = function(row) {
    row.parent = this;
    row._section = this;
    return this.rows.push(row);
  };

  TitaniumTableViewSection.prototype._remove = function(row) {
    return this.rows = _.without(this.rows, row);
  };

  return TitaniumTableViewSection;

})(TitaniumView);

Ti.UI.createTableView = function(attributes) {
  return new TitaniumTableView(attributes);
};

Ti.UI.createTableViewRow = function(attributes) {
  return new TitaniumTableViewRow(attributes);
};

Ti.UI.createTableViewSection = function(attributes) {
  return new TitaniumTableViewSection(attributes);
};

TitaniumTextArea = (function(_super) {

  __extends(TitaniumTextArea, _super);

  function TitaniumTextArea() {
    return TitaniumTextArea.__super__.constructor.apply(this, arguments);
  }

  TitaniumTextArea.prototype.tiClassName = 'TiUITextArea';

  TitaniumTextArea.prototype.setValue = function(value) {
    this.value = value;
    return this.fireEvent('change', {
      value: this.value
    });
  };

  TitaniumTextArea.prototype.getValue = function() {
    return this.value;
  };

  return TitaniumTextArea;

})(TitaniumView);

Ti.UI.createTextArea = function(attributes) {
  return new TitaniumTextArea(attributes);
};

TitaniumTextField = (function(_super) {

  __extends(TitaniumTextField, _super);

  function TitaniumTextField() {
    return TitaniumTextField.__super__.constructor.apply(this, arguments);
  }

  TitaniumTextField.prototype.tiClassName = 'TiUITextField';

  TitaniumTextField.prototype.setValue = function(value) {
    this.value = value;
    return this.fireEvent('change', {
      value: this.value
    });
  };

  TitaniumTextField.prototype.getValue = function() {
    return this.value;
  };

  return TitaniumTextField;

})(TitaniumView);

Ti.UI.createTextField = function(attributes) {
  return new TitaniumTextField(attributes);
};

TitaniumToolbar = (function(_super) {

  __extends(TitaniumToolbar, _super);

  function TitaniumToolbar() {
    return TitaniumToolbar.__super__.constructor.apply(this, arguments);
  }

  TitaniumToolbar.prototype.tiClassName = 'TiUIToolbar';

  return TitaniumToolbar;

})(TitaniumView);

Ti.UI.createToolbar = function(attributes) {
  return new TitaniumToolbar(attributes);
};

Ti.UI.iOS.createToolbar = function(attributes) {
  return new TitaniumToolbar(attributes);
};

TitaniumWebView = (function(_super) {

  __extends(TitaniumWebView, _super);

  function TitaniumWebView() {
    return TitaniumWebView.__super__.constructor.apply(this, arguments);
  }

  TitaniumWebView.prototype.tiClassName = 'TiUIWebView';

  return TitaniumWebView;

})(TitaniumView);

Ti.UI.createWebView = function(attributes) {
  return new TitaniumWebView(attributes);
};

TitaniumWindow = (function(_super) {

  __extends(TitaniumWindow, _super);

  function TitaniumWindow() {
    return TitaniumWindow.__super__.constructor.apply(this, arguments);
  }

  TitaniumWindow.prototype.tiClassName = 'TiUIWindow';

  TitaniumWindow.prototype.bubbleParent = false;

  TitaniumWindow.prototype.open = function() {
    return this.trigger('open');
  };

  TitaniumWindow.prototype.close = function() {
    return this.trigger('close');
  };

  return TitaniumWindow;

})(TitaniumView);

Ti.UI.createWindow = function(attributes) {
  return new TitaniumWindow(attributes);
};

TitaniumNavigationGroup = (function(_super) {

  __extends(TitaniumNavigationGroup, _super);

  function TitaniumNavigationGroup() {
    return TitaniumNavigationGroup.__super__.constructor.apply(this, arguments);
  }

  TitaniumNavigationGroup.prototype.open = function() {
    return this.trigger('open');
  };

  TitaniumNavigationGroup.prototype.close = function() {
    return this.trigger('close');
  };

  return TitaniumNavigationGroup;

})(TitaniumView);

Ti.UI.iPhone.createNavigationGroup = function(attributes) {
  return new TitaniumNavigationGroup(attributes);
};

TitaniumSplitWindow = (function(_super) {

  __extends(TitaniumSplitWindow, _super);

  function TitaniumSplitWindow() {
    return TitaniumSplitWindow.__super__.constructor.apply(this, arguments);
  }

  return TitaniumSplitWindow;

})(TitaniumView);

Ti.UI.iPad.createSplitWindow = function(attributes) {
  return new TitaniumSplitWindow(attributes);
};

TitaniumAdView = (function(_super) {

  __extends(TitaniumAdView, _super);

  function TitaniumAdView() {
    return TitaniumAdView.__super__.constructor.apply(this, arguments);
  }

  return TitaniumAdView;

})(TitaniumView);

Ti.UI.iOS.createAdView = function(attributes) {
  return new TitaniumAdView(attributes);
};

StatusCodes = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported'
};

TitaniumHTTPClient = (function() {

  TitaniumHTTPClient.mock = function(mocks, options) {
    this.mocks = mocks;
    this.options = options != null ? options : {};
  };

  TitaniumHTTPClient.resetCaches = function() {
    this.lastModifiedCache = {};
    return this.etagCache = {};
  };

  TitaniumHTTPClient.resetMock = function() {
    return this.mocks = [];
  };

  function TitaniumHTTPClient(options) {
    this.options = options;
    this.headers = {};
  }

  TitaniumHTTPClient.prototype.open = function(method, url, async) {
    this.method = method;
    this.url = url;
    this.async = async;
  };

  TitaniumHTTPClient.prototype.abort = function() {
    return this.aborted = true;
  };

  TitaniumHTTPClient.prototype.send = function(data) {
    var handleResponse, headers, mock, name, requestHeaders, response, value, wait,
      _this = this;
    this.responseHeaders = {};
    mock = _.find(TitaniumHTTPClient.mocks, function(mock) {
      return mock.method === _this.method && _this.url.match(mock.url);
    });
    requestHeaders = _.clone(this.headers);
    handleResponse = function() {
      var etag, handler, lastModified, timestamp, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      if ((_ref = _this.status) == null) {
        _this.status = 200;
      }
      if (lastModified = requestHeaders['If-Modified-Since']) {
        if (timestamp = ((_ref1 = TitaniumHTTPClient.lastModifiedCache) != null ? _ref1[_this.url] : void 0) || 0) {
          if (lastModified <= timestamp) {
            _this.status = 304;
          }
        }
      }
      if (etag = requestHeaders['If-None-Match']) {
        if (etag === ((_ref2 = TitaniumHTTPClient.etagCache) != null ? _ref2[_this.url] : void 0)) {
          _this.status = 304;
        }
      }
      if ((_ref3 = TitaniumHTTPClient.lastModifiedCache) != null) {
        _ref3[_this.url] = _this.responseHeaders['Last-Modifified'] = Date.now();
      }
      if ((_ref4 = TitaniumHTTPClient.etagCache) != null) {
        _ref4[_this.url] = _this.headers['etag'];
      }
      _this.statusText = StatusCodes[_this.status];
      if (_this.status === 304) {
        _this.responseText = null;
      }
      handler = (_ref5 = _this.status) === 200 || _ref5 === 304 ? 'onload' : 'onerror';
      return (_ref6 = _this.options[handler]) != null ? _ref6.call(_this, {
        source: _this
      }) : void 0;
    };
    if (!mock) {
      this.status = 501;
      handleResponse();
      return;
    }
    response = _.isFunction(mock.response) ? mock.response(data, this) : mock.response;
    _.extend(this, response);
    this.responseHeaders['Content-Type'] = response.contentType || 'text/json';
    if (headers = response.headers) {
      for (name in headers) {
        value = headers[name];
        this.responseHeaders[name] = value;
      }
    }
    if (this.async && (wait = TitaniumHTTPClient.options.wait)) {
      if (this.options.timeout < wait) {
        this.status = 0;
        return this.options.onerror.call(this, {
          source: this
        });
      } else {
        return setTimeout(handleResponse, wait);
      }
    } else {
      return handleResponse();
    }
  };

  TitaniumHTTPClient.prototype.setRequestHeader = function(name, value) {
    return this.headers[name] = value;
  };

  TitaniumHTTPClient.prototype.getResponseHeader = function(name) {
    return this.responseHeaders[name];
  };

  TitaniumHTTPClient.prototype.getResponseHeaders = function() {
    return this.responseHeaders;
  };

  return TitaniumHTTPClient;

})();

Ti.Network = {
  HTTPClient: TitaniumHTTPClient,
  createHTTPClient: function(options) {
    return new TitaniumHTTPClient(options);
  }
};

(function(/*! Stitch !*/) {
  if (!this.stitchRequire) {
    var modules = {}, cache = {}, require = function(name, root) {
      var path = expand(root, name), altPath = expand(path, './index'), module = cache[path], altModule = cache[altPath], fn;
      if (module) {
        return module.exports;
      }
      else if (altModule){
        return altModule.exports
      } else if (fn = modules[path] || modules[path = altPath]) {
        module = {id: path, exports: {}};
        try {
          cache[path] = module;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return module.exports;
        } catch (err) {
          delete cache[path];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.stitchRequire = function(name) {
      return require(name, '');
    }
    this.stitchRequire.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.stitchRequire.define;
}).call(this)({"fixtures/template": function(exports, require, module) {module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'width':('10'), "class": ('testView') }));
buf.push('><Label');
buf.push(attrs({ "class": ('myLabel') }));
buf.push('>');
var __val__ = sampleLabelText
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</Label><View');
buf.push(attrs({ 'height':('10') }));
buf.push('></View></div><div');
buf.push(attrs({ "class": ('otherView') }));
buf.push('><Button');
buf.push(attrs({ 'id':('someButton') }));
buf.push('>Click me!</Button></div><iOS:AdView');
buf.push(attrs({ "class": ('someAdView') }));
buf.push('></iOS:AdView>');
}
return buf.join("");
};}, "collections/github/comments": function(exports, require, module) {(function() {
  var Comment, CommentList,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Comment = require('models/github/comment');

  module.exports = CommentList = (function(_super) {

    __extends(CommentList, _super);

    function CommentList() {
      return CommentList.__super__.constructor.apply(this, arguments);
    }

    CommentList.prototype.model = Comment;

    return CommentList;

  })(Backbone.Collection);

}).call(this);
}, "collections/github/issues": function(exports, require, module) {(function() {
  var Issue, IssueList,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Issue = require('models/github/issue');

  module.exports = IssueList = (function(_super) {

    __extends(IssueList, _super);

    function IssueList() {
      return IssueList.__super__.constructor.apply(this, arguments);
    }

    IssueList.prototype.model = Issue;

    return IssueList;

  })(Backbone.Collection);

}).call(this);
}, "collections/github/repositories": function(exports, require, module) {(function() {
  var Repositories, Repository,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Repository = require('models/github/repository');

  module.exports = Repositories = (function(_super) {

    __extends(Repositories, _super);

    function Repositories() {
      return Repositories.__super__.constructor.apply(this, arguments);
    }

    Repositories.prototype.model = Repository;

    return Repositories;

  })(Backbone.Collection);

}).call(this);
}, "models/github/comment": function(exports, require, module) {(function() {
  var Comment,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Comment = (function(_super) {

    __extends(Comment, _super);

    function Comment() {
      return Comment.__super__.constructor.apply(this, arguments);
    }

    return Comment;

  })(Backbone.Model);

}).call(this);
}, "models/github/issue": function(exports, require, module) {(function() {
  var CommentList, Issue,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CommentList = require('collections/github/comments');

  module.exports = Issue = (function(_super) {

    __extends(Issue, _super);

    function Issue() {
      return Issue.__super__.constructor.apply(this, arguments);
    }

    Issue.prototype.initialize = function() {
      return this.comments = new CommentList;
    };

    Issue.prototype.buildComment = function() {
      var comment;
      comment = new this.comments.model;
      comment.collection = this.comments;
      return comment;
    };

    return Issue;

  })(Backbone.Model);

}).call(this);
}, "models/github/repository": function(exports, require, module) {(function() {
  var Repository,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Repository = (function(_super) {

    __extends(Repository, _super);

    function Repository() {
      return Repository.__super__.constructor.apply(this, arguments);
    }

    return Repository;

  })(Backbone.Model);

}).call(this);
}, "models/github/user": function(exports, require, module) {(function() {
  var IssueList, User, apiRoot,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  IssueList = require('collections/github/issues');

  apiRoot = 'https://api.github.com';

  module.exports = User = (function(_super) {

    __extends(User, _super);

    function User() {
      this.bootstrap = __bind(this.bootstrap, this);
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.url = "" + apiRoot + "/user";

    User.prototype.initialize = function() {
      return this.on('change:id', this.bootstrap);
    };

    User.prototype.bootstrap = function() {
      this.issues = new IssueList;
      this.issues.sync = this.sync;
      return this.issues.url = "" + apiRoot + "/issues";
    };

    User.prototype.validate = function(attrs) {
      if (_.has(attrs, 'username')) {
        if (_.isEmpty(attrs.username)) {
          return "must provide a username";
        }
      }
      if (_.has(attrs, 'password')) {
        if (_.isEmpty(attrs.password)) {
          return "must provide a password";
        }
      }
    };

    return User;

  })(Backbone.Model);

}).call(this);
}, "chaplin": function(exports, require, module) {(function() {

  module.exports = {
    Application: require('chaplin/application'),
    mediator: require('chaplin/mediator'),
    Dispatcher: require('chaplin/dispatcher'),
    Controller: require('chaplin/controllers/controller'),
    Collection: require('chaplin/models/collection'),
    Model: require('chaplin/models/model'),
    Layout: require('chaplin/views/layout'),
    View: require('chaplin/views/view'),
    CollectionView: require('chaplin/views/collection_view'),
    Route: require('chaplin/lib/route'),
    Router: require('chaplin/lib/router'),
    Delayer: require('chaplin/lib/delayer'),
    EventBroker: require('chaplin/lib/event_broker'),
    support: require('chaplin/lib/support'),
    SyncMachine: require('chaplin/lib/sync_machine'),
    utils: require('chaplin/lib/utils')
  };

}).call(this);
}, "chaplin/application": function(exports, require, module) {(function() {
  'use strict';

  var Application, Backbone, Dispatcher, EventBroker, Layout, Router, mediator, _;

  _ = require('underscore');

  Backbone = require('backbone');

  mediator = require('chaplin/mediator');

  Dispatcher = require('chaplin/dispatcher');

  Layout = require('chaplin/views/layout');

  Router = require('chaplin/lib/router');

  EventBroker = require('chaplin/lib/event_broker');

  module.exports = Application = (function() {

    function Application() {}

    Application.extend = Backbone.Model.extend;

    _(Application.prototype).extend(EventBroker);

    Application.prototype.title = '';

    Application.prototype.dispatcher = null;

    Application.prototype.layout = null;

    Application.prototype.router = null;

    Application.prototype.initialize = function() {};

    Application.prototype.initDispatcher = function(options) {
      return this.dispatcher = new Dispatcher(options);
    };

    Application.prototype.initLayout = function(options) {
      var _ref;
      if (options == null) {
        options = {};
      }
      if ((_ref = options.title) == null) {
        options.title = this.title;
      }
      return this.layout = new Layout(options);
    };

    Application.prototype.initRouter = function(routes, options) {
      this.router = new Router(options);
      if (typeof routes === "function") {
        routes(this.router.match);
      }
      return this.router.startHistory();
    };

    Application.prototype.disposed = false;

    Application.prototype.dispose = function() {
      var prop, properties, _i, _len;
      if (this.disposed) {
        return;
      }
      properties = ['dispatcher', 'layout', 'router'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        if (!(this[prop] != null)) {
          continue;
        }
        this[prop].dispose();
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Application;

  })();

}).call(this);
}, "chaplin/controllers/controller": function(exports, require, module) {(function() {
  'use strict';

  var Backbone, Controller, EventBroker, _,
    __hasProp = {}.hasOwnProperty;

  _ = require('underscore');

  Backbone = require('backbone');

  EventBroker = require('chaplin/lib/event_broker');

  module.exports = Controller = (function() {

    Controller.extend = Backbone.Model.extend;

    _(Controller.prototype).extend(Backbone.Events);

    _(Controller.prototype).extend(EventBroker);

    Controller.prototype.view = null;

    Controller.prototype.redirected = false;

    function Controller() {
      this.initialize.apply(this, arguments);
    }

    Controller.prototype.initialize = function() {};

    Controller.prototype.adjustTitle = function(subtitle) {
      return this.publishEvent('!adjustTitle', subtitle);
    };

    Controller.prototype.redirectTo = function(url, options) {
      if (options == null) {
        options = {};
      }
      this.redirected = true;
      return this.publishEvent('!router:route', url, options, function(routed) {
        if (!routed) {
          throw new Error('Controller#redirectTo: no route matched');
        }
      });
    };

    Controller.prototype.redirectToRoute = function(name, params, options) {
      this.redirected = true;
      return this.publishEvent('!router:routeByName', name, params, options, function(routed) {
        if (!routed) {
          throw new Error('Controller#redirectToRoute: no route matched');
        }
      });
    };

    Controller.prototype.disposed = false;

    Controller.prototype.dispose = function() {
      var obj, prop, properties, _i, _len;
      if (this.disposed) {
        return;
      }
      for (prop in this) {
        if (!__hasProp.call(this, prop)) continue;
        obj = this[prop];
        if (obj && typeof obj.dispose === 'function') {
          obj.dispose();
          delete this[prop];
        }
      }
      this.unsubscribeAllEvents();
      properties = ['redirected'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Controller;

  })();

}).call(this);
}, "chaplin/dispatcher": function(exports, require, module) {(function() {
  'use strict';

  var Backbone, Dispatcher, EventBroker, utils, _;

  _ = require('underscore');

  Backbone = require('backbone');

  utils = require('chaplin/lib/utils');

  EventBroker = require('chaplin/lib/event_broker');

  module.exports = Dispatcher = (function() {

    Dispatcher.extend = Backbone.Model.extend;

    _(Dispatcher.prototype).extend(EventBroker);

    Dispatcher.prototype.previousControllerName = null;

    Dispatcher.prototype.currentControllerName = null;

    Dispatcher.prototype.currentController = null;

    Dispatcher.prototype.currentAction = null;

    Dispatcher.prototype.currentParams = null;

    Dispatcher.prototype.url = null;

    function Dispatcher() {
      this.initialize.apply(this, arguments);
    }

    Dispatcher.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.settings = _(options).defaults({
        controllerPath: 'controllers/',
        controllerSuffix: '_controller'
      });
      return this.subscribeEvent('matchRoute', this.matchRouteHandler);
    };

    Dispatcher.prototype.matchRouteHandler = function(route, params, options) {
      return this.startupController(route.controller, route.action, params, options);
    };

    Dispatcher.prototype.startupController = function(controllerName, action, params, options) {
      var _this = this;
      if (action == null) {
        action = 'index';
      }
      params = params ? _.clone(params) : {};
      options = options ? _.clone(options) : {};
      if (options.changeURL !== false) {
        options.changeURL = true;
      }
      if (options.forceStartup !== true) {
        options.forceStartup = false;
      }
      if (!options.forceStartup && this.currentControllerName === controllerName && this.currentAction === action && (!this.currentParams || _(params).isEqual(this.currentParams))) {
        return;
      }
      return this.loadController(controllerName, function(ControllerConstructor) {
        return _this.controllerLoaded(controllerName, action, params, options, ControllerConstructor);
      });
    };

    Dispatcher.prototype.loadController = function(controllerName, handler) {
      var fileName, moduleName;
      fileName = utils.underscorize(controllerName) + this.settings.controllerSuffix;
      moduleName = this.settings.controllerPath + fileName;
      if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
        return require([moduleName], handler);
      } else {
        return handler(require(moduleName));
      }
    };

    Dispatcher.prototype.controllerLoaded = function(controllerName, action, params, options, ControllerConstructor) {
      var controller, methodName;
      controller = new ControllerConstructor(params, options);
      methodName = controller.beforeAction ? 'executeBeforeActions' : 'executeAction';
      return this[methodName](controller, controllerName, action, params, options);
    };

    Dispatcher.prototype.executeAction = function(controller, controllerName, action, params, options) {
      var currentController, currentControllerName;
      currentControllerName = this.currentControllerName || null;
      currentController = this.currentController || null;
      this.previousControllerName = currentControllerName;
      if (currentController) {
        this.publishEvent('beforeControllerDispose', currentController);
        currentController.dispose(params, controllerName);
      }
      options.previousControllerName = currentControllerName;
      controller[action](params, options);
      if (controller.redirected) {
        return;
      }
      this.currentControllerName = controllerName;
      this.currentController = controller;
      this.currentAction = action;
      this.currentParams = params;
      this.adjustURL(params, options);
      return this.publishEvent('startupController', {
        previousControllerName: this.previousControllerName,
        controller: this.currentController,
        controllerName: this.currentControllerName,
        params: this.currentParams,
        options: options
      });
    };

    Dispatcher.prototype.executeBeforeActions = function(controller, controllerName, action, params, options) {
      var acts, args, beforeAction, beforeActions, name, next, _i, _len, _ref,
        _this = this;
      beforeActions = [];
      args = arguments;
      _ref = utils.getAllPropertyVersions(controller, 'beforeAction');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        acts = _ref[_i];
        for (name in acts) {
          beforeAction = acts[name];
          if (name === action || RegExp("^" + name + "$").test(action)) {
            if (typeof beforeAction === 'string') {
              beforeAction = controller[beforeAction];
            }
            if (typeof beforeAction !== 'function') {
              throw new Error('Controller#executeBeforeActions: ' + ("" + beforeAction + " is not a valid beforeAction method for " + name + "."));
            }
            beforeActions.push(beforeAction);
          }
        }
      }
      next = function(method, previous) {
        if (previous == null) {
          previous = null;
        }
        if (controller.redirected) {
          return;
        }
        if (!method) {
          _this.executeAction.apply(_this, args);
          return;
        }
        previous = method.call(controller, params, options, previous);
        if (previous && typeof previous.then === 'function') {
          return previous.then(function(data) {
            if (!_this.currentController || controller === _this.currentController) {
              return next(beforeActions.shift(), data);
            }
          });
        } else {
          return next(beforeActions.shift(), previous);
        }
      };
      return next(beforeActions.shift());
    };

    Dispatcher.prototype.adjustURL = function(params, options) {
      var url;
      if (options.path == null) {
        return;
      }
      url = options.path + (options.queryString ? "?" + options.queryString : "");
      if (options.changeURL) {
        this.publishEvent('!router:changeURL', url, options);
      }
      return this.url = url;
    };

    Dispatcher.prototype.disposed = false;

    Dispatcher.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.currentController = null;
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Dispatcher;

  })();

}).call(this);
}, "chaplin/lib/delayer": function(exports, require, module) {(function() {
  'use strict';

  var Delayer;

  Delayer = {
    setTimeout: function(name, time, handler) {
      var handle, wrappedHandler, _ref,
        _this = this;
      if ((_ref = this.timeouts) == null) {
        this.timeouts = {};
      }
      this.clearTimeout(name);
      wrappedHandler = function() {
        delete _this.timeouts[name];
        return handler();
      };
      handle = setTimeout(wrappedHandler, time);
      this.timeouts[name] = handle;
      return handle;
    },
    clearTimeout: function(name) {
      if (!(this.timeouts && (this.timeouts[name] != null))) {
        return;
      }
      clearTimeout(this.timeouts[name]);
      delete this.timeouts[name];
    },
    clearAllTimeouts: function() {
      var handle, name, _ref;
      if (!this.timeouts) {
        return;
      }
      _ref = this.timeouts;
      for (name in _ref) {
        handle = _ref[name];
        this.clearTimeout(name);
      }
    },
    setInterval: function(name, time, handler) {
      var handle, _ref;
      this.clearInterval(name);
      if ((_ref = this.intervals) == null) {
        this.intervals = {};
      }
      handle = setInterval(handler, time);
      this.intervals[name] = handle;
      return handle;
    },
    clearInterval: function(name) {
      if (!(this.intervals && this.intervals[name])) {
        return;
      }
      clearInterval(this.intervals[name]);
      delete this.intervals[name];
    },
    clearAllIntervals: function() {
      var handle, name, _ref;
      if (!this.intervals) {
        return;
      }
      _ref = this.intervals;
      for (name in _ref) {
        handle = _ref[name];
        this.clearInterval(name);
      }
    },
    clearDelayed: function() {
      this.clearAllTimeouts();
      this.clearAllIntervals();
    }
  };

  if (typeof Object.freeze === "function") {
    Object.freeze(Delayer);
  }

  module.exports = Delayer;

}).call(this);
}, "chaplin/lib/event_broker": function(exports, require, module) {(function() {
  'use strict';

  var EventBroker, mediator,
    __slice = [].slice;

  mediator = require('chaplin/mediator');

  EventBroker = {
    subscribeEvent: function(type, handler) {
      if (typeof type !== 'string') {
        throw new TypeError('EventBroker#subscribeEvent: ' + 'type argument must be a string');
      }
      if (typeof handler !== 'function') {
        throw new TypeError('EventBroker#subscribeEvent: ' + 'handler argument must be a function');
      }
      mediator.unsubscribe(type, handler, this);
      return mediator.subscribe(type, handler, this);
    },
    unsubscribeEvent: function(type, handler) {
      if (typeof type !== 'string') {
        throw new TypeError('EventBroker#unsubscribeEvent: ' + 'type argument must be a string');
      }
      if (typeof handler !== 'function') {
        throw new TypeError('EventBroker#unsubscribeEvent: ' + 'handler argument must be a function');
      }
      return mediator.unsubscribe(type, handler);
    },
    unsubscribeAllEvents: function() {
      return mediator.unsubscribe(null, null, this);
    },
    publishEvent: function() {
      var args, type;
      type = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof type !== 'string') {
        throw new TypeError('EventBroker#publishEvent: ' + 'type argument must be a string');
      }
      return mediator.publish.apply(mediator, [type].concat(__slice.call(args)));
    }
  };

  if (typeof Object.freeze === "function") {
    Object.freeze(EventBroker);
  }

  module.exports = EventBroker;

}).call(this);
}, "chaplin/lib/route": function(exports, require, module) {(function() {
  'use strict';

  var Backbone, Controller, EventBroker, Route, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty;

  _ = require('underscore');

  Backbone = require('backbone');

  EventBroker = require('chaplin/lib/event_broker');

  Controller = require('chaplin/controllers/controller');

  module.exports = Route = (function() {
    var escapeRegExp, queryStringFieldSeparator, queryStringValueSeparator, reservedParams;

    Route.extend = Backbone.Model.extend;

    _(Route.prototype).extend(EventBroker);

    reservedParams = ['path', 'changeURL'];

    escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;

    queryStringFieldSeparator = '&';

    queryStringValueSeparator = '=';

    function Route(pattern, controller, action, options) {
      this.pattern = pattern;
      this.controller = controller;
      this.action = action;
      this.handler = __bind(this.handler, this);

      this.addParamName = __bind(this.addParamName, this);

      this.options = options ? _.clone(options) : {};
      if (this.options.name != null) {
        this.name = this.options.name;
      }
      this.paramNames = [];
      if (_(Controller.prototype).has(this.action)) {
        throw new Error('Route: You should not use existing controller properties as action names');
      }
      this.createRegExp();
    }

    Route.prototype.reverse = function(params) {
      var index, name, notEnoughParams, url, value, _i, _len, _ref;
      url = this.pattern;
      if (_.isRegExp(url)) {
        return false;
      }
      notEnoughParams = 'Route#reverse: Not enough parameters to reverse';
      if (_.isArray(params)) {
        if (params.length < this.paramNames.length) {
          throw new Error(notEnoughParams);
        }
        index = 0;
        url = url.replace(/[:*][^\/\?]+/g, function(match) {
          var result;
          result = params[index];
          index += 1;
          return result;
        });
      } else {
        _ref = this.paramNames;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          value = params[name];
          if (value === void 0) {
            throw new Error(notEnoughParams);
          }
          url = url.replace(RegExp("[:*]" + name, "g"), value);
        }
      }
      if (this.test(url)) {
        return url;
      } else {
        return false;
      }
    };

    Route.prototype.createRegExp = function() {
      var pattern;
      if (_.isRegExp(this.pattern)) {
        this.regExp = this.pattern;
        if (_.isArray(this.options.names)) {
          this.paramNames = this.options.names;
        }
        return;
      }
      pattern = this.pattern.replace(escapeRegExp, '\\$&').replace(/(?::|\*)(\w+)/g, this.addParamName);
      return this.regExp = RegExp("^" + pattern + "(?=\\?|$)");
    };

    Route.prototype.addParamName = function(match, paramName) {
      if (_(reservedParams).include(paramName)) {
        throw new Error("Route#addParamName: parameter name " + paramName + " is reserved");
      }
      this.paramNames.push(paramName);
      if (match.charAt(0) === ':') {
        return '([^\/\?]+)';
      } else {
        return '(.*?)';
      }
    };

    Route.prototype.test = function(path) {
      var constraint, constraints, matched, name, params;
      matched = this.regExp.test(path);
      if (!matched) {
        return false;
      }
      constraints = this.options.constraints;
      if (constraints) {
        params = this.extractParams(path);
        for (name in constraints) {
          if (!__hasProp.call(constraints, name)) continue;
          constraint = constraints[name];
          if (!constraint.test(params[name])) {
            return false;
          }
        }
      }
      return true;
    };

    Route.prototype.handler = function(path, options) {
      var params, queryString, _ref;
      options = options ? _.clone(options) : {};
      queryString = (_ref = options.queryString) != null ? _ref : this.getCurrentQueryString();
      params = this.buildParams(path, queryString);
      options.path = path;
      return this.publishEvent('matchRoute', this, params, options);
    };

    Route.prototype.getCurrentQueryString = function() {
      return location.search.substring(1);
    };

    Route.prototype.buildParams = function(path, queryString) {
      return _.extend({}, this.extractQueryParams(queryString), this.extractParams(path), this.options.params);
    };

    Route.prototype.extractParams = function(path) {
      var index, match, matches, paramName, params, _i, _len, _ref;
      params = {};
      matches = this.regExp.exec(path);
      _ref = matches.slice(1);
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        match = _ref[index];
        paramName = this.paramNames.length ? this.paramNames[index] : index;
        params[paramName] = match;
      }
      return params;
    };

    Route.prototype.extractQueryParams = function(queryString) {
      var current, field, pair, pairs, params, value, _i, _len, _ref;
      params = {};
      if (!queryString) {
        return params;
      }
      pairs = queryString.split(queryStringFieldSeparator);
      for (_i = 0, _len = pairs.length; _i < _len; _i++) {
        pair = pairs[_i];
        if (!pair.length) {
          continue;
        }
        _ref = pair.split(queryStringValueSeparator), field = _ref[0], value = _ref[1];
        if (!field.length) {
          continue;
        }
        field = decodeURIComponent(field);
        value = decodeURIComponent(value);
        current = params[field];
        if (current) {
          if (current.push) {
            current.push(value);
          } else {
            params[field] = [current, value];
          }
        } else {
          params[field] = value;
        }
      }
      return params;
    };

    return Route;

  })();

}).call(this);
}, "chaplin/lib/router": function(exports, require, module) {(function() {
  'use strict';

  var Backbone, EventBroker, Route, Router, mediator, utils, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore');

  Backbone = require('backbone');

  mediator = require('chaplin/mediator');

  EventBroker = require('chaplin/lib/event_broker');

  Route = require('chaplin/lib/route');

  utils = require('chaplin/lib/utils');

  module.exports = Router = (function() {

    Router.extend = Backbone.Model.extend;

    _(Router.prototype).extend(EventBroker);

    function Router(options) {
      this.options = options != null ? options : {};
      this.route = __bind(this.route, this);

      this.match = __bind(this.match, this);

      _(this.options).defaults({
        pushState: true,
        root: '/'
      });
      this.removeRoot = new RegExp('^' + utils.escapeRegExp(this.options.root) + '(#)?');
      this.subscribeEvent('!router:route', this.routeHandler);
      this.subscribeEvent('!router:routeByName', this.routeByNameHandler);
      this.subscribeEvent('!router:reverse', this.reverseHandler);
      this.subscribeEvent('!router:changeURL', this.changeURLHandler);
      this.createHistory();
    }

    Router.prototype.createHistory = function() {
      return Backbone.history || (Backbone.history = new Backbone.History());
    };

    Router.prototype.startHistory = function() {
      return Backbone.history.start(this.options);
    };

    Router.prototype.stopHistory = function() {
      if (Backbone.History.started) {
        return Backbone.history.stop();
      }
    };

    Router.prototype.match = function(pattern, target, options) {
      var action, controller, route, _ref;
      if (options == null) {
        options = {};
      }
      if (arguments.length === 2 && typeof target === 'object') {
        options = target;
        controller = options.controller, action = options.action;
        if (!(controller && action)) {
          throw new Error('Router#match must receive either target or options.controller & options.action');
        }
      } else {
        controller = options.controller, action = options.action;
        if (controller || action) {
          throw new Error('Router#match cannot use both target and options.controller / action');
        }
        _ref = target.split('#'), controller = _ref[0], action = _ref[1];
      }
      route = new Route(pattern, controller, action, options);
      Backbone.history.handlers.push({
        route: route,
        callback: route.handler
      });
      return route;
    };

    Router.prototype.route = function(path, options) {
      var handler, _i, _len, _ref;
      options = options ? _.clone(options) : {};
      _(options).defaults({
        changeURL: true
      });
      path = path.replace(this.removeRoot, '');
      _ref = Backbone.history.handlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        if (handler.route.test(path)) {
          handler.callback(path, options);
          return true;
        }
      }
      return false;
    };

    Router.prototype.routeHandler = function(path, options, callback) {
      var routed;
      if (arguments.length === 2 && typeof options === 'function') {
        callback = options;
        options = {};
      }
      routed = this.route(path, options);
      return typeof callback === "function" ? callback(routed) : void 0;
    };

    Router.prototype.routeByNameHandler = function(name, params, options, callback) {
      var path, routed;
      if (arguments.length === 3 && typeof options === 'function') {
        callback = options;
        options = {};
      }
      path = this.reverse(name, params);
      if (typeof path === 'string') {
        routed = this.route(path, options);
        return typeof callback === "function" ? callback(routed) : void 0;
      } else {
        return typeof callback === "function" ? callback(false) : void 0;
      }
    };

    Router.prototype.reverse = function(name, params) {
      var handler, url, _i, _len, _ref;
      _ref = Backbone.history.handlers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        if (!(handler.route.name === name)) {
          continue;
        }
        url = handler.route.reverse(params);
        if (url !== false) {
          return url;
        }
      }
      return false;
    };

    Router.prototype.reverseHandler = function(name, params, callback) {
      return callback(this.reverse(name, params));
    };

    Router.prototype.changeURL = function(url, options) {
      var navigateOptions;
      if (options == null) {
        options = {};
      }
      navigateOptions = {
        trigger: options.trigger === true,
        replace: options.replace === true
      };
      return Backbone.history.navigate(url, navigateOptions);
    };

    Router.prototype.changeURLHandler = function(url, options) {
      return this.changeURL(url, options);
    };

    Router.prototype.disposed = false;

    Router.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.stopHistory();
      delete Backbone.history;
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Router;

  })();

}).call(this);
}, "chaplin/lib/support": function(exports, require, module) {(function() {
  'use strict';

  var support;

  support = {
    propertyDescriptors: (function() {
      var o;
      if (!(typeof Object.defineProperty === 'function' && typeof Object.defineProperties === 'function')) {
        return false;
      }
      try {
        o = {};
        Object.defineProperty(o, 'foo', {
          value: 'bar'
        });
        return o.foo === 'bar';
      } catch (error) {
        return false;
      }
    })()
  };

  module.exports = support;

}).call(this);
}, "chaplin/lib/sync_machine": function(exports, require, module) {(function() {
  'use strict';

  var STATE_CHANGE, SYNCED, SYNCING, SyncMachine, UNSYNCED, event, _fn, _i, _len, _ref;

  UNSYNCED = 'unsynced';

  SYNCING = 'syncing';

  SYNCED = 'synced';

  STATE_CHANGE = 'syncStateChange';

  SyncMachine = {
    _syncState: UNSYNCED,
    _previousSyncState: null,
    syncState: function() {
      return this._syncState;
    },
    isUnsynced: function() {
      return this._syncState === UNSYNCED;
    },
    isSynced: function() {
      return this._syncState === SYNCED;
    },
    isSyncing: function() {
      return this._syncState === SYNCING;
    },
    unsync: function() {
      var _ref;
      if ((_ref = this._syncState) === SYNCING || _ref === SYNCED) {
        this._previousSync = this._syncState;
        this._syncState = UNSYNCED;
        this.trigger(this._syncState, this, this._syncState);
        this.trigger(STATE_CHANGE, this, this._syncState);
      }
    },
    beginSync: function() {
      var _ref;
      if ((_ref = this._syncState) === UNSYNCED || _ref === SYNCED) {
        this._previousSync = this._syncState;
        this._syncState = SYNCING;
        this.trigger(this._syncState, this, this._syncState);
        this.trigger(STATE_CHANGE, this, this._syncState);
      }
    },
    finishSync: function() {
      if (this._syncState === SYNCING) {
        this._previousSync = this._syncState;
        this._syncState = SYNCED;
        this.trigger(this._syncState, this, this._syncState);
        this.trigger(STATE_CHANGE, this, this._syncState);
      }
    },
    abortSync: function() {
      if (this._syncState === SYNCING) {
        this._syncState = this._previousSync;
        this._previousSync = this._syncState;
        this.trigger(this._syncState, this, this._syncState);
        this.trigger(STATE_CHANGE, this, this._syncState);
      }
    }
  };

  _ref = [UNSYNCED, SYNCING, SYNCED, STATE_CHANGE];
  _fn = function(event) {
    return SyncMachine[event] = function(callback, context) {
      if (context == null) {
        context = this;
      }
      this.on(event, callback, context);
      if (this._syncState === event) {
        return callback.call(context);
      }
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    event = _ref[_i];
    _fn(event);
  }

  if (typeof Object.freeze === "function") {
    Object.freeze(SyncMachine);
  }

  module.exports = SyncMachine;

}).call(this);
}, "chaplin/lib/utils": function(exports, require, module) {(function() {
  'use strict';

  var support, utils, _,
    __slice = [].slice;

  _ = require('underscore');

  support = require('chaplin/lib/support');

  utils = {
    beget: (function() {
      var ctor;
      if (typeof Object.create === 'function') {
        return Object.create;
      } else {
        ctor = function() {};
        return function(obj) {
          ctor.prototype = obj;
          return new ctor;
        };
      }
    })(),
    serialize: function(data) {
      if (typeof data.serialize === 'function') {
        return data.serialize();
      } else if (typeof data.toJSON === 'function') {
        return data.toJSON();
      } else {
        throw new TypeError('utils.serialize: Unknown data was passed');
      }
    },
    readonly: (function() {
      var readonlyDescriptor;
      if (support.propertyDescriptors) {
        readonlyDescriptor = {
          writable: false,
          enumerable: true,
          configurable: false
        };
        return function() {
          var obj, prop, properties, _i, _len;
          obj = arguments[0], properties = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          for (_i = 0, _len = properties.length; _i < _len; _i++) {
            prop = properties[_i];
            readonlyDescriptor.value = obj[prop];
            Object.defineProperty(obj, prop, readonlyDescriptor);
          }
          return true;
        };
      } else {
        return function() {
          return false;
        };
      }
    })(),
    getPrototypeChain: function(object) {
      var chain, _ref;
      chain = [object.constructor.prototype];
      while (object = (_ref = object.constructor) != null ? _ref.__super__ : void 0) {
        chain.push(object);
      }
      return chain;
    },
    getAllPropertyVersions: function(object, property) {
      return _(utils.getPrototypeChain(object)).chain().pluck(property).compact().uniq().value().reverse();
    },
    wrapMethod: function(instance, name) {
      var func;
      func = instance[name];
      instance["" + name + "IsWrapped"] = true;
      return instance[name] = function() {
        if (instance.disposed) {
          return false;
        }
        func.apply(instance, arguments);
        instance["after" + (utils.upcase(name))].apply(instance, arguments);
        return instance;
      };
    },
    upcase: function(str) {
      return str.charAt(0).toUpperCase() + str.substring(1);
    },
    underscorize: function(string) {
      return string.replace(/[A-Z]/g, function(char, index) {
        return (index !== 0 ? '_' : '') + char.toLowerCase();
      });
    },
    escapeRegExp: function(str) {
      if (!str) {
        return;
      }
      return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    },
    modifierKeyPressed: function(event) {
      return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
    }
  };

  if (typeof Object.seal === "function") {
    Object.seal(utils);
  }

  module.exports = utils;

}).call(this);
}, "chaplin/mediator": function(exports, require, module) {(function() {
  'use strict';

  var Backbone, mediator, support, utils, _;

  _ = require('underscore');

  Backbone = require('backbone');

  support = require('chaplin/lib/support');

  utils = require('chaplin/lib/utils');

  mediator = {};

  mediator.subscribe = Backbone.Events.on;

  mediator.unsubscribe = Backbone.Events.off;

  mediator.publish = Backbone.Events.trigger;

  mediator._callbacks = null;

  utils.readonly(mediator, 'subscribe', 'unsubscribe', 'publish');

  mediator.seal = function() {
    if (support.propertyDescriptors && Object.seal) {
      return Object.seal(mediator);
    }
  };

  utils.readonly(mediator, 'seal');

  module.exports = mediator;

}).call(this);
}, "chaplin/models/collection": function(exports, require, module) {(function() {
  'use strict';

  var Backbone, Collection, EventBroker, Model, utils, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Backbone = require('backbone');

  EventBroker = require('chaplin/lib/event_broker');

  Model = require('chaplin/models/model');

  utils = require('chaplin/lib/utils');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    _(Collection.prototype).extend(EventBroker);

    Collection.prototype.model = Model;

    Collection.prototype.initDeferred = function() {
      return _(this).extend($.Deferred());
    };

    Collection.prototype.serialize = function() {
      return this.map(utils.serialize);
    };

    Collection.prototype.addAtomic = function(models, options) {
      var direction, model;
      if (options == null) {
        options = {};
      }
      if (!models.length) {
        return;
      }
      options.silent = true;
      direction = typeof options.at === 'number' ? 'pop' : 'shift';
      while (model = models[direction]()) {
        this.add(model, options);
      }
      return this.trigger('reset');
    };

    Collection.prototype.disposed = false;

    Collection.prototype.dispose = function() {
      var prop, properties, _i, _len;
      if (this.disposed) {
        return;
      }
      this.trigger('dispose', this);
      this.reset([], {
        silent: true
      });
      this.unsubscribeAllEvents();
      this.off();
      if (typeof this.reject === "function") {
        this.reject();
      }
      properties = ['model', 'models', '_byId', '_byCid', '_callbacks'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Collection;

  })(Backbone.Collection);

}).call(this);
}, "chaplin/models/model": function(exports, require, module) {(function() {
  'use strict';

  var Backbone, EventBroker, Model, serializeAttributes, serializeModelAttributes, utils, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Backbone = require('backbone');

  utils = require('chaplin/lib/utils');

  EventBroker = require('chaplin/lib/event_broker');

  serializeAttributes = function(model, attributes, modelStack) {
    var delegator, key, otherModel, serializedModels, value, _i, _len, _ref;
    delegator = utils.beget(attributes);
    if (modelStack) {
      modelStack.push(model);
    } else {
      modelStack = [model];
    }
    for (key in attributes) {
      value = attributes[key];
      if (value instanceof Backbone.Model) {
        delegator[key] = serializeModelAttributes(value, model, modelStack);
      } else if (value instanceof Backbone.Collection) {
        serializedModels = [];
        _ref = value.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          otherModel = _ref[_i];
          serializedModels.push(serializeModelAttributes(otherModel, model, modelStack));
        }
        delegator[key] = serializedModels;
      }
    }
    modelStack.pop();
    return delegator;
  };

  serializeModelAttributes = function(model, currentModel, modelStack) {
    var attributes;
    if (model === currentModel || __indexOf.call(modelStack, model) >= 0) {
      return null;
    }
    attributes = typeof model.getAttributes === 'function' ? model.getAttributes() : model.attributes;
    return serializeAttributes(model, attributes, modelStack);
  };

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    _(Model.prototype).extend(EventBroker);

    Model.prototype.initDeferred = function() {
      return _(this).extend($.Deferred());
    };

    Model.prototype.getAttributes = function() {
      return this.attributes;
    };

    Model.prototype.serialize = function() {
      return serializeAttributes(this, this.getAttributes());
    };

    Model.prototype.disposed = false;

    Model.prototype.dispose = function() {
      var prop, properties, _i, _len;
      if (this.disposed) {
        return;
      }
      this.trigger('dispose', this);
      this.unsubscribeAllEvents();
      this.off();
      if (typeof this.reject === "function") {
        this.reject();
      }
      properties = ['collection', 'attributes', 'changed', '_escapedAttributes', '_previousAttributes', '_silent', '_pending', '_callbacks'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Model;

  })(Backbone.Model);

}).call(this);
}, "chaplin/views/collection_view": function(exports, require, module) {(function() {
  'use strict';

  var $, Backbone, CollectionView, View, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Backbone = require('backbone');

  View = require('chaplin/views/view');

  $ = Backbone.$;

  module.exports = CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    CollectionView.prototype.itemView = null;

    CollectionView.prototype.autoRender = true;

    CollectionView.prototype.renderItems = true;

    CollectionView.prototype.animationDuration = 500;

    CollectionView.prototype.useCssAnimation = false;

    CollectionView.prototype.animationStartClass = 'animated-item-view';

    CollectionView.prototype.animationEndClass = 'animated-item-view-end';

    CollectionView.prototype.listSelector = null;

    CollectionView.prototype.$list = null;

    CollectionView.prototype.fallbackSelector = null;

    CollectionView.prototype.$fallback = null;

    CollectionView.prototype.loadingSelector = null;

    CollectionView.prototype.$loading = null;

    CollectionView.prototype.itemSelector = null;

    CollectionView.prototype.filterer = null;

    CollectionView.prototype.filterCallback = function(view, included) {
      return view.$el.stop(true, true).toggle(included);
    };

    CollectionView.prototype.visibleItems = null;

    function CollectionView(options) {
      this.renderAllItems = __bind(this.renderAllItems, this);

      this.showHideFallback = __bind(this.showHideFallback, this);

      this.itemsResetted = __bind(this.itemsResetted, this);

      this.itemRemoved = __bind(this.itemRemoved, this);

      this.itemAdded = __bind(this.itemAdded, this);
      if (options) {
        _(this).extend(_.pick(options, ['renderItems', 'itemView']));
      }
      CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      CollectionView.__super__.initialize.apply(this, arguments);
      this.visibleItems = [];
      this.addCollectionListeners();
      if (options.filterer != null) {
        return this.filter(options.filterer);
      }
    };

    CollectionView.prototype.addCollectionListeners = function() {
      this.listenTo(this.collection, 'add', this.itemAdded);
      this.listenTo(this.collection, 'remove', this.itemRemoved);
      return this.listenTo(this.collection, 'reset sort', this.itemsResetted);
    };

    CollectionView.prototype.getTemplateData = function() {
      var templateData;
      templateData = {
        length: this.collection.length
      };
      if (typeof this.collection.state === 'function') {
        templateData.resolved = this.collection.state() === 'resolved';
      }
      if (typeof this.collection.isSynced === 'function') {
        templateData.synced = this.collection.isSynced();
      }
      return templateData;
    };

    CollectionView.prototype.getTemplateFunction = function() {};

    CollectionView.prototype.render = function() {
      CollectionView.__super__.render.apply(this, arguments);
      this.$list = this.listSelector ? this.$(this.listSelector) : this.$el;
      this.initFallback();
      this.initLoadingIndicator();
      if (this.renderItems) {
        return this.renderAllItems();
      }
    };

    CollectionView.prototype.itemAdded = function(item, collection, options) {
      if (options == null) {
        options = {};
      }
      return this.renderAndInsertItem(item, options.index);
    };

    CollectionView.prototype.itemRemoved = function(item) {
      return this.removeViewForItem(item);
    };

    CollectionView.prototype.itemsResetted = function() {
      return this.renderAllItems();
    };

    CollectionView.prototype.initFallback = function() {
      if (!this.fallbackSelector) {
        return;
      }
      this.$fallback = this.$(this.fallbackSelector);
      this.on('visibilityChange', this.showHideFallback);
      this.listenTo(this.collection, 'syncStateChange', this.showHideFallback);
      return this.showHideFallback();
    };

    CollectionView.prototype.showHideFallback = function() {
      var visible;
      visible = this.visibleItems.length === 0 && (typeof this.collection.isSynced === 'function' ? this.collection.isSynced() : true);
      return this.$fallback.toggle(visible);
    };

    CollectionView.prototype.initLoadingIndicator = function() {
      if (!(this.loadingSelector && typeof this.collection.isSyncing === 'function')) {
        return;
      }
      this.$loading = this.$(this.loadingSelector);
      this.listenTo(this.collection, 'syncStateChange', this.showHideLoadingIndicator);
      return this.showHideLoadingIndicator();
    };

    CollectionView.prototype.showHideLoadingIndicator = function() {
      var visible;
      visible = this.collection.length === 0 && this.collection.isSyncing();
      return this.$loading.toggle(visible);
    };

    CollectionView.prototype.getItemViews = function() {
      var itemViews, name, view, _ref;
      itemViews = {};
      _ref = this.subviewsByName;
      for (name in _ref) {
        view = _ref[name];
        if (name.slice(0, 9) === 'itemView:') {
          itemViews[name.slice(9)] = view;
        }
      }
      return itemViews;
    };

    CollectionView.prototype.filter = function(filterer, filterCallback) {
      var included, index, item, view, _i, _len, _ref;
      this.filterer = filterer;
      if (filterCallback) {
        this.filterCallback = filterCallback;
      }
      if (filterCallback == null) {
        filterCallback = this.filterCallback;
      }
      if (!_(this.getItemViews()).isEmpty()) {
        _ref = this.collection.models;
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          item = _ref[index];
          included = typeof filterer === 'function' ? filterer(item, index) : true;
          view = this.subview("itemView:" + item.cid);
          if (!view) {
            throw new Error('CollectionView#filter: ' + ("no view found for " + item.cid));
          }
          this.filterCallback(view, included);
          this.updateVisibleItems(view.model, included, false);
        }
      }
      return this.trigger('visibilityChange', this.visibleItems);
    };

    CollectionView.prototype.renderAllItems = function() {
      var cid, index, item, items, remainingViewsByCid, view, _i, _j, _len, _len1, _ref;
      items = this.collection.models;
      this.visibleItems = [];
      remainingViewsByCid = {};
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        view = this.subview("itemView:" + item.cid);
        if (view) {
          remainingViewsByCid[item.cid] = view;
        }
      }
      _ref = this.getItemViews();
      for (cid in _ref) {
        if (!__hasProp.call(_ref, cid)) continue;
        view = _ref[cid];
        if (!(cid in remainingViewsByCid)) {
          this.removeSubview("itemView:" + cid);
        }
      }
      for (index = _j = 0, _len1 = items.length; _j < _len1; index = ++_j) {
        item = items[index];
        view = this.subview("itemView:" + item.cid);
        if (view) {
          this.insertView(item, view, index, false);
        } else {
          this.renderAndInsertItem(item, index);
        }
      }
      if (!items.length) {
        return this.trigger('visibilityChange', this.visibleItems);
      }
    };

    CollectionView.prototype.renderAndInsertItem = function(item, index) {
      var view;
      view = this.renderItem(item);
      return this.insertView(item, view, index);
    };

    CollectionView.prototype.renderItem = function(item) {
      var view;
      view = this.subview("itemView:" + item.cid);
      if (!view) {
        view = this.getView(item);
        this.subview("itemView:" + item.cid, view);
      }
      view.render();
      return view;
    };

    CollectionView.prototype.getView = function(model) {
      if (this.itemView) {
        return new this.itemView({
          model: model
        });
      } else {
        throw new Error('The CollectionView#itemView property ' + 'must be defined or the getView() must be overridden.');
      }
    };

    CollectionView.prototype.insertView = function(item, view, index, enableAnimation) {
      var $list, $next, $previous, $viewEl, children, included, length, position, viewEl,
        _this = this;
      if (index == null) {
        index = null;
      }
      if (enableAnimation == null) {
        enableAnimation = true;
      }
      if (this.animationDuration === 0) {
        enableAnimation = false;
      }
      position = typeof index === 'number' ? index : this.collection.indexOf(item);
      included = typeof this.filterer === 'function' ? this.filterer(item, position) : true;
      viewEl = view.el;
      $viewEl = view.$el;
      if (included && enableAnimation) {
        if (this.useCssAnimation) {
          $viewEl.addClass(this.animationStartClass);
        } else {
          $viewEl.css('opacity', 0);
        }
      }
      this.filterCallback(view, included);
      $list = this.$list;
      children = this.itemSelector ? $list.children(this.itemSelector) : $list.children();
      if (children.get(position) !== viewEl) {
        length = children.length;
        if (length === 0 || position === length) {
          $list.append(viewEl);
        } else {
          if (position === 0) {
            $next = children.eq(position);
            $next.before(viewEl);
          } else {
            $previous = children.eq(position - 1);
            $previous.after(viewEl);
          }
        }
      }
      view.trigger('addedToParent');
      this.updateVisibleItems(item, included);
      if (included && enableAnimation) {
        if (this.useCssAnimation) {
          setTimeout(function() {
            return $viewEl.addClass(_this.animationEndClass);
          }, 0);
        } else {
          $viewEl.animate({
            opacity: 1
          }, this.animationDuration);
        }
      }
    };

    CollectionView.prototype.removeViewForItem = function(item) {
      this.updateVisibleItems(item, false);
      return this.removeSubview("itemView:" + item.cid);
    };

    CollectionView.prototype.updateVisibleItems = function(item, includedInFilter, triggerEvent) {
      var includedInVisibleItems, visibilityChanged, visibleItemsIndex;
      if (triggerEvent == null) {
        triggerEvent = true;
      }
      visibilityChanged = false;
      visibleItemsIndex = _(this.visibleItems).indexOf(item);
      includedInVisibleItems = visibleItemsIndex > -1;
      if (includedInFilter && !includedInVisibleItems) {
        this.visibleItems.push(item);
        visibilityChanged = true;
      } else if (!includedInFilter && includedInVisibleItems) {
        this.visibleItems.splice(visibleItemsIndex, 1);
        visibilityChanged = true;
      }
      if (visibilityChanged && triggerEvent) {
        this.trigger('visibilityChange', this.visibleItems);
      }
      return visibilityChanged;
    };

    CollectionView.prototype.dispose = function() {
      var prop, properties, _i, _len;
      if (this.disposed) {
        return;
      }
      properties = ['$list', '$fallback', '$loading', 'visibleItems'];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        delete this[prop];
      }
      return CollectionView.__super__.dispose.apply(this, arguments);
    };

    return CollectionView;

  })(View);

}).call(this);
}, "chaplin/views/layout": function(exports, require, module) {(function() {
  'use strict';

  var $, Backbone, EventBroker, Layout, utils, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore');

  Backbone = require('backbone');

  utils = require('chaplin/lib/utils');

  EventBroker = require('chaplin/lib/event_broker');

  $ = Backbone.$;

  module.exports = Layout = (function() {

    Layout.extend = Backbone.Model.extend;

    _(Layout.prototype).extend(EventBroker);

    Layout.prototype.title = '';

    Layout.prototype.events = {};

    Layout.prototype.el = document;

    Layout.prototype.$el = $(document);

    Layout.prototype.cid = 'chaplin-layout';

    function Layout() {
      this.openLink = __bind(this.openLink, this);
      this.initialize.apply(this, arguments);
    }

    Layout.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.title = options.title;
      this.settings = _(options).defaults({
        titleTemplate: _.template("<%= subtitle %> \u2013 <%= title %>"),
        openExternalToBlank: false,
        routeLinks: 'a, .go-to',
        skipRouting: '.noscript',
        scrollTo: [0, 0]
      });
      this.subscribeEvent('beforeControllerDispose', this.hideOldView);
      this.subscribeEvent('startupController', this.showNewView);
      this.subscribeEvent('!adjustTitle', this.adjustTitle);
      if (this.settings.routeLinks) {
        this.startLinkRouting();
      }
      return this.delegateEvents();
    };

    Layout.prototype.delegateEvents = Backbone.View.prototype.delegateEvents;

    Layout.prototype.undelegateEvents = Backbone.View.prototype.undelegateEvents;

    Layout.prototype.hideOldView = function(controller) {
      var scrollTo, view;
      scrollTo = this.settings.scrollTo;
      if (scrollTo) {
        window.scrollTo(scrollTo[0], scrollTo[1]);
      }
      view = controller.view;
      if (view) {
        return view.$el.hide();
      }
    };

    Layout.prototype.showNewView = function(context) {
      var view;
      view = context.controller.view;
      if (view) {
        return view.$el.show();
      }
    };

    Layout.prototype.adjustTitle = function(subtitle) {
      var title;
      if (subtitle == null) {
        subtitle = '';
      }
      title = this.settings.titleTemplate({
        title: this.title,
        subtitle: subtitle
      });
      return setTimeout((function() {
        return document.title = title;
      }), 50);
    };

    Layout.prototype.startLinkRouting = function() {
      if (this.settings.routeLinks) {
        return $(document).on('click', this.settings.routeLinks, this.openLink);
      }
    };

    Layout.prototype.stopLinkRouting = function() {
      if (this.settings.routeLinks) {
        return $(document).off('click', this.settings.routeLinks);
      }
    };

    Layout.prototype.openLink = function(event) {
      var $el, callback, el, href, internal, isAnchor, options, path, queryString, skipRouting, type, _ref, _ref1, _ref2;
      if (utils.modifierKeyPressed(event)) {
        return;
      }
      el = event.currentTarget;
      $el = $(el);
      isAnchor = el.nodeName === 'A';
      href = $el.attr('href') || $el.data('href') || null;
      if (href === null || href === void 0 || href === '' || href.charAt(0) === '#') {
        return;
      }
      if (isAnchor && ($el.attr('target') === '_blank' || $el.attr('rel') === 'external' || ((_ref = el.protocol) !== 'http:' && _ref !== 'https:' && _ref !== 'file:'))) {
        return;
      }
      skipRouting = this.settings.skipRouting;
      type = typeof skipRouting;
      if (type === 'function' && !skipRouting(href, el) || type === 'string' && $el.is(skipRouting)) {
        return;
      }
      internal = !isAnchor || ((_ref1 = el.hostname) === location.hostname || _ref1 === '');
      if (!internal) {
        if (this.settings.openExternalToBlank) {
          event.preventDefault();
          window.open(el.href);
        }
        return;
      }
      if (isAnchor) {
        path = el.pathname;
        queryString = el.search.substring(1);
        if (path.charAt(0) !== '/') {
          path = "/" + path;
        }
      } else {
        _ref2 = href.split('?'), path = _ref2[0], queryString = _ref2[1];
        if (queryString == null) {
          queryString = '';
        }
      }
      options = {
        queryString: queryString
      };
      callback = function(routed) {
        if (routed) {
          event.preventDefault();
        } else if (!isAnchor) {
          location.href = path;
        }
      };
      this.publishEvent('!router:route', path, options, callback);
    };

    Layout.prototype.disposed = false;

    Layout.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.stopLinkRouting();
      this.unsubscribeAllEvents();
      this.undelegateEvents();
      delete this.title;
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return Layout;

  })();

}).call(this);
}, "chaplin/views/view": function(exports, require, module) {(function() {
  'use strict';

  var $, Backbone, Collection, EventBroker, Model, View, utils, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  Backbone = require('backbone');

  utils = require('chaplin/lib/utils');

  EventBroker = require('chaplin/lib/event_broker');

  Model = require('chaplin/models/model');

  Collection = require('chaplin/models/collection');

  $ = Backbone.$;

  module.exports = View = (function(_super) {

    __extends(View, _super);

    _(View.prototype).extend(EventBroker);

    View.prototype.autoRender = false;

    View.prototype.container = null;

    View.prototype.containerMethod = 'append';

    View.prototype.subviews = null;

    View.prototype.subviewsByName = null;

    function View(options) {
      if (this.initialize !== View.prototype.initialize) {
        utils.wrapMethod(this, 'initialize');
      }
      if (this.render === View.prototype.render) {
        this.render = _(this.render).bind(this);
      } else {
        utils.wrapMethod(this, 'render');
      }
      if (options) {
        _(this).extend(_.pick(options, ['autoRender', 'container', 'containerMethod']));
      }
      View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.initialize = function(options) {
      this.subviews = [];
      this.subviewsByName = {};
      if (this.model) {
        this.listenTo(this.model, 'dispose', this.dispose);
      }
      if (this.collection) {
        this.listenTo(this.collection, 'dispose', this.dispose);
      }
      if (!this.initializeIsWrapped) {
        return this.afterInitialize();
      }
    };

    View.prototype.afterInitialize = function() {
      if (this.autoRender) {
        return this.render();
      }
    };

    View.prototype.delegate = function(eventType, second, third) {
      var event, events, handler, list, selector;
      if (typeof eventType !== 'string') {
        throw new TypeError('View#delegate: first argument must be a string');
      }
      if (arguments.length === 2) {
        handler = second;
      } else if (arguments.length === 3) {
        selector = second;
        if (typeof selector !== 'string') {
          throw new TypeError('View#delegate: ' + 'second argument must be a string');
        }
        handler = third;
      } else {
        throw new TypeError('View#delegate: ' + 'only two or three arguments are allowed');
      }
      if (typeof handler !== 'function') {
        throw new TypeError('View#delegate: ' + 'handler argument must be function');
      }
      list = (function() {
        var _i, _len, _ref, _results;
        _ref = eventType.split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          _results.push("" + event + ".delegate" + this.cid);
        }
        return _results;
      }).call(this);
      events = list.join(' ');
      handler = _(handler).bind(this);
      if (selector) {
        this.$el.on(events, selector, handler);
      } else {
        this.$el.on(events, handler);
      }
      return handler;
    };

    View.prototype._delegateEvents = function(events) {
      var bound, eventName, key, match, method, selector, value, _results;
      if (!events) {
        return;
      }
      _results = [];
      for (key in events) {
        value = events[key];
        method = typeof value === 'function' ? value : this[value];
        if (!method) {
          throw new Error("Method '" + method + "' does not exist");
        }
        match = key.match(/^(\S+)\s*(.*)$/);
        eventName = match[1];
        selector = match[2];
        bound = _.bind(method, this);
        eventName += ".delegateEvents" + this.cid;
        if (selector === '') {
          _results.push(this.$el.on(eventName, bound));
        } else {
          _results.push(this.$el.on(eventName, selector, bound));
        }
      }
      return _results;
    };

    View.prototype.delegateEvents = function(events) {
      var classEvents, _i, _len, _ref;
      this.undelegateEvents();
      if (events) {
        return this._delegateEvents(events);
      }
      _ref = utils.getAllPropertyVersions(this, 'events');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        classEvents = _ref[_i];
        if (typeof classEvents === 'function') {
          throw new TypeError('View#delegateEvents: functions are not supported');
        }
        this._delegateEvents(classEvents);
      }
    };

    View.prototype.undelegate = function() {
      return this.$el.unbind(".delegate" + this.cid);
    };

    View.prototype.subview = function(name, view) {
      if (name && view) {
        this.removeSubview(name);
        this.subviews.push(view);
        this.subviewsByName[name] = view;
        return view;
      } else if (name) {
        return this.subviewsByName[name];
      }
    };

    View.prototype.removeSubview = function(nameOrView) {
      var index, name, otherName, otherView, view, _ref;
      if (!nameOrView) {
        return;
      }
      if (typeof nameOrView === 'string') {
        name = nameOrView;
        view = this.subviewsByName[name];
      } else {
        view = nameOrView;
        _ref = this.subviewsByName;
        for (otherName in _ref) {
          otherView = _ref[otherName];
          if (view === otherView) {
            name = otherName;
            break;
          }
        }
      }
      if (!(name && view && view.dispose)) {
        return;
      }
      view.dispose();
      index = _(this.subviews).indexOf(view);
      if (index > -1) {
        this.subviews.splice(index, 1);
      }
      return delete this.subviewsByName[name];
    };

    View.prototype.getTemplateData = function() {
      var modelOrCollection, templateData;
      templateData = this.model ? utils.serialize(this.model) : this.collection ? {
        items: utils.serialize(this.collection),
        length: this.collection.length
      } : {};
      modelOrCollection = this.model || this.collection;
      if (modelOrCollection) {
        if (typeof modelOrCollection.state === 'function' && !('resolved' in templateData)) {
          templateData.resolved = modelOrCollection.state() === 'resolved';
        }
        if (typeof modelOrCollection.isSynced === 'function' && !('synced' in templateData)) {
          templateData.synced = modelOrCollection.isSynced();
        }
      }
      return templateData;
    };

    View.prototype.getTemplateFunction = function() {
      throw new Error('View#getTemplateFunction must be overridden');
    };

    View.prototype.render = function() {
      var html, templateFunc;
      if (this.disposed) {
        return false;
      }
      templateFunc = this.getTemplateFunction();
      if (typeof templateFunc === 'function') {
        html = templateFunc(this.getTemplateData());
        this.$el.empty().append(html);
      }
      if (!this.renderIsWrapped) {
        this.afterRender();
      }
      return this;
    };

    View.prototype.afterRender = function() {
      if (this.container) {
        $(this.container)[this.containerMethod](this.el);
        return this.trigger('addedToDOM');
      }
    };

    View.prototype.disposed = false;

    View.prototype.dispose = function() {
      var prop, properties, subview, _i, _j, _len, _len1, _ref;
      if (this.disposed) {
        return;
      }
      if (this.subviews == null) {
        throw new Error('Your `initialize` method must include a super call to\
      Chaplin `initialize`');
      }
      _ref = this.subviews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subview = _ref[_i];
        subview.dispose();
      }
      this.unsubscribeAllEvents();
      this.stopListening();
      this.off();
      this.$el.remove();
      properties = ['el', '$el', 'options', 'model', 'collection', 'subviews', 'subviewsByName', '_callbacks'];
      for (_j = 0, _len1 = properties.length; _j < _len1; _j++) {
        prop = properties[_j];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return View;

  })(Backbone.View);

}).call(this);
}, "backbone": function(exports, require, module) {(function() {

  module.exports = Backbone;

}).call(this);
}, "scratch": function(exports, require, module) {(function() {

  module.exports = {
    run: function(options) {
      var $label, $row, $table, $window;
      require('tb').load();
      $window = $('<Window>');
      $table = $('<TableView>').appendTo($window);
      $row = $('<TableViewRow>');
      $label = $('<Label>').appendTo($row);
      $table.append($row);
      return console.warn($label.closest('Window'));
    }
  };

}).call(this);
}, "tb/chaplin/application": function(exports, require, module) {(function() {
  var Application, Chaplin, Dispatcher, History, LayoutManager,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  Dispatcher = require('./dispatcher');

  LayoutManager = require('./views/layout_manager');

  History = require('./lib/history');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.initialize = function() {
      Backbone.history = new History;
      Chaplin.Route.prototype.getCurrentQueryString = function() {
        return Backbone.history.path.split(/\?/)[1];
      };
      return Application.__super__.initialize.apply(this, arguments);
    };

    Application.prototype.initLayoutManager = function(options) {
      return this.layoutManager = new LayoutManager(options);
    };

    Application.prototype.initDispatcher = function(options) {
      return this.dispatcher = new Dispatcher(options);
    };

    return Application;

  })(Chaplin.Application);

}).call(this);
}, "tb/chaplin/dispatcher": function(exports, require, module) {(function() {
  var Chaplin, Dispatcher,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Dispatcher = (function(_super) {

    __extends(Dispatcher, _super);

    function Dispatcher() {
      return Dispatcher.__super__.constructor.apply(this, arguments);
    }

    Dispatcher.prototype.executeAction = function(controller, controllerName, action, params, options) {
      if (controller.layout) {
        if (this.currentLayout && this.currentLayout !== controller.layout) {
          this.publishEvent("destroyLayout:" + this.currentLayout);
        }
        this.currentLayout = controller.layout;
      }
      this.subscribeEvent("destroyLayout:" + this.currentLayout, function() {
        return controller.dispose();
      });
      controller[action](params, options);
      if (controller.redirected) {
        return;
      }
      return this.publishEvent('startupController', {
        layout: this.currentLayout,
        controller: controller,
        controllerName: controllerName,
        params: params,
        options: options
      });
    };

    return Dispatcher;

  })(Chaplin.Dispatcher);

}).call(this);
}, "tb/chaplin/lib/history": function(exports, require, module) {(function() {
  var History;

  module.exports = History = (function() {

    function History() {
      this.handlers = [];
    }

    History.prototype.start = function(options) {
      this.options = _({}).extend({
        path: ''
      }, this.options, options);
      this.path = this.options.path;
      if (!this.options.silent) {
        return this.loadUrl();
      }
    };

    History.prototype.loadUrl = function(path, options) {
      var matched,
        _this = this;
      if (path == null) {
        path = this.path;
      }
      matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(path)) {
          handler.callback(path, options);
          return true;
        }
      });
      return matched;
    };

    History.prototype.navigate = function(path, options) {
      this.path = path;
      return this.loadUrl(this.path, options);
    };

    return History;

  })();

}).call(this);
}, "tb/chaplin/views/layout": function(exports, require, module) {(function() {
  var EventBroker, Layout;

  EventBroker = require('chaplin/lib/event_broker');

  module.exports = Layout = (function() {

    function Layout() {}

    Layout.extend = Backbone.Model.extend;

    _(Layout.prototype).extend(EventBroker);

    Layout.prototype.showView = function(view) {
      return view.el.open();
    };

    return Layout;

  })();

}).call(this);
}, "tb/chaplin/views/layout_manager": function(exports, require, module) {(function() {
  var EventBroker, LayoutManager, utils;

  EventBroker = require('chaplin/lib/event_broker');

  utils = require('chaplin/lib/utils');

  module.exports = LayoutManager = (function() {

    LayoutManager.extend = Backbone.Model.extend;

    _(LayoutManager.prototype).extend(EventBroker);

    function LayoutManager() {
      this.layouts = {};
      this.views = [];
      this.initialize.apply(this, arguments);
    }

    LayoutManager.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.settings = _(options).defaults({
        layoutPath: 'layouts/',
        layoutSuffix: ''
      });
      return this.subscribeEvent('startupController', this.showNewView);
    };

    LayoutManager.prototype.showNewView = function(context) {
      var view, _ref,
        _this = this;
      if (this.layout = this.loadLayout(context.layout)) {
        view = (_ref = context.controller) != null ? _ref.view : void 0;
        this.layout.showView(view);
        this.views.push(view);
        return view.delegateEvents({
          close: function() {
            _this.views = _.without(_this.views, view);
            return view.dispose();
          }
        });
      }
    };

    LayoutManager.prototype.loadLayout = function(name) {
      var fileName, layout, layoutModule, moduleName;
      if (name == null) {
        name = this.settings["default"];
      }
      if (layout = this.layouts[name]) {
        return layout;
      } else {
        fileName = utils.underscorize(name) + this.settings.layoutSuffix;
        moduleName = this.settings.layoutPath + fileName;
        layoutModule = require(moduleName);
        return this.layouts[name] = new layoutModule;
      }
    };

    LayoutManager.prototype.disposed = false;

    LayoutManager.prototype.dispose = function() {
      var layout, name, view, _i, _len, _ref, _ref1;
      if (this.disposed) {
        return;
      }
      _ref = this.layouts;
      for (name in _ref) {
        layout = _ref[name];
        layout.dispose();
      }
      _ref1 = this.views;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.dispose();
      }
      this.unsubscribeAllEvents();
      delete this.layout;
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return LayoutManager;

  })();

}).call(this);
}, "tb/index": function(exports, require, module) {(function() {
  var global;

  global = this;

  global.document = {};

  module.exports = {
    load: function(options) {
      if (options == null) {
        options = {};
      }
      Backbone.$ = require('./lib/ti').$;
      _.extend(Backbone.Stickit, require('./lib/stickit'));
      if (options.styles) {
        require('./lib/styler').load(options.styles);
      }
      return {
        $: Backbone.$
      };
    }
  };

}).call(this);
}, "tb/lib/stickit": function(exports, require, module) {(function() {

  module.exports = {
    isObservable: function($el) {
      var _ref;
      return (_ref = $el[0]._viewName) === 'TextField' || _ref === 'TextArea' || _ref === 'Switch' || _ref === 'SearchBar' || _ref === 'Slider';
    },
    updateEl: function($el, val, config) {
      var updateMethod;
      updateMethod = config.updateMethod || 'text';
      if (this.isObservable($el)) {
        return $el.val(val);
      } else {
        return $el[updateMethod](val);
      }
    },
    getElVal: function($el) {
      if (this.isObservable($el)) {
        return $el.val();
      }
    }
  };

}).call(this);
}, "tb/lib/styler": function(exports, require, module) {(function() {
  var mergeAttributes, mini;

  mini = require('tb/lib/ti/helpers/mini');

  mergeAttributes = function(el, attributes, newAttributes, priority) {
    var existing, hasInlineAttribute, key, value, _results;
    _results = [];
    for (key in newAttributes) {
      value = newAttributes[key];
      if (_.isObject(value) && value.important) {
        priority += 1000;
        value = value.value;
      }
      if (existing = attributes[key]) {
        if (priority >= existing.priority) {
          existing.value = value;
          _results.push(existing.priority = priority);
        } else {
          _results.push(void 0);
        }
      } else {
        hasInlineAttribute = _.include(el._inlineAttributes, key);
        if (!(hasInlineAttribute && priority <= 100)) {
          _results.push(attributes[key] = {
            value: value,
            priority: priority
          });
        } else {
          _results.push(void 0);
        }
      }
    }
    return _results;
  };

  module.exports = {
    load: function(styles) {
      this.styles = styles;
    },
    reset: function() {
      return this.styles = null;
    },
    shallowStyles: function(viewName) {
      var _ref, _ref1;
      return ((_ref = this.styles) != null ? (_ref1 = _ref[viewName]) != null ? _ref1.rules : void 0 : void 0) || {};
    },
    stylesForView: function(el) {
      var attributes, rules, selector, selectorRules, selectors, viewStyles, _i, _len, _ref;
      attributes = {};
      if (viewStyles = (_ref = this.styles) != null ? _ref[el._viewName] : void 0) {
        if (viewStyles.rules) {
          mergeAttributes(el, attributes, viewStyles.rules, 0);
        }
        if (selectors = viewStyles.selectors) {
          for (_i = 0, _len = selectors.length; _i < _len; _i++) {
            selectorRules = selectors[_i];
            rules = selectorRules.rules, selector = selectorRules.selector;
            if (mini.is(selector, el)) {
              mergeAttributes(el, attributes, rules, selector.split(/\s/).length);
            }
          }
        }
        return _.reduce(attributes, function(out, val, key) {
          out[key] = val.value;
          return out;
        }, {});
      }
    }
  };

}).call(this);
}, "tb/lib/ti/README": function(exports, require, module) {module.exports = '<h1>Current API supported by our custom $</h1>\n\n<h2>Extend:</h2>\n\n<h3>$()</h3>\n\n<ul>\n<li><strong>$(el)</strong>: Creates an array-like <code>ElementCollection</code> which the provided element (such as a Titanium View) as the first element of the collection.</li>\n<li><strong>$(\'&lt;<em>viewName</em>>\')</strong>: Creates a new Titanium View based on the provided viewName and adds it to a new ElementCollection. For example:\n<ul><li><code>$(\'&lt;View&gt;\')</code> creates a new <a href="http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.View">Titanium.UI.View</a></li>\n<li><code>$(\'&lt;Button&gt;\')</code> creates a new <a href="http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.Button">Titanium.UI.Button</a></li>\n<li><code>$(\'&lt;iPhone::NavigationGroup\')</code> creates a new <a href="http://docs.appcelerator.com/titanium/latest/#!/api/Titanium.UI.iPhone.NavigationGroup">Titanium.UI.iPhone.NavigationGroup</a></li>\n<li><code>$(\'&lt;View&gt;&lt;Button height="20"&gt;Click Me!&lt;/Button&gt;&lt;/View&gt;\')</code> creates a View with a nested Button with a height attribute and title of \'Click Me!\'. This XML can be nested to any depth.</li></ul></li>\n<li><strong>$()</strong> or <strong>$(undefined)</strong>: Creates an empty ElementCollection</li>\n</ul>\n\n<h2>Attributes:</h2>\n\n<h3>.attr</h3>\n\n<p><strong>Note:</strong> <code>class</code> is a reserved keyword in Javascript, so the <code>.attr</code> method will transparently change any <code>class</code> key passed to <code>.attr</code> to <code>_class</code>.</p>\n\n<ul>\n<li><strong>$(el).attr(key)</strong>: Return the attribute specified by <code>key</code> for the first element in the collection.</li>\n<li><strong>$(el).attr(key, value)</strong>: Set the attribute specified by <code>key</code> to <code>value</code> for each element in the collection.</li>\n<li><strong>$(el).attr(key, null)</strong>: Remove the attribute specified by <code>key</code> for each element in the collection.</li>\n<li><ul><li><strong>$(el).attr(attrHash)</strong>: Sets the attributes specified by <code>attrHash</code> for each element in the collection.</li></ul></li>\n</ul>\n\n<h3>.removeAttr</h3>\n\n<ul>\n<li><strong>$(el).removeAttr(key)</strong>: Remove the attribute specified by <code>key</code> for each element in the collection.</li>\n</ul>\n\n<h3>.hasClass</h3>\n\n<ul>\n<li><strong>$(el).hasClass(className)</strong>: Determine whether any of the matched elements are assigned the given class.</li>\n</ul>\n\n<h3>.addClass</h3>\n\n<ul>\n<li><strong>$(el).addClass(className)</strong>: Adds the specified class(es) to each of the set of matched elements.</li>\n</ul>\n\n<h3>.removeClass</h3>\n\n<ul>\n<li><strong>$(el).removeClass(className)</strong>: Remove a single class, multiple classes, or all classes from each element in the set of matched elements.</li>\n</ul>\n\n<h3>.text</h3>\n\n<p>The <code>text</code> method will set or get the appropriate attribute depending on the view type. For example, it will act against a Label\'s <code>text</code> attribute but a Button\'s <code>title</code> attribute.</p>\n\n<ul>\n<li>**$(el).text(newValue): Sets the text content of el.</li>\n<li><strong>$(el).text()</strong>: Returns the text content of el</li>\n</ul>\n\n<h2>Events:</h2>\n\n<h3>.on (alias \'bind\')</h3>\n\n<ul>\n<li><strong>$(el).on(event, handler)</strong>: Binds <code>handler</code> to <code>event</code>.</li>\n<li><strong>$(el).on(event, selector, handler)</strong>: Binds <code>handler</code> to the <code>event</code> on the closest element to <code>el</code> that matches <code>selector</code>.</li>\n</ul>\n\n<h3>.off (alias \'unbind\')</h3>\n\n<ul>\n<li><strong>$(el).off(event, handler)</strong>: Removes binding of <code>handler</code> to <code>event</code>.</li>\n<li><strong>$(el).off(event, selector, handler)</strong>: Removes binding of <code>handler</code> to the <code>event</code> on the closest element to <code>el</code> that matches <code>selector</code>.</li>\n<li><strong>$(el).off(event)</strong>: Removes all <code>event</code> handlers on <code>el</code>.</li>\n<li><strong>$(el).off()</strong>: Removes all bindings on <code>el</code>.</li>\n</ul>\n\n<h3>.delegate</h3>\n\n<ul>\n<li><strong>$(el).delegate(selector, event, handler)</strong>: Attach a <code>handler</code> to an <code>event</code> for all elements that match the <code>selector</code>, now or in the future, and are descendants of <code>el</code>.</li>\n</ul>\n\n<h3>.undelegate</h3>\n\n<ul>\n<li><strong>$(el).undelegate(selector, event, handler)</strong>: Remove a <code>handler</code> from the <code>event</code> for all elements which match the <code>selector</code> and are descendants of <code>el</code>.</li>\n</ul>\n\n<h3>.trigger</h3>\n\n<ul>\n<li><strong>$(el).trigger(event, extraParameters)</strong>: Execute all handlers and behaviors attached to the matched elements for the given event type.</li>\n</ul>\n\n<h3>.triggerHandler</h3>\n\n<ul>\n<li><strong>$(el).triggerHandler(event, extraParameters)</strong>: Execute all handlers attached to an element for an event.</li>\n</ul>\n\n<h2>Manipulation:</h2>\n\n<h3>.append</h3>\n\n<ul>\n<li><strong>$(el).append(<em>childEl</em>)</strong>: Insert content, specified by the <code>childEl</code> parameter, to the end of each element in the set of matched elements. <code>childEl</code> can be an existing element, an element collection, or a string used to create a new element (such as <code>&lt;View&gt;</code>).</li>\n</ul>\n\n<h3>.appendTo</h3>\n\n<ul>\n<li><strong>$(el).appendTo(<em>parentEl</em>)</strong>: Append the <code>el</code> to <code>parentEl</code>. <code>parentEl</code> can be an existing element or an element collection (in which case the <code>el</code> will be appended to the first child).</li>\n</ul>\n\n<h3>.remove</h3>\n\n<ul>\n<li><strong>$(el).remove()</strong>: Remove <code>el</code> from its parent if it has one.</li>\n</ul>\n\n<h3>.empty</h3>\n\n<ul>\n<li><strong>$(el).empty()</strong>: Remove all children from <code>el</code>.</li>\n</ul>\n\n<h3>.html</h3>\n\n<ul>\n<li><strong>$(el).html(<em>childEl</em>)</strong>: Replace the contents of el with childEl. This essentially combines $.empty() and $.append() and, while the name may not be optimal for this context (what is \'html\' in Titanium?) it allows easier use of other Backbone libraries.</li>\n</ul>\n\n<h3>.show</h3>\n\n<ul>\n<li><strong>$(el).show()</strong>: Show each element in the ElementCollection (<code>el</code> in this example).</li>\n</ul>\n\n<h3>.hide</h3>\n\n<ul>\n<li><strong>$(el).hide()</strong>: Hide each element in the ElementCollection (<code>el</code> in this example).</li>\n</ul>\n\n<h2>Traversal</h2>\n\n<h3>.each</h3>\n\n<ul>\n<li><strong>$(el).each(fn)</strong>: Iterate over an ElementCollection, executing a function (<code>fn</code>) for each matched element.</li>\n</ul>\n\n<h3>.find</h3>\n\n<ul>\n<li><strong>$(el).find(selector)</strong>: Return an ElementCollection whose elements match the elements in the existing ElementCollection that match the provided selector.</li>\n</ul>\n\n<h3>.map</h3>\n\n<ul>\n<li><strong>$(el).map(fn)</strong>: Pass each element in the current matched set through a function (<code>fn</code>), producing a new ElementCollection containing the return values.</li>\n</ul>\n\n<h3>.get</h3>\n\n<ul>\n<li><strong>$(el).get()</strong>: Returns an array of all elements in the ElementCollection.</li>\n<li><strong>$(el).get(index)</strong>: Returns the element (such as a Titanium View) at the specified index.</li>\n</ul>\n\n<h3>.children</h3>\n\n<ul>\n<li><strong>$(el).children()</strong>: Returns an array of all child views of the ElementCollection. <em>Note: The returned children are NOT wrapped in an ElementCollection.</em></li>\n</ul>\n\n<h3>.parent</h3>\n\n<ul>\n<li><strong>$(el).parent()</strong>: Get the parent of each element in the current ElementCollection. <em>Note: The returned parent IS wrapped in an ElementCollection.</em></li>\n</ul>\n\n<h3>.is</h3>\n\n<ul>\n<li><p><strong>$(el).is(selector)</strong>: Returns a boolean indicating whether all elements in the current ElementCollection (<code>el</code> in this case) match the provided selector. This currently supports the following selectors:</p>\n\n<ul><li><em>.someClass</em>: matches el with <code>_class=\'someClass\'</code></li>\n<li><em>#someId</em>: matches el with <code>id=\'someId\'</code></li>\n<li><em>View</em> # matches el with <code>_viewName=\'View\'</code>. <em><code>_viewName</code> (or an equivalent) is not provided by Titanium, at least not in a way that I\'ve been able to find, so this attribute is added by ti.createView.</em></li>\n<li><em>View.someClass</em>: matches el with <code>viewName=\'View\'</code> and <code>_class=\'someClass\'</code></li></ul></li>\n</ul>\n\n<h3>.closest</h3>\n\n<ul>\n<li><strong>$(el).closest(selector)</strong>: For each element in the set, get the first element that matches the <code>selector</code> by testing the element itself and traversing up through its ancestors.</li>\n</ul>';}, "tb/lib/ti/ajax/handlers": function(exports, require, module) {(function() {

  module.exports = {
    handleResponses: function(s, xhr, responses) {
      var contents, ct, dataTypes, finalDataType, firstDataType, matcher, responseFields, type, value;
      ct = void 0;
      firstDataType = void 0;
      finalDataType = void 0;
      contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields;
      for (type in responseFields) {
        value = responseFields[type];
        if (type in responses) {
          xhr[responseFields[type]] = responses[type];
        }
      }
      while (dataTypes[0] === '*') {
        dataTypes.shift();
        if (ct == null) {
          ct = s.mimeType || xhr.getResponseHeader('Content-Type');
        }
      }
      if (ct) {
        for (type in contents) {
          matcher = contents[type];
          if (matcher != null ? matcher.test(ct) : void 0) {
            dataTypes.unshift(type);
            break;
          }
        }
      }
      if (responses[dataTypes[0]]) {
        finalDataType = dataTypes[0];
      } else {
        for (type in responses) {
          value = responses[type];
          if ((!dataTypes[0]) || s.converters["" + type + " " + dataTypes[0]]) {
            finalDataType = type;
            break;
          }
          if (!firstDataType) {
            firstDataType = type;
          }
        }
        if (finalDataType == null) {
          finalDataType = firstDataType;
        }
      }
      if (finalDataType) {
        if (finalDataType !== dataTypes[0]) {
          dataTypes.unshift(finalDataType);
        }
        return responses[finalDataType];
      }
    },
    convert: function(s, response) {
      var conv, conv2, converter, converters, current, dataTypes, i, name, prev, tmp, _i, _len, _ref;
      dataTypes = s.dataTypes.slice();
      prev = dataTypes[0];
      converters = {};
      conv = void 0;
      conv2 = void 0;
      i = 0;
      if (s.dataFilter) {
        response = s.dataFilter(response, s.dataType);
      }
      if (dataTypes[1]) {
        _ref = s.converters;
        for (name in _ref) {
          converter = _ref[name];
          converters[name.toLowerCase()] = converter;
        }
      }
      while (current = dataTypes[++i]) {
        if (current !== '*') {
          if (!(prev === '*' || prev === current)) {
            conv = converters["" + prev + " " + current] || converters["* " + current];
            if (!conv) {
              for (_i = 0, _len = converters.length; _i < _len; _i++) {
                conv2 = converters[_i];
                tmp = conv2.split(" ");
                if (tmp[1] === current) {
                  conv = converters["" + prev + " " + tmp[0]] || converters["* " + tmp[0]];
                  if (conv) {
                    if (conv === true) {
                      conv = converters[conv2];
                    } else if (converters[conv2] !== true) {
                      current = tmp[0];
                      dataTypes.splice(i--, 0, current);
                    }
                    break;
                  }
                }
              }
            }
            if (conv !== true) {
              if (conv && s["throws"]) {
                response = conv(response);
              } else {
                try {
                  response = conv(response);
                } catch (error) {
                  response = {
                    state: "parsererror",
                    error: conv ? error : "No conversion from " + prev + " to " + current
                  };
                  return response;
                }
              }
            }
          }
        }
        prev = current;
      }
      return {
        state: 'success',
        data: response
      };
    }
  };

}).call(this);
}, "tb/lib/ti/ajax/index": function(exports, require, module) {(function() {
  var ajaxExtend, ajax_nonce, ajax_rquery, callbackContext, etagCache, handlers, lastModifiedCache, rnoContent, rprotocol, rts, rurl, statusCode;

  handlers = require('./handlers');

  ajax_nonce = Date.now();

  rts = /([?&])_=[^&]*/;

  ajax_rquery = /\?/;

  rnoContent = /^(?:GET|HEAD)$/;

  rprotocol = /^\/\//;

  rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;

  lastModifiedCache = {};

  etagCache = {};

  callbackContext = null;

  statusCode = null;

  ajaxExtend = function(target, src) {
    var deep, flatOptions, key, value, _target;
    deep = null;
    flatOptions = $.ajaxSettings.flatOptions || {};
    for (key in src) {
      value = src[key];
      if (value != null) {
        _target = flatOptions[key] ? target : (deep != null ? deep : deep = {});
        _target[key] = value;
      }
    }
    if (deep) {
      jQuery.extend(true, target, deep);
    }
    return target;
  };

  _.extend($, {
    ajaxSettings: {
      type: 'GET',
      accepts: {
        '*': '*/*',
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText"
      },
      async: true,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      converters: {
        '* text': String,
        'text html': true,
        'text json': JSON.parse,
        'text xml': String
      },
      flatOptions: {
        url: true,
        context: true
      },
      processData: true
    },
    ajaxSetup: function(target, settings) {
      if (settings) {
        return ajaxExtend(ajaxExtend(target, $.ajaxSettings), settings);
      } else {
        return ajaxExtend($.ajaxSettings, target);
      }
    },
    ajaxConvert: function(type, text) {
      var converter;
      converter = this.ajaxSettings.converters[type] || _.identity;
      try {
        return typeof converter === "function" ? converter(text) : void 0;
      } catch (e) {
        return '[Parse error]';
      }
    },
    ajax: function(url, options) {
      var accept, cacheURL, callback, client, completeDeferred, dataType, deferred, done, etag, firstType, handleClientResponse, key, name, password, requestHeaders, s, state, strAbort, timestamp, username, value, xhr, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      if (options == null) {
        options = {};
      }
      if (_.isObject(url)) {
        options = url;
        url = void 0;
      }
      requestHeaders = {};
      client = null;
      state = 0;
      xhr = {
        readyState: 0,
        _requestHeader: function(name) {
          return requestHeaders[name];
        },
        setRequestHeader: function(name, value) {
          return requestHeaders[name] = value;
        },
        getResponseHeader: function(name) {
          var _ref;
          return (_ref = this.headers) != null ? _ref[name] : void 0;
        },
        statusCode: function(map) {
          var code, status, statusHandler;
          if (map) {
            if (state < 2) {
              for (code in map) {
                status = map[code];
                statusCode[code] = [statusCode[code], status];
              }
            } else {
              if (statusHandler = map[xhr.status]) {
                xhr.always(statusHandler);
              }
            }
          }
          return this;
        },
        abort: function(statusText) {
          var finalText;
          finalText = statusText || strAbort;
          if (client != null) {
            client.abort();
          }
          done(0, statusText);
          return this;
        }
      };
      deferred = $.Deferred();
      completeDeferred = $.Callbacks('once memory');
      deferred.promise(xhr).complete = completeDeferred.add;
      xhr.success = xhr.done;
      xhr.error = xhr.fail;
      done = function(status, nativeStatusText, responses, headers) {
        var error, isSuccess, modified, response, statusText, success;
        if (state === 2) {
          return;
        }
        state = 2;
        isSuccess = null;
        client = null;
        statusText = nativeStatusText;
        response = null;
        xhr.headers = headers;
        if (responses) {
          response = handlers.handleResponses(s, xhr, responses);
        }
        if (status >= 200 && status < 300 || status === 304) {
          if (s.ifModified) {
            if (modified = xhr.getResponseHeader('Last-Modified')) {
              lastModifiedCache[cacheURL] = modified;
            }
            if (modified = xhr.getResponseHeader('etag')) {
              etagCache[cacheURL] = modified;
            }
          }
          if (status === 304) {
            isSuccess = true;
            statusText = 'notmodified';
          } else {
            isSuccess = handlers.convert(s, response);
            statusText = isSuccess.state;
            success = isSuccess.data;
            error = isSuccess.error;
            isSuccess = !error;
          }
        } else {
          error = statusText;
          if (status || !statusText) {
            statusText = 'error';
            if (status < 0) {
              status = 0;
            }
          }
        }
        xhr.status = status;
        xhr.statusText = (nativeStatusText || statusText) + "";
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [success, statusText, xhr]);
        } else {
          deferred.rejectWith(callbackContext, [xhr, statusText, error]);
        }
        xhr.statusCode(statusCode);
        statusCode = void 0;
        return completeDeferred.fireWith(callbackContext, [xhr, statusText]);
      };
      s = $.ajaxSetup({}, options);
      s.url = url || s.url;
      strAbort = 'canceled';
      dataType = (_ref = options.dataType) != null ? _ref : 'text';
      s.type = options.method || options.type || s.method || s.type;
      s.dataTypes = (s.dataType || '*').trim().toLowerCase().match(/\S+/g);
      if (s.data && s.processData && !_.isString(s.data)) {
        s.data = $.param(s.data, s.traditional);
      }
      _ref1 = s.headers;
      for (name in _ref1) {
        value = _ref1[name];
        xhr.setRequestHeader(name, value);
      }
      s.hasContent = !rnoContent.test(s.type);
      callbackContext = s.context || s;
      statusCode = s.statusCode || {};
      _ref2 = ['success', 'error', 'complete'];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        callback = _ref2[_i];
        xhr[callback](s[callback]);
      }
      cacheURL = s.url;
      if (!s.hasContent) {
        if (s.data) {
          cacheURL = s.url += ajax_rquery.test(cacheURL) ? "&" : "?" + s.data;
          delete s.data;
        }
        if (s.cache === false) {
          s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + (ajax_nonce++)) : cacheURL + (ajax_rquery.test(cacheURL) ? "&" : "?") + "_=" + ajax_nonce++;
        }
      }
      if (s.ifModified) {
        if (timestamp = lastModifiedCache[cacheURL]) {
          xhr.setRequestHeader('If-Modified-Since', timestamp);
        }
        if (etag = etagCache[cacheURL]) {
          xhr.setRequestHeader('If-None-Match', etag);
        }
      }
      handleClientResponse = function() {
        var headers, responses, _ref3;
        headers = _.clone(this.getResponseHeaders());
        responses = {};
        if ((_ref3 = headers['Content-Type']) != null ? _ref3.match(/xml/) : void 0) {
          responses.xml = this.responseXML;
        } else {
          responses.text = this.responseText;
        }
        return done(this.status, this.statusText, responses, headers);
      };
      client = Ti.Network.createHTTPClient({
        onload: function(e) {
          return handleClientResponse.call(this);
        },
        onerror: function(e) {
          return handleClientResponse.call(this);
        },
        timeout: s.timeout
      });
      if (username = s.username) {
        client.username = username;
      }
      if (password = s.password) {
        client.password = password;
      }
      client.open(s.type, s.url, s.async);
      if (s.xhrFields) {
        _ref3 = s.xhrFields;
        for (key in _ref3) {
          value = _ref3[key];
          client[key] = value;
        }
      }
      if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
        xhr.setRequestHeader("Content-Type", s.contentType);
      }
      xhr.setRequestHeader('Accept', (firstType = s.dataTypes[0]) && s.accepts[s.dataTypes[0]] ? (accept = s.accepts[firstType], firstType !== '*' ? "" + accept + ", */*; q=0.01" : accept) : s.accepts['*']);
      if (((_ref4 = s.beforeSend) != null ? _ref4.call(callbackContext, xhr, s) : void 0) === false) {
        return xhr.abort();
      }
      for (key in requestHeaders) {
        value = requestHeaders[key];
        client.setRequestHeader(key, value);
      }
      state = 1;
      if (options.data) {
        client.send(options.data);
      } else {
        client.send();
      }
      return xhr;
    }
  });

}).call(this);
}, "tb/lib/ti/attributes": function(exports, require, module) {(function() {
  var matchers, values;

  matchers = require('./helpers/matchers');

  values = require('./helpers/values');

  module.exports = {
    attr: function(name, value) {
      var properties;
      if (_.isString(name)) {
        if (name === 'class') {
          name = '_class';
        }
        if (value === null) {
          this.each(function() {
            return delete this[name];
          });
        } else if (value != null) {
          this.each(function() {
            return this[name] = values.convertTi(value);
          });
        } else {
          return this[0][name];
        }
      } else if (_.isObject(name)) {
        properties = name;
        if (_.has(properties, 'class')) {
          properties._class = properties["class"];
          delete properties["class"];
        }
        this.each(function() {
          return this.applyProperties(values.convertTi(properties));
        });
      }
      return this;
    },
    removeAttr: function(name) {
      return this.attr(name, null);
    },
    addClass: function(newNames) {
      var $el, classList, existingClass, newClass, newName, _i, _len, _ref;
      $el = $(this);
      existingClass = $el.attr('class');
      classList = [];
      _ref = newNames.split(/\s+/g);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        newName = _ref[_i];
        if (!$el.hasClass(newName)) {
          classList.push(newName);
        }
      }
      classList = classList.join(' ');
      newClass = existingClass ? "" + existingClass + " " + classList : classList;
      return this.attr('class', newClass);
    },
    removeClass: function(classNames) {
      var classList, className, _i, _len, _ref;
      if (!classNames) {
        return this.attr('class', '');
      }
      if (classList = this.attr('class')) {
        _ref = classNames.split(/\s+/g);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          className = _ref[_i];
          classList = classList.replace(matchers.classRE(className), " ");
        }
        return this.attr('class', classList.trim());
      } else {
        return this;
      }
    },
    hasClass: function(className) {
      return _.some(this, function(el) {
        return matchers.hasClass(el, className);
      });
    },
    text: function(text) {
      var el, getKey;
      getKey = function(el) {
        var key;
        return key = (function() {
          switch (el._viewName) {
            case 'Button':
              return 'title';
            default:
              return 'text';
          }
        })();
      };
      if (text != null) {
        return this.each(function() {
          var key;
          key = getKey(this);
          if (text === null) {
            return delete this[key];
          } else {
            return this[key] = text;
          }
        });
      } else {
        if (el = this[0]) {
          return el[getKey(el)];
        }
      }
    },
    val: function(value) {
      var _ref;
      if (value != null) {
        return this.each(function() {
          return this.setValue(value);
        });
      } else {
        return (_ref = this[0]) != null ? _ref.getValue() : void 0;
      }
    }
  };

}).call(this);
}, "tb/lib/ti/builder": function(exports, require, module) {(function() {
  var NESTED_TAG_OR_VALID_XML, SIMPLE_TAG, styler;

  styler = require('tb/lib/styler');

  SIMPLE_TAG = /^<([\w\:]*)\s?\/?>$/;

  NESTED_TAG_OR_VALID_XML = /<(.*)>(\s*)<|\//;

  module.exports = function(ti) {
    return {
      buildView: function($, node) {
        var attr, attrHash, attrIndex, attrName, attributes, child, children, index, nestedView, view, _i, _j, _k, _len, _ref, _ref1, _ref2, _results;
        children = node.childNodes;
        _results = [];
        for (index = _i = 0, _ref = children.length; 0 <= _ref ? _i < _ref : _i > _ref; index = 0 <= _ref ? ++_i : --_i) {
          child = children.item(index);
          if (child.nodeType === child.TEXT_NODE) {
            _results.push(child.nodeValue);
          } else {
            attributes = child.attributes;
            attrHash = {};
            for (attrIndex = _j = 0, _ref1 = attributes.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; attrIndex = 0 <= _ref1 ? ++_j : --_j) {
              attr = attributes.item(attrIndex);
              attrName = attr.name;
              if (attrName === 'class') {
                attrName = '_class';
              }
              attrHash[attrName] = attr.value;
            }
            view = ti.createView(child.nodeName, attrHash);
            view._inlineAttributes = _.keys(attrHash);
            _ref2 = this.buildView($, child);
            for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
              nestedView = _ref2[_k];
              if (_.isString(nestedView)) {
                $(view).text(nestedView);
              } else {
                $(view).append(nestedView);
              }
            }
            _results.push(view);
          }
        }
        return _results;
      },
      buildFromXml: function($, xml) {
        var attributes, doc, match, tagName;
        if (match = xml.match(SIMPLE_TAG)) {
          tagName = match[1];
          attributes = tagName === 'Window' ? styler.shallowStyles('Window') : {};
          return $(ti.createView(tagName, attributes));
        } else {
          if (!NESTED_TAG_OR_VALID_XML.test(xml)) {
            xml = xml.replace(/\>$/, " />");
          }
          doc = Ti.XML.parseString("<root xmlns:iPhone='tb.iPhone' xmlns:iOS='tb.iOS' xmlns:iPad='tb.iOS'>" + xml + "</root>");
          return $(this.buildView($, doc));
        }
      }
    };
  };

}).call(this);
}, "tb/lib/ti/events": function(exports, require, module) {(function() {
  var add, findHandlers, handlers, matcherFor, myId, parse, remove;

  handlers = {};

  myId = function(element) {
    var _ref;
    return (_ref = element._eventId) != null ? _ref : element._eventId = _.uniqueId('event_element_');
  };

  matcherFor = function(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
  };

  parse = function(event) {
    var parts;
    parts = String(event).split('.');
    return {
      e: parts[0],
      ns: parts.slice(1).sort().join(' ')
    };
  };

  findHandlers = function(element, event, fn, selector) {
    var matcher;
    event = parse(event);
    if (event.ns) {
      matcher = matcherFor(event.ns);
    }
    return _.filter(handlers[myId(element)] || [], function(handler) {
      return handler && ((!event.e) || handler.e === event.e) && ((!event.ns) || matcher.test(handler.ns)) && ((!fn) || myId(handler.fn) === myId(fn)) && ((!selector) || handler.sel === selector);
    });
  };

  add = function(element, event, fn, selector, getDelegate) {
    var callback, handler, id, set, _ref;
    id = myId(element);
    set = (_ref = handlers[id]) != null ? _ref : handlers[id] = [];
    handler = parse(event);
    handler.fn = fn;
    handler.sel = selector;
    handler.del = typeof getDelegate === "function" ? getDelegate(fn, event) : void 0;
    callback = handler.del || fn;
    handler.proxy = function(e) {
      if (e == null) {
        e = {};
      }
      callback.apply(element, [e].concat(e.data));
    };
    handler.index = set.length;
    set.push(handler);
    return element.addEventListener(handler.e, handler.proxy);
  };

  remove = function(element, event, fn, selector) {
    var handler, id, _i, _len, _ref, _results;
    id = myId(element);
    _ref = findHandlers(element, event, fn, selector);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      handler = _ref[_i];
      delete handlers[id][handler.index];
      _results.push(element.removeEventListener(handler.e, handler.proxy));
    }
    return _results;
  };

  module.exports = {
    bind: function(event, selector, callback) {
      if (!selector || _.isFunction(selector)) {
        if (callback == null) {
          callback = selector;
        }
        return this.each(function(element) {
          return add(element, event, callback);
        });
      } else {
        return this.delegate(selector, event, callback);
      }
    },
    delegate: function(selector, event, callback) {
      return this.each(function(element) {
        return add(element, event, callback, selector, function(fn) {
          return function(e) {
            var evt, match;
            if (match = $(e != null ? e.source : void 0).closest(selector, element).get(0)) {
              evt = _.extend(e, {
                currentTarget: match
              });
              return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
            }
          };
        });
      });
    },
    undelegate: function(selector, event, callback) {
      return this.each(function(element) {
        return remove(element, event, callback, selector);
      });
    },
    on: function(event, selector, callback) {
      return this.bind(event, selector, callback);
    },
    unbind: function(event, selector, callback) {
      if (!selector || _.isFunction(selector)) {
        if (callback == null) {
          callback = selector;
        }
        return this.each(function(element) {
          return remove(element, event, callback);
        });
      }
    },
    off: function(event, callback) {
      return this.unbind(event, callback);
    },
    trigger: function(event, data) {
      return this.each(function(element) {
        return element.fireEvent(event, {
          data: data
        });
      });
    },
    triggerHandler: function(event, data) {
      return this.each(function(element) {
        var handler, _i, _len, _ref, _results;
        _ref = findHandlers(element, event);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          _results.push(handler.proxy(data));
        }
        return _results;
      });
    }
  };

}).call(this);
}, "tb/lib/ti/extend": function(exports, require, module) {(function() {
  var ElementCollection, global;

  ElementCollection = function(collection) {
    collection = collection || [];
    collection.__proto__ = arguments.callee.prototype;
    return collection;
  };

  global = this;

  module.exports = function(ti) {
    var $, builder, extensions, fn, name, _ref;
    builder = require('./builder')(ti);
    $ = global.$ = function(element) {
      if (element instanceof ElementCollection) {
        return element;
      } else if (_.isString(element)) {
        return builder.buildFromXml($, element);
      } else {
        if (element) {
          return ElementCollection(_.isArray(element) ? element : [element]);
        } else {
          return ElementCollection([]);
        }
      }
    };
    $.Deferred = jQuery.Deferred;
    $.Callbacks = jQuery.Callbacks;
    $.param = jQuery.param;
    extensions = (function() {
      var _i, _len, _ref, _results;
      _ref = ['ajax', 'events', 'manipulation', 'traversal', 'attributes'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(require("./" + name));
      }
      return _results;
    })();
    fn = (_ref = _({})).extend.apply(_ref, extensions);
    ElementCollection.prototype = fn;
    return $;
  };

}).call(this);
}, "tb/lib/ti/helpers/matchers": function(exports, require, module) {
/*
 Partially extracted from https://github.com/padolsey/mini/blob/master/mini.js
 "mini" Selector Engine
 Copyright (c) 2009 James Padolsey
 -------------------------------------------------------
 Dual licensed under the MIT and GPL licenses.
    - http://www.opensource.org/licenses/mit-license.php
    - http://www.gnu.org/copyleft/gpl.html
 -------------------------------------------------------
 Version: 0.01 (BETA)
*/


(function() {
  var classCache, classRE, exprAttributeComponents, exprAttributePresence, exprAttributes, exprClassName, exprId, exprNodeName, hasAttributes, hasClass, hasNameClassAttrs, isIdNameClass, isParsedSelector, matches, parseSelector;

  exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/;

  exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/;

  exprNodeName = /^([\w\*\-_]+)/;

  exprAttributes = /^(?:[\w\-_]+)?\[(.*)\]/;

  exprAttributePresence = /^(\w*)$/;

  exprAttributeComponents = /^(\w*)([!^*$~|]?\=)[\"\'](\w*)[\"\']/;

  classCache = {};

  classRE = function(name) {
    var _ref;
    return (_ref = classCache[name]) != null ? _ref : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
  };

  hasClass = function(el, className) {
    return classRE(className).test(el._class);
  };

  hasAttributes = function(el, attributes) {
    var attr, comparison, match, original, value;
    if (exprAttributePresence.test(attributes)) {
      return _.has(el, attributes);
    }
    if (match = attributes.match(exprAttributeComponents)) {
      original = match[0], attr = match[1], comparison = match[2], value = match[3];
      switch (comparison) {
        case '=':
          return el[attr] === value;
        case '!=':
          return el[attr] !== value;
        case '^=':
          return (new RegExp("^" + value)).test(el[attr]);
        case '$=':
          return (new RegExp("" + value + "$")).test(el[attr]);
        case '*=':
          return (new RegExp(value)).test(el[attr]);
        case '~=':
          return (new RegExp("\\b" + value + "\\b")).test(el[attr]);
        case '|=':
          return (new RegExp("^" + value + "(-|$)")).test(el[attr]);
        default:
          return false;
      }
    }
    return false;
  };

  hasNameClassAttrs = function(el, nodeName, className, attributes) {
    var matches;
    matches = !nodeName || (nodeName === '*') || el._viewName === nodeName;
    matches = matches && (!className || hasClass(el, className));
    return matches && (!attributes || hasAttributes(el, attributes));
  };

  parseSelector = function(selector) {
    var attributes, className, id, nodeName, _ref, _ref1, _ref2, _ref3;
    id = (_ref = selector.match(exprId)) != null ? _ref[1] : void 0;
    className = !id && ((_ref1 = selector.match(exprClassName)) != null ? _ref1[1] : void 0);
    nodeName = !id && ((_ref2 = selector.match(exprNodeName)) != null ? _ref2[1] : void 0);
    attributes = !id && ((_ref3 = selector.match(exprAttributes)) != null ? _ref3[1] : void 0);
    return {
      id: id,
      className: className,
      nodeName: nodeName,
      attributes: attributes
    };
  };

  isIdNameClass = function(el, id, nodeName, className, attributes) {
    var matches;
    matches = (!id) || el.id === id;
    return matches && hasNameClassAttrs(el, nodeName, className, attributes);
  };

  isParsedSelector = function(el, selectorParts) {
    var attributes, className, id, matches, nodeName;
    id = selectorParts.id, nodeName = selectorParts.nodeName, className = selectorParts.className, attributes = selectorParts.attributes;
    matches = (!id) || el.id === id;
    return matches && hasNameClassAttrs(el, nodeName, className, attributes);
  };

  matches = function(el, selector) {
    return isParsedSelector(el, parseSelector(selector));
  };

  module.exports = {
    classRE: classRE,
    hasClass: hasClass,
    hasNameClassAttrs: hasNameClassAttrs,
    isIdNameClass: isIdNameClass,
    isParsedSelector: isParsedSelector,
    parseSelector: parseSelector,
    matches: matches
  };

}).call(this);
}, "tb/lib/ti/helpers/mini": function(exports, require, module) {(function() {
  var filterParents, find, findAll, findById, findByNodeAndClassName, findOne, matchers, snack, _is;

  matchers = require('./matchers');

  /*
   Partially extracted from https://github.com/padolsey/mini/blob/master/mini.js
   "mini" Selector Engine
   Copyright (c) 2009 James Padolsey
   -------------------------------------------------------
   Dual licensed under the MIT and GPL licenses.
      - http://www.opensource.org/licenses/mit-license.php
      - http://www.gnu.org/copyleft/gpl.html
   -------------------------------------------------------
   Version: 0.01 (BETA)
  */


  snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig;

  findOne = function(context, test) {
    var result;
    if (!context) {
      return;
    }
    if (_.isArray(context)) {
      if (result = _.find(context, function(el) {
        return findOne(el, test);
      })) {
        return result;
      }
    } else {
      if (test(context)) {
        return context;
      } else {
        return findOne(context.children, test);
      }
    }
  };

  findAll = function(context, test, collector, include) {
    if (collector == null) {
      collector = [];
    }
    if (include == null) {
      include = true;
    }
    if (!context) {
      return [];
    }
    if (_.isArray(context)) {
      $(context).each(function() {
        return findAll(this, test, collector);
      });
    } else {
      context = $(context).get(0);
      if (include && test(context)) {
        collector.push(context);
      }
      findAll($(context).children(), test, collector);
    }
    return collector;
  };

  findById = function(id, context) {
    return findOne(context, function(el) {
      return el.id === id;
    });
  };

  findByNodeAndClassName = function(nodeName, className, context, include) {
    if (include == null) {
      include = true;
    }
    return findAll(context, (function(el) {
      return matchers.hasNameClassAttrs(el, nodeName, className);
    }), [], include);
  };

  filterParents = function(selectorParts, collection, direct) {
    var className, id, matches, node, nodeName, parent, parentSelector, ret, _i, _len, _ref;
    parentSelector = selectorParts.pop();
    if (parentSelector === '>') {
      return filterParents(selectorParts, collection, true);
    }
    ret = [];
    _ref = matchers.parseSelector(parentSelector), id = _ref.id, className = _ref.className, nodeName = _ref.nodeName;
    for (_i = 0, _len = collection.length; _i < _len; _i++) {
      node = collection[_i];
      parent = node.parent;
      while (parent) {
        matches = matchers.isIdNameClass(parent, id, nodeName, className);
        if (direct || matches) {
          break;
        }
        parent = parent.parent;
      }
      if (matches) {
        ret.push(node);
      }
    }
    if (selectorParts[0] && ret[0]) {
      return filterParents(selectorParts, ret);
    } else {
      return ret;
    }
  };

  _is = function(selector, context) {
    var part, parts;
    parts = selector.match(snack);
    part = parts.pop();
    if (matchers.matches(context, part)) {
      if (parts[0]) {
        return filterParents(parts, [context]).length > 0;
      } else {
        return true;
      }
    }
  };

  find = function(selector, context, includeSelf) {
    var child, className, collection, id, nodeName, part, parts, ret, _i, _len, _ref, _ref1;
    if (selector == null) {
      selector = '*';
    }
    if (includeSelf == null) {
      includeSelf = false;
    }
    parts = selector.match(snack);
    part = parts.pop();
    if (selector.indexOf(',') > -1) {
      ret = [];
      _ref = selector.split(/,/g);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        ret = _.uniq(ret.concat(find(selector.trim(), context)));
      }
      return ret;
    }
    _ref1 = matchers.parseSelector(part), id = _ref1.id, className = _ref1.className, nodeName = _ref1.nodeName;
    if (id) {
      if (child = findById(id, context)) {
        return [child];
      } else {
        return [];
      }
    } else {
      collection = findByNodeAndClassName(nodeName, className, context, includeSelf);
    }
    if (parts[0] && collection[0]) {
      return filterParents(parts, collection);
    } else {
      return collection;
    }
  };

  module.exports = {
    find: find,
    is: _is
  };

}).call(this);
}, "tb/lib/ti/helpers/values": function(exports, require, module) {(function() {
  var TITANIUM_VALUE, convertIfNeeded;

  TITANIUM_VALUE = /Ti\.(.*)/;

  convertIfNeeded = function(value) {
    var match, _ref;
    if (_.isString(value) && (match = value.match(TITANIUM_VALUE))) {
      return _.reduce((_ref = match[1]) != null ? _ref.split('.') : void 0, function(hashPart, subKey) {
        return hashPart[subKey];
      }, Ti);
    } else {
      return value;
    }
  };

  module.exports = {
    convertTi: function(valueOrHash) {
      var key, value;
      if (_.isObject(valueOrHash)) {
        for (key in valueOrHash) {
          value = valueOrHash[key];
          valueOrHash[key] = convertIfNeeded(value);
        }
        return valueOrHash;
      } else {
        return convertIfNeeded(valueOrHash);
      }
    }
  };

}).call(this);
}, "tb/lib/ti/helpers/view_handlers": function(exports, require, module) {(function() {
  var barHandler, container, defaultHandler, nonContainers, toolbarHandler, topLevelContainers, viewHandlers, _i, _len,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  nonContainers = ["ActivityIndicator", "Button", "ImageView", "Label", "ProgressBar", "SearchBar", "Slider", "Switch", "TextArea", "TextField", "WebView"];

  topLevelContainers = ["Tab", "TabGroup", "iPhone::NavigationGroup", "iPad::SplitWindow"];

  defaultHandler = {
    add: function(parent, child) {
      var _ref;
      if (_ref = child._viewName, __indexOf.call(topLevelContainers, _ref) >= 0) {
        throw new Error("" + child._viewName + " views are top level containers and cannot be added to other containers");
      } else {
        return parent.add(child);
      }
    },
    remove: function(parent, child) {
      return parent.remove(child);
    },
    children: function(parent) {
      return parent.children;
    }
  };

  barHandler = {
    add: function(parent, child) {
      throw new Error("The children of " + parent._viewName + " views are added via the 'labels' array.");
    },
    remove: function(parent, child) {
      throw new Error("The children of " + parent._viewName + " views are added via the 'labels' array.");
    }
  };

  toolbarHandler = {
    add: function(parent, child) {
      throw new Error("The children of " + parent._viewName + " views are added via the 'items' array.");
    },
    remove: function(parent, child) {
      throw new Error("The children of " + parent._viewName + " views are added via the 'items' array.");
    }
  };

  viewHandlers = {
    ButtonBar: barHandler,
    TabbedBar: barHandler,
    "iOS::TabbedBar": barHandler,
    TabGroup: {
      add: function(parent, child) {
        if (child._viewName === 'Tab') {
          return parent.addTab(child);
        } else {
          throw new Error("TabGroup views can only serve as containers for Tab views");
        }
      },
      remove: function(parent, child) {
        if (child._viewName === 'Tab') {
          return parent.removeTab(child);
        } else {
          throw new Error("TabGroup views can only serve as containers for Tab views");
        }
      },
      children: function(parent) {
        return parent.tabs;
      }
    },
    TableView: {
      add: function(parent, child) {
        switch (child._viewName) {
          case 'TableViewRow':
            return parent.appendRow(child);
          case 'TableViewSection':
            return parent.appendSection(child);
          default:
            throw new Error("TableView views can only serve as containers for TableViewRow and TableViewSection views");
        }
      },
      remove: function(parent, child) {
        switch (child._viewName) {
          case 'TableViewRow':
            return parent.deleteRow(_.indexOf(parent.rows, child));
          case 'TableViewSection':
            return parent.deleteSection(_.indexOf(parent.sections, child));
          default:
            throw new Error("TableView views can only serve as containers for TableViewRow and TableViewSection views");
        }
      },
      children: function(parent) {
        var data;
        data = parent.data;
        if ((data.length === 1) && !data[0]._viewName) {
          return data[0].rows;
        } else {
          return data;
        }
      }
    },
    TableViewSection: {
      add: function(parent, child) {
        if (child._viewName === 'TableViewRow') {
          child._inSection = true;
          return parent.add(child);
        } else {
          throw new Error("TableViewSection views can only serve as containers for TableViewRow views");
        }
      },
      remove: function(parent, child) {
        var table;
        if (child._viewName === 'TableViewRow') {
          table = parent.parent;
          return table.deleteRow(child);
        } else {
          throw new Error("TableViewSection views can only serve as containers for TableViewRow views");
        }
      },
      children: function(parent) {
        return parent.rows;
      }
    },
    Picker: {
      add: function(parent, child) {
        var _ref;
        if ((_ref = child._viewName) === 'PickerRow' || _ref === 'PickerColumn') {
          return parent.add(child);
        } else {
          throw new Error("Picker views can only serve as containers for PickerRow and PickerColumn views");
        }
      },
      remove: function(parent, child) {
        if (child._viewName === 'PickerColumn') {
          return parent.setColumns(_.without(parent.columns, child));
        } else {
          throw new Error("Pickers can not directly remove PickerRows or other view types");
        }
      }
    },
    PickerColumn: {
      add: function(parent, child) {
        if (child._viewName === 'PickerRow') {
          return parent.addRow(child);
        } else {
          throw new Error("PickerColumn views can only serve as containers for PickerRow views");
        }
      },
      remove: function(parent, child) {
        if (child._viewName === 'PickerRow') {
          console.warn('remove row', child);
          return parent.removeRow(child);
        } else {
          throw new Error("PickerColumn views can only serve as containers for PickerRow views");
        }
      }
    },
    Toolbar: toolbarHandler,
    "iOS::Toolbar": toolbarHandler
  };

  for (_i = 0, _len = nonContainers.length; _i < _len; _i++) {
    container = nonContainers[_i];
    viewHandlers[container] = {
      add: function(parent, child) {
        throw new Error("" + parent._viewName + " views can not serve as containers for other views");
      },
      remove: function(parent, child) {
        throw new Error("" + parent._viewName + " views can not serve as containers for other views");
      }
    };
  }

  module.exports = {
    handle: function(command, parent, child) {
      var handlerCommand, _ref, _ref1;
      if (((child != null ? child._viewName : void 0) === 'PickerRow') && command === 'remove') {
        return parent.removeRow(child);
      } else if (((child != null ? child._viewName : void 0) === 'TableViewRow') && !parent._viewName) {
        handlerCommand = ((_ref = viewHandlers['TableViewSection']) != null ? _ref[command] : void 0) || defaultHandler[command];
        return handlerCommand(parent, child);
      } else {
        handlerCommand = ((_ref1 = viewHandlers[parent._viewName]) != null ? _ref1[command] : void 0) || defaultHandler[command];
        return handlerCommand(parent, child);
      }
    }
  };

}).call(this);
}, "tb/lib/ti/index": function(exports, require, module) {(function() {
  var extend, ti, values,
    __slice = [].slice;

  values = require('./helpers/values');

  ti = {
    createView: function() {
      var attributeHashes, attributes, creator, match, module, viewCreator, viewName, viewNameOrCreator;
      viewNameOrCreator = arguments[0], attributeHashes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      attributes = _.extend.apply(_, [{}].concat(__slice.call(attributeHashes)));
      viewCreator = _.isString(viewNameOrCreator) ? (attributes._viewName = viewName = viewNameOrCreator, (match = viewName.match(/(.*):(.*)/)) ? (module = match[1], viewName = match[2]) : void 0, viewName === 'div' ? attributes._viewName = viewName = 'View' : void 0, creator = "create" + viewName, module ? Ti.UI[module][creator] : Ti.UI[creator]) : viewNameOrCreator;
      if (viewCreator) {
        return viewCreator(values.convertTi(attributes));
      } else {
        return console.log("Could not find viewCreator for " + viewNameOrCreator);
      }
    },
    $: function(element) {
      return extend(element);
    }
  };

  extend = require('./extend')(ti);

  module.exports = {
    createView: ti.createView,
    $: extend,
    Ti: Ti
  };

}).call(this);
}, "tb/lib/ti/manipulation/index": function(exports, require, module) {(function() {
  var styler, viewHandlers;

  viewHandlers = require('../helpers/view_handlers');

  styler = require('tb/lib/styler');

  module.exports = {
    append: function(child, options) {
      var $parent, parent;
      if (options == null) {
        options = {};
      }
      $parent = this;
      parent = this[0];
      $(child).each(function() {
        viewHandlers.handle('add', parent, $(this)[0]);
        if ((parent._viewName === 'Window') || $parent.closest('Window').length) {
          return $(this).find().add(this).each(function() {
            var styles;
            if (styles = styler.stylesForView(this)) {
              return $(this).attr(styles);
            }
          });
        }
      });
      return this;
    },
    appendTo: function(parent) {
      $(parent).append(this[0]);
      return this;
    },
    remove: function() {
      var parent;
      if (parent = this.parent()) {
        this.each(function() {
          if (!this._removed) {
            viewHandlers.handle('remove', parent[0], this);
            return this._removed = true;
          }
        });
      }
      return this;
    },
    empty: function() {
      var removeChildren;
      removeChildren = function(el) {
        var child, _i, _len, _ref, _results;
        _ref = el.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(el.remove(child));
        }
        return _results;
      };
      return this.hide().each(removeChildren).show();
    },
    html: function(children) {
      this.empty().append($(children));
      return this;
    },
    hide: function() {
      return this.each(function(el) {
        return el.hide();
      });
    },
    show: function() {
      return this.each(function(el) {
        return el.show();
      });
    }
  };

}).call(this);
}, "tb/lib/ti/traversal": function(exports, require, module) {(function() {
  var matchers, mini, slice, viewHandlers;

  matchers = require('./helpers/matchers');

  mini = require('./helpers/mini');

  viewHandlers = require('./helpers/view_handlers');

  slice = [].slice;

  module.exports = {
    concat: [].concat,
    each: function(callback) {
      _.each(this, function(el) {
        return callback.apply(el, arguments);
      });
      return this;
    },
    find: function(selector) {
      return this.map(function() {
        return $(mini.find(selector, this));
      });
    },
    map: function(fn) {
      var mapWithExtend;
      mapWithExtend = function(el, i) {
        return fn.call(el, i, el);
      };
      return $(_.chain(this).map(mapWithExtend).flatten().value());
    },
    add: function(el) {
      return $(this.concat($(el)));
    },
    get: function(index) {
      if (index != null) {
        return this[index];
      } else {
        return slice.call(this);
      }
    },
    children: function() {
      return this.map(function() {
        return viewHandlers.handle('children', this);
      });
    },
    parent: function() {
      return $(this[0].parent);
    },
    closest: function(selector) {
      var node, parsed;
      parsed = matchers.parseSelector(selector);
      node = this[0];
      while (node && !matchers.isParsedSelector(node, parsed)) {
        node = node.parent;
      }
      return $(node);
    },
    is: function(selector) {
      var parsed;
      parsed = matchers.parseSelector(selector);
      return _.some(this, function(el) {
        return matchers.isParsedSelector(el, parsed);
      });
    }
  };

}).call(this);
}, "tb/views/base": function(exports, require, module) {(function() {
  var BaseView, Chaplin,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = BaseView = (function(_super) {

    __extends(BaseView, _super);

    function BaseView() {
      return BaseView.__super__.constructor.apply(this, arguments);
    }

    BaseView.prototype.autoRender = true;

    BaseView.prototype.getTemplateFunction = function() {
      return this.template;
    };

    BaseView.prototype.dispose = function() {
      var prop, properties, subview, _i, _j, _len, _len1, _ref;
      if (this.disposed) {
        return;
      }
      if (this.subviews == null) {
        throw new Error('Your `initialize` method must include a super call to\
      Chaplin `initialize`');
      }
      _ref = this.subviews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        subview = _ref[_i];
        subview.dispose();
      }
      this.unsubscribeAllEvents();
      this.stopListening();
      this.off();
      properties = ['el', '$el', 'options', 'model', 'collection', 'subviews', 'subviewsByName', '_callbacks'];
      for (_j = 0, _len1 = properties.length; _j < _len1; _j++) {
        prop = properties[_j];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return BaseView;

  })(Chaplin.View);

}).call(this);
}, "tb/views/collection": function(exports, require, module) {(function() {
  var Chaplin, CollectionView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.animationDuration = 0;

    CollectionView.prototype.getTemplateFunction = function() {
      return this.template || function() {};
    };

    CollectionView.prototype.filterCallback = function(view, included) {};

    return CollectionView;

  })(Chaplin.CollectionView);

}).call(this);
}, "tb/views/layouts/stack": function(exports, require, module) {(function() {
  var StackLayout, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../base');

  module.exports = StackLayout = (function(_super) {

    __extends(StackLayout, _super);

    function StackLayout() {
      return StackLayout.__super__.constructor.apply(this, arguments);
    }

    StackLayout.prototype.tagName = 'Window';

    StackLayout.prototype.showView = function(view) {
      if (this.$navGroup) {
        return this.$navGroup[0].open(view.el);
      } else {
        this.$navGroup = $('<iPhone:NavigationGroup>').attr('window', view.el).appendTo(this.$el);
        this.el.open();
        return this.open = true;
      }
    };

    StackLayout.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      console.warn('disposed layout');
      return StackLayout.__super__.dispose.apply(this, arguments);
    };

    return StackLayout;

  })(View);

}).call(this);
}, "underscore": function(exports, require, module) {(function() {

  module.exports = _;

}).call(this);
}, "ks/github/application": function(exports, require, module) {(function() {
  var Application, GithubApplication, routes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Application = require('tb/chaplin/application');

  routes = require('./routes');

  module.exports = GithubApplication = (function(_super) {

    __extends(GithubApplication, _super);

    function GithubApplication() {
      return GithubApplication.__super__.constructor.apply(this, arguments);
    }

    GithubApplication.prototype.initialize = function() {
      GithubApplication.__super__.initialize.apply(this, arguments);
      this.initDispatcher({
        controllerSuffix: '',
        controllerPath: 'ks/github/controllers/'
      });
      this.initLayoutManager({
        "default": 'main',
        layoutSuffix: '',
        layoutPath: 'ks/github/views/layouts/'
      });
      return this.initRouter(routes);
    };

    return GithubApplication;

  })(Application);

}).call(this);
}, "ks/github/controllers/issues": function(exports, require, module) {(function() {
  var Chaplin, IssuesController, RepoCollection, RepoView, ReposView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  RepoCollection = require('ks/github/models/repo').RepoCollection;

  RepoView = require('ks/github/views/repos/repo');

  ReposView = require('ks/github/views/repos');

  module.exports = IssuesController = (function(_super) {

    __extends(IssuesController, _super);

    function IssuesController() {
      return IssuesController.__super__.constructor.apply(this, arguments);
    }

    IssuesController.prototype.index = function() {
      var repos;
      repos = new RepoCollection;
      this.view = new ReposView({
        collection: repos
      });
      return repos.fetch();
    };

    IssuesController.prototype.show = function(params, options) {
      return this.view = new RepoView({
        model: options.model
      });
    };

    return IssuesController;

  })(Chaplin.Controller);

}).call(this);
}, "ks/github/models/repo": function(exports, require, module) {(function() {
  var Repo, RepoCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Repo = (function(_super) {

    __extends(Repo, _super);

    function Repo() {
      return Repo.__super__.constructor.apply(this, arguments);
    }

    return Repo;

  })(Backbone.Model);

  RepoCollection = (function(_super) {

    __extends(RepoCollection, _super);

    function RepoCollection() {
      return RepoCollection.__super__.constructor.apply(this, arguments);
    }

    RepoCollection.prototype.model = Repo;

    RepoCollection.prototype.url = 'https://api.github.com/users/trabian/repos';

    return RepoCollection;

  })(Backbone.Collection);

  module.exports = {
    Repo: Repo,
    RepoCollection: RepoCollection
  };

}).call(this);
}, "ks/github/routes": function(exports, require, module) {(function() {

  module.exports = function(match) {
    match('', 'issues');
    return match('/issues/:id', 'issues#show');
  };

}).call(this);
}, "ks/github/views/layout": function(exports, require, module) {(function() {
  var Chaplin, Layout,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Layout = (function(_super) {

    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    return Layout;

  })(Chaplin.Layout);

}).call(this);
}, "ks/github/views/layouts/main": function(exports, require, module) {(function() {
  var MainLayout, Stack,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Stack = require('tb/views/layouts/stack');

  module.exports = MainLayout = (function(_super) {

    __extends(MainLayout, _super);

    function MainLayout() {
      return MainLayout.__super__.constructor.apply(this, arguments);
    }

    return MainLayout;

  })(Stack);

}).call(this);
}, "ks/github/views/repos/index": function(exports, require, module) {(function() {
  var CollectionView, ReposView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CollectionView = require('tb/views/collection');

  module.exports = ReposView = (function(_super) {

    __extends(ReposView, _super);

    function ReposView() {
      return ReposView.__super__.constructor.apply(this, arguments);
    }

    ReposView.prototype.tagName = 'Window';

    ReposView.prototype.className = 'github-repos';

    ReposView.prototype.listSelector = 'TableView';

    ReposView.prototype.template = require('./template');

    ReposView.prototype.itemView = require('./row');

    ReposView.prototype.attributes = {
      title: 'Repos'
    };

    return ReposView;

  })(CollectionView);

}).call(this);
}, "ks/github/views/repos/repo/index": function(exports, require, module) {(function() {
  var RepoView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('tb/views/base');

  module.exports = RepoView = (function(_super) {

    __extends(RepoView, _super);

    function RepoView() {
      return RepoView.__super__.constructor.apply(this, arguments);
    }

    RepoView.prototype.tagName = 'Window';

    RepoView.prototype.className = 'github-repo';

    RepoView.prototype.template = require('./template');

    RepoView.prototype.attributes = function() {
      return {
        title: this.model.get('name')
      };
    };

    RepoView.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      console.warn('disposed repo view');
      return RepoView.__super__.dispose.apply(this, arguments);
    };

    return RepoView;

  })(View);

}).call(this);
}, "ks/github/views/repos/repo/template": function(exports, require, module) {module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('padded') }));
buf.push('><Label');
buf.push(attrs({ "class": ('h1') }));
buf.push('>');
var __val__ = name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</Label></div>');
}
return buf.join("");
};}, "ks/github/views/repos/row/index": function(exports, require, module) {(function() {
  var RepoView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('tb/views/base');

  module.exports = RepoView = (function(_super) {

    __extends(RepoView, _super);

    function RepoView() {
      return RepoView.__super__.constructor.apply(this, arguments);
    }

    RepoView.prototype.tagName = 'TableViewRow';

    RepoView.prototype.template = require('./template');

    RepoView.prototype.events = {
      'click': 'click'
    };

    RepoView.prototype.click = function() {
      return Backbone.history.navigate("/issues/" + this.model.id, {
        model: this.model
      });
    };

    return RepoView;

  })(View);

}).call(this);
}, "ks/github/views/repos/row/template": function(exports, require, module) {module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<Label');
buf.push(attrs({ "class": ('owner') }));
buf.push('>' + escape((interp = owner.login) == null ? '' : interp) + '/</Label><Label');
buf.push(attrs({ "class": ('name') }));
buf.push('>');
var __val__ = name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</Label>');
}
return buf.join("");
};}, "ks/github/views/repos/template": function(exports, require, module) {module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<ScrollView><TableView></TableView></ScrollView>');
}
return buf.join("");
};}, "ks/index": function(exports, require, module) {(function() {

  module.exports = {
    run: function(options) {
      var GithubApplication, app;
      if (options) {
        require('tb').load(options);
      }
      GithubApplication = require('ks/github/application');
      app = new GithubApplication();
      return app.initialize();
    }
  };

}).call(this);
}, "ks/views/main": function(exports, require, module) {(function() {
  var Window, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('./template');

  module.exports = Window = (function(_super) {

    __extends(Window, _super);

    function Window() {
      return Window.__super__.constructor.apply(this, arguments);
    }

    Window.prototype.tagName = 'Window';

    Window.prototype.events = function() {
      var _this = this;
      return {
        'click Button.clickable': function() {
          return alert("Told you so, " + (_this.model.get('name')) + "!");
        }
      };
    };

    Window.prototype.bindings = {
      'TextField': 'name',
      '.reversed-name': {
        observe: 'name',
        onGet: 'reverse'
      }
    };

    Window.prototype.reverse = function(val) {
      if (val) {
        return "In reverse: " + (val.split('').reverse().join(''));
      }
    };

    Window.prototype.render = function() {
      this.$el.html(template({
        title: 'Installation was successful using Jade!',
        subtitle: 'This is a subtitle'
      }));
      this.stickit();
      return this;
    };

    Window.prototype.open = function() {
      return this.render().el.open();
    };

    return Window;

  })(Backbone.View);

}).call(this);
}, "ks/views/template": function(exports, require, module) {module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('padded') }));
buf.push('><Label');
buf.push(attrs({ "class": ('h1') }));
buf.push('>');
var __val__ = title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</Label><Label');
buf.push(attrs({ "class": ('h2') }));
buf.push('>');
var __val__ = subtitle
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</Label><TextField></TextField><Label');
buf.push(attrs({ "class": ('reversed-name') }));
buf.push('></Label><Label');
buf.push(attrs({ 'color':('#00f'), "class": ('reversed-name') }));
buf.push('></Label><Label');
buf.push(attrs({ "class": ('reversed-name') + ' ' + ('error') }));
buf.push('></Label><div');
buf.push(attrs({ "class": ('buttons') }));
buf.push('><Button');
buf.push(attrs({ "class": ('clickable') }));
buf.push('>I work!</Button><Button');
buf.push(attrs({ "class": ('notclickable') }));
buf.push('>I don\'t!</Button></div></div>');
}
return buf.join("");
};}});
