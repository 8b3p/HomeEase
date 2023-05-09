import Navbar from "@/components/layout/Navbar/Navbar";
import React from "react";
import { observer } from "mobx-react-lite";
import { Box, Stack } from "@mui/material";

interface props {
  children: React.ReactNode;
}

const Layout = ({ children }: props) => {
  return (
    <Stack height="100%" >
      <Navbar />
      <Box sx={{ height: '100%' }}>{children}</Box>
    </Stack>
  );
};

export default observer(Layout);
