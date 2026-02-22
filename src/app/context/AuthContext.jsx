import { createContext, useContext, useState } from "react";
const AuthContext = createContext(void 0);
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const login = async (email, password, role) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        console.log("Login successful:", data.user);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
    }
  };
  const logout = () => {
    setUser(null);
  };
  return <AuthContext.Provider
    value={{ user, login, logout, isAuthenticated: !!user }}
  >
      {children}
    </AuthContext.Provider>;
};
export {
  AuthProvider,
  useAuth
};
