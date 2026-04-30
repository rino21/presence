import axios from "axios";

const api = axios.create({
  baseURL: "http://34.133.73.0/api/"
});

export default api;