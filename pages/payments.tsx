import { Stack, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const Payments = () => {
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ height: "100%", width: "100%" }}>
      <Typography variant="h1">I&apos;m a Payment</Typography>
    </Stack>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: `/auth?redirectUrl=${encodeURIComponent(
          ctx.req.url || "/"
        )}`,
      },
    };
  }
  if (!session?.user?.houseId) {
    return {
      props: {},
      redirect: {
        destination: `/house`,
      },
    };
  }
  return {
    props: {
      session: session,
    },
  };
};

export default Payments;
