// import axios from "axios";
// const version = "/v1";
// const baseURL = `${process.env.NEXT_PUBLIC_OFFRAMP_API_URL}${version}`;

// const appId = process.env.NEXT_PUBLIC_OFFRAMP_APP;

// const api = axios.create({
//   baseURL,
//   headers: {
//     Accept: "application/json",
//     "Access-Control-Allow-Origin": "*",
//     "app-id": appId,
//   },
// });

// // set bearer token
// // api.interceptors.request.use(
// //   (config) => {
// //     const token = useAuthStore.getState().token;
// //     if (token) {
// //       config.headers['Authorization'] = 'Bearer ' + token;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   },
// // );

// export { api };
