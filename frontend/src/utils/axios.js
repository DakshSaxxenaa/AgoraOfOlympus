import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true,
});


instance.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");

  if (stored) {
    const auth = JSON.parse(stored);
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  }

  return config;
});

export default instance;
