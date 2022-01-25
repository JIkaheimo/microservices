import { AxiosRequestConfig } from "axios";
import { api } from "./setup";

export const getCurrentUser = async (config?: AxiosRequestConfig) => {
  const user = await api.get<never, { email: string }>(
    "users/current-user",
    config
  );
  return user;
};
