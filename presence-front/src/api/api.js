import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.88.85:3000", // ton backend Express
});

export default api;