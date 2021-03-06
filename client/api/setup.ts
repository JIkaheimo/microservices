import axios from "axios";

const baseURL =
  typeof window === "undefined"
    ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api"
    : "/api";

const headers = typeof window === "undefined" ? { Host: "ticketing.dev" } : {};

const api = axios.create({
  baseURL,
  headers,
});

api.interceptors.response.use(
  ({ data }) => data,
  ({ response }) =>
    Promise.reject(
      response.data?.errors ?? response?.data.message ?? response.data
    )
);

export { api };
