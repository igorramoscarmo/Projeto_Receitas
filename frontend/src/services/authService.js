// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

axios.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            config.headers["Authorization"] = `Bearer ${user.token}`;
        }
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const register = async (username, email, password) => {
    const response = await axios.post(API_URL + "register", {
        username,
        email,
        senha: password,
    });
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(
        API_URL + "login",
        {
            email,
            senha: password,
        },
        { withCredentials: true }
    );
    if (response.data.user && response.data.token) {
        localStorage.setItem(
            "user",
            JSON.stringify({
                ...response.data.user,
                token: response.data.token,
            })
        );
    }
    return response.data;
};

const logout = async () => {
    try {
        await axios.post(API_URL + "logout", {}, { withCredentials: true });
    } finally {
        localStorage.removeItem("user");
    }
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;
