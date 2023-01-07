import Navbar from "@/components/layout/Navbar/Navbar";
import React from "react";
import { observer } from "mobx-react-lite";
import { useThemeVM } from "@/context/Contexts";
import { makeStyles } from "@fluentui/react-components";

interface props {
  children: React.ReactNode;
  styles?: React.CSSProperties;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
  children: {
    height: "calc(100vh - 4rem)",
  },
});

const Layout = ({ children }: props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Navbar />
      <div className={classes.children}>{children}</div>
    </div>
  );
};

export default observer(Layout);
