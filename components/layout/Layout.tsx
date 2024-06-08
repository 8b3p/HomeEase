import Navbar from "@/components/layout/Navbar/Navbar";
import { Container, Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";

interface props {
  children: React.ReactNode;
}

const Layout = ({ children }: props) => {
  return (
    <Stack height="100%" maxWidth="1800px" marginX="auto">
      <Navbar />
      <Stack sx={{ overflowY: 'scroll' }} width="100%" height="100%">
        <Container sx={{ height: '-webkit-fill-available' }}>{children}</Container>
      </Stack>
    </Stack>
  );
};

export default observer(Layout);
