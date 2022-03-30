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
