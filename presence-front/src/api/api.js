import axios from "axios";

const api = axios.create({
  baseURL: "api-presence-dev.local:31002/api/"
});

export default api;