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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) {
    ctx.res
      .writeHead(302, {
        Location: `/auth?redirectUrl=${encodeURIComponent(ctx.req.url || "/")}`,
      })
      .end();
  }

  return { props: {} }
}

export default Payments;
