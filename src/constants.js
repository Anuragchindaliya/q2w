// export default {
//   URL: "/(https?://)?(www.)?[-a-zA-Z0-9@:%.+~#=]{1,256}.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%+.~#?&//=_]*)/gm",
// };
const REGEX = {
  URL: new RegExp("(https?://)?(www.)?[-a-zA-Z0-9@:%.+~#=]{1,256}.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%+.~#?&//=_]*)","gm"),
}
export default REGEX;
