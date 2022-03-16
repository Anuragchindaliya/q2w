export function now() {
  var tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}
