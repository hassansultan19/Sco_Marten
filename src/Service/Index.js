import axios from "axios";

const midjourneyapiKey = import.meta.env.VITE_NEXT_LEG_SECRET_KEY;
const stabilityapiKey = import.meta.env.VITE_STABILITY_SECRET_KEY;

const createBackendServer = (baseURL) => {
  const api = axios.create({
    baseURL: `${baseURL}/api/`,
    withCredentials: false,
    headers: {
      Accept: "application/json",
    },
    timeout: 60 * 1000,
  });

  const localStoragedata = JSON.parse(localStorage.getItem("data"));
  const RealUserId = localStoragedata?.id;

  // Add a request interceptor
  api.interceptors.request.use(
    (config) => {
      const user_token = localStorage.getItem("authToken");
      if (user_token) {
        config.headers["Authorization"] = `Bearer ${user_token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //Interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error?.response?.data?.message;
      error.message = message ?? error.message;
      if (error?.response?.data?.errors)
        error.errors = error?.response?.data?.errors;
      return Promise.reject(error);
    }
  );

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const headers2 = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + midjourneyapiKey,
  };

  const headers3 = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + stabilityapiKey,
  };

  // Auth

  const register = async (body) => {let data = await api.post("auth/register", body)
console.log('data', data)
    return data
  };

  return {
    // Auth

    register,
  };
};

const apis = createBackendServer(import.meta.env.VITE_BASE_URL);
// console.log(import.meta.env.VITE_BASE_URL, 'SERVER_API');

export default apis;
