// ROOT
export const rootGetter = state => state;
export const rootSetter = (arg, state) => {
  if (typeof arg === "function") {
    return arg(state);
  } else {
    return arg;
  }
};

export const rootLens = [rootGetter, rootSetter];

// ARRAY
export const indexGetter = i => state => rootGetter(state[i]);
export const indexSetter = (i, arg, state) => {
  return state.map((item, index) => {
    if (index === i) {
      return rootSetter(arg, item);
    }
    return item;
  });
};
export const indexLens = [indexGetter, indexSetter];

// OBJECT
export const propGetter = key => state => rootGetter(state[key]);
export const propSetter = (key, arg, state) => ({
  ...state,
  [key]: rootSetter(arg, state[key])
});
export const propLens = [propGetter, propSetter];

// PATH
//
export const pathGetter = path => state => get(state, path, undefined);
export const pathSetter = (path, arg, state) =>
  set(state, path, arg, undefined);

const stringToPath = function(path) {
  // If the path isn't a string, return it
  if (typeof path !== "string") return path;

  // Create new array
  var output = [];

  // Split to an array with dot notation
  path.split(".").forEach(function(item, index) {
    // Split to an array with bracket notation
    item.split(/\[([^}]+)\]/g).forEach(function(key) {
      // Push to the new array
      if (key.length > 0) {
        output.push(key);
      }
    });
  });

  return output;
};

const get = (obj, pathArg, def) => {
  const path = stringToPath(pathArg);
  return path.reduce((final, pathSegment) => {
    return final[pathSegment] || def;
  }, obj);
};

const set = (obj, pathArg, value, def) => {
  const path = stringToPath(pathArg);
  let newObj = cloneAlongPath(Object.assign({}, obj), path);
  let current = newObj;
  for (let i = 0; i < path.length; i++) {
    if (i === path.length - 1) {
      current[path[i]] = rootSetter(value, current[path[i]]);
    }
    current = current[path[i]];
  }
  return newObj;
};

const cloneAlongPath = (obj, path) => {
  const [head, ...tail] = path;
  if (tail.length) {
    if (Array.isArray(obj)) {
      return [...obj].map((item, i) => {
        if (i == head) {
          return cloneAlongPath(item, tail);
        }
        return item;
      });
    } else {
      return { ...obj, [head]: cloneAlongPath(obj[head], tail) };
    }
  }
  if (Array.isArray(obj)) {
    return [...obj];
  }
  return { ...obj };
};
