import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Flag to prevent concurrent refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: `${API_URL}api/`,
  headers: {
    'Content-Type': 'application/json',
  },
  // The refresh token lives in an httpOnly cookie set by the backend (cross-origin: Vercel
  // frontend, PythonAnywhere backend), so cookies must be explicitly sent/received.
  withCredentials: true,
});

// Request interceptor: Add auth + CSRF headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // The backend's refresh/logout endpoints check this header against the csrftoken
    // cookie it set at login. Frontend and backend are different registrable domains, so
    // axios's usual cookie-reading xsrf support can't work here — document.cookie on this
    // page can never see a cookie the *backend's* origin set (that's cross-origin cookie
    // isolation, independent of SameSite/httpOnly). The token has to come from where the
    // login response handed it to us instead: see AuthContext.js's login().
    const csrfToken = localStorage.getItem("csrfToken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request and wait for token refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token travels in an httpOnly cookie now, not the request body — the
        // backend's CookieTokenRefreshView reads it from there and ignores the body.
        const response = await axios.post(
          `${API_URL}api/auth/token/refresh/`,
          {},
          {
            withCredentials: true,
            headers: {
              "X-CSRFToken": localStorage.getItem("csrfToken") || "",
            },
          }
        );

        const { access } = response.data;
        localStorage.setItem("accessToken", access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        processQueue(null, access);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("csrfToken");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
