export function now() {
  var tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}

export function isJson(item) {
  item = typeof item !== "string" ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === "object" && item !== null) {
    return true;
  }

  return false;
}
export function getLocalStorageObj(ObjKey, key) {
  let result = {};
  var localData;
  if ((localData = localStorage.getItem(ObjKey))) {
    if (isJson(localData)) {
      result = JSON.parse(localData);
    } else {
      return localData;
    }
  }

  return result[key];
}
export const getDateFormat = (dateStr) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return `Last Modified - ${new Date(dateStr).toLocaleString(
    "en-US",
    options
  )}`;
};

export function actionTypeCreator(type) {
  return {
    FETCH: `${type}_FETCH`,
    SUCCESS: `${type}_SUCCESS`,
    ERROR: `${type}_ERROR`,
    RESET: `${type}_RESET`,
  };
}


export const combineReducers = (reducers) => {
  const reducerKeys = Object.keys(reducers);
  const reducerValues = Object.values(reducers);
  let globalState;
  reducerKeys.forEach((key, index) => {
    globalState = { ...globalState, [key]: reducerValues[index][1] };
  });
  let finalReducers = {};
  reducerValues.forEach((value, index) => {
    finalReducers = { ...finalReducers, [reducerKeys[index]]: value[0] };
  });
  return [
    (state, action) => {
      let hasStateChanged = false;
      const newState = {};
      let nextStateForCurrentKey = {};
      for (let i = 0; i < reducerKeys.length; i++) {
        const currentKey = reducerKeys[i];
        const currentReducer = finalReducers[currentKey];
        const prevStateForCurrentKey = state[currentKey];
        nextStateForCurrentKey = currentReducer(prevStateForCurrentKey, action);
        hasStateChanged =
          hasStateChanged || nextStateForCurrentKey !== prevStateForCurrentKey;
        newState[currentKey] = nextStateForCurrentKey;
      }
      return hasStateChanged ? newState : state;
    },
    globalState,
  ];
};
