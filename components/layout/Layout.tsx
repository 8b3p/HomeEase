import Navbar from "components/layout/Navbar";
import React from "react";
import { observer } from "mobx-react-lite";
import { Box } from "@mui/material";

interface props {
  children: React.ReactNode;
}

const Layout = ({ children }: props) => {
  return (
    <Box sx={{
      minHeight: '100vh'
    }}>
      <Navbar />
      <Box sx={{ height: 'calc(100vh - 4rem)' }}>{children}</Box>
    </Box>
  );
};

export default observer(Layout);
