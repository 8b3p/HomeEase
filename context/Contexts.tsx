import { useContext, createContext } from "react";
import { AuthVM } from "context/authVM";
import { UsersVM } from "context/usersVM";
import { ThemeVM } from "context/themeVM";

// ====================== AUTH CONTEXT ======================

export const AuthContext = createContext<AuthVM | null>(null);

export const authVM = new AuthVM();
export const AuthContextProvider = ({ children }: any) => {
  return <AuthContext.Provider value={authVM}>{children}</AuthContext.Provider>;
};

export const useAuthVM = () => {
  const authVM = useContext(AuthContext);
  if (!authVM) {
    throw new Error("useAuthVM must be used within an AuthContextProvider");
  }
  return authVM;
};

// ====================== USER CONTEXT ======================

export const UserContext = createContext<UsersVM | null>(null);

export const usersVM = new UsersVM();
export const UsersContextProvider = ({ children }: any) => {
  return (
    <UserContext.Provider value={usersVM}>{children}</UserContext.Provider>
  );
};

export const useUsersVM = () => {
  const usersVM = useContext(UserContext);
  if (!usersVM) {
    throw new Error("useUsersVM must be used within an UserContextProvider");
  }
  return usersVM;
};

// ====================== THEME CONTEXT ======================

export const ThemeContext = createContext<ThemeVM | null>(null);

export const themeVM = new ThemeVM();
export const ThemeContextProvider = ({ children }: any) => {
  return (
    <ThemeContext.Provider value={themeVM}>{children}</ThemeContext.Provider>
  );
};

export const useThemeVM = () => {
  const themeVM = useContext(ThemeContext);
  if (!themeVM) {
    throw new Error("useThemeVM must be used within an ThemeContextProvider");
  }
  return themeVM;
};
