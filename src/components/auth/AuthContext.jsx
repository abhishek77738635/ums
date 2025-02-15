import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

  // Function to login via API
  const login = async (email, password) => {
    try {
      const response = await axios.post("https://interview.optimavaluepro.com/api/v1/login", {
        email,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
