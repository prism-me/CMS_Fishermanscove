import axios from "axios";

const apiURL = "https://fishermanscove-resort.com/fish/public/api";
const API = axios.create({
  baseURL: apiURL,
  timeout: 60000,
});

// API.interceptors.request.use((request) => {
//   if (request) {
//     //perform the manipulation here and change the request object
//   }
//   return request;
// }, (error) => {
//   console.log("interceptor request ERROR", error)

//   return Promise.reject(error.message);
// });


// API.interceptors.response.use((response) => {
//   if (response) {
//     //perform the manipulation here and change the response object
//   }
//   return response;
// }, (error) => {
//   console.log("interceptor response ERROR", error)
//   if (error.response.status === 401) {
//     // history.replace("/authentication/logout");
//   }
//   return Promise.reject(error.message);
// });

export default API;
