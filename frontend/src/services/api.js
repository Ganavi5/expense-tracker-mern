import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-backend-09sj.onrender.com",
});

export default API;