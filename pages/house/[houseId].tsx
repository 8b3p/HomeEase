import { useAppVM } from "@/context/Contexts";
import { Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const House = () => {
  const appVM = useAppVM();

  return (
    <Stack height='100%' alignItems='center' justifyContent="center">
      {appVM.house ? (
        <Typography variant="h1">{appVM.house.name}</Typography>
      ) : (
        <Typography variant="h4">You are not part of a house</Typography>

      )}
    </Stack>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const houseId: string = ctx.params?.houseId as string
  const session = await getSession(ctx)

  if (!session) {
    ctx.res.writeHead(302, { Location: '/' }).end();
  }

  const res = await fetch(
    `http${process.env.NODE_ENV === "development" ? '' : 's'}://${ctx.req.headers.host}/api/house/${houseId}`, {
    method: "GET",
    headers: { "cookie": ctx.req.headers.cookie as string }
  })
  if (!res.ok) {
    if (res.status === 401) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    } else if (res.status === 404) {
      return {
        redirect: {
          destination: '/404',
          permanent: false
        }
      }
    }
    console.log('pages/house/[houseId] ', res.status, res.statusText)
    return { props: { house: null } };
  }
  const data = res.json()

  return { props: {} };
}

export default observer(House);

