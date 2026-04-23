import axios from "axios";

const api = axios.create({
  baseURL: "http://api-presence-dev.local"
});

export default api;