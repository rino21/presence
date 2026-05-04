import axios from "axios";

const api = axios.create({
  baseURL: "http://54.224.63.85/api/"
});

export default api;