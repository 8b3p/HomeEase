import Navbar from "@/components/layout/Navbar/Navbar";
import { Container, Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";

interface props {
  children: React.ReactNode;
}

const Layout = ({ children }: props) => {
  return (
    <Stack height="100%">
      <Navbar />
        <Container sx={{ height: '-webkit-fill-available' }}>{children}</Container>
    </Stack>
  );
};

export default observer(Layout);
