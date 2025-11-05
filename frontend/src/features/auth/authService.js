import api from "../../api/axiosConfig";

const register = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    return { user: res.data.user, token: res.data.token };
  }
  throw new Error("Registration failed - no token received");
};

const login = async (userData) => {
  const res = await api.post("/auth/login", userData);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    return { user: res.data.user, token: res.data.token };
  }
  throw new Error("Login failed - no token received");
};

const logout = () => localStorage.removeItem("token");

const getCurrent = async () => {
  // returns current user info from backend using stored token
  const res = await api.get("/auth/me");
  return res.data;
};

const authService = { register, login, logout, getCurrent };
export default authService;
