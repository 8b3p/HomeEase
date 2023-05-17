import { useContext, createContext } from "react";
import ThemeVM from "context/themeVM";
import AppVM, { HydrationData } from "context/appVM";
import { enableStaticRendering } from "mobx-react-lite";

enableStaticRendering(typeof window === "undefined")

// ====================== THEME CONTEXT ======================

export const ThemeContext = createContext<ThemeVM | null>(null);

let clientThemeVM: ThemeVM;

const initThemeVM = () => {
  // check if we already declare vm (client vm), otherwise create one
  const vm = clientThemeVM ?? new ThemeVM();
  // hydrate to vm if receive initial data

  // Create a vm on every server request
  if (typeof window === "undefined") return vm
  // Otherwise it's client, remember this vm and return 
  if (!clientThemeVM) clientThemeVM = vm;
  return vm
}

// Hook for using vm
export function useInitThemeVM() {
  return initThemeVM()
}

export const ThemeContextProvider = ({ children, value }: { value: ThemeVM, children: JSX.Element }) => {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeVM = () => {
  const themeVM = useContext(ThemeContext);
  if (!themeVM) {
    throw new Error("useThemeVM must be used within an ThemeContextProvider");
  }
  return themeVM;
};

// ====================== APP CONTEXT ======================

export const AppContext = createContext<AppVM | null>(null);

let clientAppVM: AppVM;

export const initAppVM = (initData?: HydrationData) => {
  // check if we already declare vm (client vm), otherwise create one
  const vm = clientAppVM ?? new AppVM();
  // hydrate to vm if receive initial data
  if (initData) {
    vm.hydrate(initData);
  }

  // Create a vm on every server request
  if (typeof window === "undefined") return vm
  // Otherwise it's client, remember this vm and return 
  if (!clientAppVM) clientAppVM = vm;
  return vm
}

export const AppContextProvider = ({ children, value }: { value: AppVM, children: JSX.Element }) => {
  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

export const useAppVM = () => {
  const appVM = useContext(AppContext);
  if (!appVM) {
    throw new Error("useAppVM must be used within an AppContextProvider");
  }
  return appVM;
};
