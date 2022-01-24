import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.response.use(
  ({ data }) => data,
  ({ response }) => Promise.reject(response.data?.errors ?? response.data)
);

export { api };
