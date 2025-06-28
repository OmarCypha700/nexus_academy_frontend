import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

// import axios from "axios";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor: Add access token to headers
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor: Handle token refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If error response is 401 (Unauthorized) and hasn't been retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (!refreshToken) {
//           throw new Error('No refresh token available');
//         }

//         const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
//           refresh: refreshToken,
//         });

//         const { access } = response.data;
//         localStorage.setItem('access_token', access);

//         axiosInstance.defaults.headers['Authorization'] = `Bearer ${access}`;
//         originalRequest.headers['Authorization'] = `Bearer ${access}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error('Refresh token failed', refreshError);
//         // Optionally: logout user here
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         window.location.href = '/login'; // Redirect to login page
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
