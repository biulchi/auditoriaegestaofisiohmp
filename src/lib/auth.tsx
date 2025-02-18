import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "./supabase";

type AuthContextType = {
  isAuthenticated: boolean;
  userRole: "admin" | "user" | null;
  userId: string | null;
  firstTimeLogin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [firstTimeLogin, setFirstTimeLogin] = useState<boolean>(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUserRole(auth.role);
      setUserId(auth.employee_id);
      setFirstTimeLogin(auth.first_time_login);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("employee_id", username)
        .single();

      if (error || !data) {
        console.error("Login error:", error);
        return false;
      }

      if (data.password !== password) {
        console.error("Invalid password");
        return false;
      }

      localStorage.setItem("auth", JSON.stringify(data));
      setIsAuthenticated(true);
      setUserRole(data.role);
      setUserId(data.employee_id);
      setFirstTimeLogin(data.first_time_login || false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setFirstTimeLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userId,
        firstTimeLogin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
