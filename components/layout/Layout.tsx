import Navbar from "@/components/layout/Navbar/Navbar";
import React from "react";
import { observer } from "mobx-react-lite";
import { Container, Stack } from "@mui/material";

interface props {
  children: React.ReactNode;
}

const Layout = ({ children }: props) => {
  return (
    <Stack height="100%">
      <Navbar />
      <Container sx={{ height: '-webkit-fill-available', overflowX: 'hidden' }}>{children}</Container>
    </Stack>
  );
};

export default observer(Layout);
