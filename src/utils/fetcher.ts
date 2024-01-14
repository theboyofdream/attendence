import axios from "axios";
import { BASE_URI, DEFAULT_TIMEOUT } from "./config";

axios.defaults.timeout = DEFAULT_TIMEOUT;
axios.defaults.baseURL = BASE_URI;

export const fetcher = axios