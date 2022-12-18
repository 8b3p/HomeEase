import { useContext, createContext } from "react";
import { AuthVM } from "context/authVM";
import ThemeVM from "context/themeVM";

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
