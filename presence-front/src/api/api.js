import axios from "axios";

const api = axios.create({
  baseURL: "https://back.gpc.vic-tec.online/"
});

export default api;