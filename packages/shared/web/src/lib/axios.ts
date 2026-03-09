import axios from "axios";
import { env } from "./env";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export function setupAuthInterceptor() {
  api.interceptors.request.use(
    (config) => {
      const token = Cookies.get("access_token");

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
}
