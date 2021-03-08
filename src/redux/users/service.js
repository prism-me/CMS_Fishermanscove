import API from "../../lib/Api";

export async function login(user) {
  return API.post(`/auth/login`, user);
}
export async function register(user) {
  return API.post(`/auth/register`, user);
}
export async function reset(user) {
  return API.post(`/auth/reset`, user);
}
export async function verifyEmail(token) {
  return API.post(`/auth/verify`, { token });
}
export async function getUser(id) {
  return API.get(`/user/${id}`);
}
export async function forgot(email) {
  return API.post(`/auth/forgot`, { email });
}
