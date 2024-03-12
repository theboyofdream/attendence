import axios, { AxiosError } from "axios";
import { BASE_URI, DEFAULT_TIMEOUT } from "./config";
import { storage } from "~stores";

const fetcher = axios.create({
  baseURL: BASE_URI,
  timeout: DEFAULT_TIMEOUT
})

// // Add a response interceptor
// fetcher.interceptors.response.use(function (response) {
//   // Any status code that lie within the range of 2xx cause this function to trigger
//   // Do something with response data
//   return response;
// }, function (error: AxiosError) {
//   // Any status codes that falls outside the range of 2xx cause this function to trigger
//   // Do something with response error
//   if (error.status == 500) {
//     storage.setMapAsync("msg", {
//       id: 'server error',
//       title: '500: Server Error',
//       description: error.message,
//       type: 'error',
//     });
//   }
//   return Promise.reject(error);
// });

export { fetcher }