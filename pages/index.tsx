// pages/index.tsx
import type { GetServerSideProps, NextPage } from "next";

import { Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useThemeVM } from "@/context/Contexts";
import { getSession } from "next-auth/react";
import { House } from "@prisma/client";

export interface IndexProps {
  initialState: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      house: House | null;
    } | null
  }
}

const Home: NextPage<IndexProps> = () => {
  const themeVM = useThemeVM();

  return (
    <div>
      <Typography variant="h2" textAlign="center">
        Current theme is {themeVM.themeType}
      </Typography>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (ctx) => {
  const session = await getSession(ctx);
  const res = await fetch(
    `http${process.env.NODE_ENV === "development" ? '' : 's'}://${ctx.req.headers.host}/api/users/${session?.user.id}/house`, {
    method: "GET",
    headers: { "cookie": ctx.req.headers.cookie as string }
  })
  const data = await res.json();
  return {
    props: {
      initialState: {
        user: res.ok ? data.user : null
      }
    }
  }
}

export default observer(Home);

