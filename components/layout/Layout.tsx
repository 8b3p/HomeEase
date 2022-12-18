import Navbar from "components/layout/Navbar";
import React from "react";
import { observer } from "mobx-react-lite";
import { useThemeVM } from "@/context/Contexts";
import { makeStyles } from "@fluentui/react-components";

interface props {
  children: React.ReactNode;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
});

const Layout = ({ children }: props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Navbar />
      {children}
    </div>
  );
};

export default observer(Layout);
