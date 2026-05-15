import axios from "axios";

const api = axios.create({
  baseURL: "api-presence-dev.local/api/"
});

export default api;