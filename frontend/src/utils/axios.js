import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", 
  // baseURL: "https://agora-tqrczjua.b4a.run/api",

  // The backend is deployed on Back4app's free tier for testing purposes. The container goes to sleep after 60 minutes of inactivity.
  
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
