import axios from "axios";

const api = axios.create({
  baseURL: "http://backend:3000"
});

export default api;