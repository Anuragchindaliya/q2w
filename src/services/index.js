import weburl from "../config";

const hitApi = async (url, type, data) => {
  return await fetch(url, {
    method: type,
    body: data,
  }).then((res) => res.json());
};

export const roomLoginApi = (formData) => {
  return hitApi(`${weburl}/api/login`, "POST", formData);
};

export const updateRoomContentApi = async (formData) => {
  return hitApi(`${weburl}/api/updatecontent`, "POST", formData);
};

// fetch(`${weburl}/api/createroom`, { method: "POST", body: formData }).then((res) => res.json())
export const createRoomApi = (formData) => {
  return hitApi(`${weburl}/api/createroom`, "POST", formData);
};

export const setPasswordApi = (formData) => {
  return hitApi(`${weburl}/api/setauth`, "POST", formData);
};
export const checkAuthApi = (formData) => {
  return hitApi(`${weburl}/api/checkauth`, "POST", formData);
};
