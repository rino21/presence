import axios from "axios";

const api = axios.create({
  baseURL: "api-presence-dev.local:31002/"
});

export default api;