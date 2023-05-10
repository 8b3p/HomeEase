import { useAppVM } from "@/context/Contexts";
import { getBaseUrl } from "@/utils/apiService";
import { Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useEffect } from "react";

interface props {
  house: {
    id: string;
    name: string;
    invitationCode: string;
    users: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      houseId: string;
    }[]
  } | null
}

const House = ({ house }: props) => {
  const appVM = useAppVM();

  return (
    <Stack height='100%' alignItems='center' justifyContent="center">
      {appVM.house ? (
        <Typography variant="h1">{appVM.house.name} {house?.users.map((user) => (user.firstName + ' ' + user.lastName))}</Typography>
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
    `${getBaseUrl(ctx.req)}/api/houses/${houseId}`, {
    method: "GET",
    headers: { "cookie": ctx.req.headers.cookie as string }
  })
  const data = await res.json();
  console.log(data.house)
  if (!res.ok) {
    return { props: { house: null } };
  }
  return { props: { house: data.house } };
}

export default observer(House);

