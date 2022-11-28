import Navbar from "./Navbar";
import styles from "./Layout.module.css";
import { useThemeVM } from "../../context/Contexts";
import React from "react";
import { observer } from "mobx-react-lite";

interface props {
  children: React.ReactNode;
}

const Layout = ({ children }: props) => {
  const { themeColors, theme } = useThemeVM();
  return (
    <div
      style={theme ? { ...(themeColors[theme] as React.CSSProperties) } : {}}
      className={styles.main}
    >
      <Navbar />
      {children}
    </div>
  );
};

export default observer(Layout);
