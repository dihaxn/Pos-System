import axios from "axios";
import config from "../../../config/environment.js";

const api = axios.create({
    baseURL: config.API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export default api;