import axios from "axios";

const api = axios.create({
  baseURL: "http://34.132.135.243/api/"
});

export default api;