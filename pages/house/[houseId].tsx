import { useAppVM } from "@/context/Contexts";
import { getBaseUrl } from "@/utils/apiService";
import { Button, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  baseUrl: string
}

function copyToClipboard(text: string) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
}

const House = ({ house, baseUrl }: props) => {
  const appVM = useAppVM();
  const router = useRouter();

  return (
    <Stack height='100%' alignItems='center' justifyContent="center">
      {appVM.house ? (
        <>
          <Typography variant="h1">{appVM.house.name} {house?.users.map((user) => (user.firstName + ' ' + user.lastName))}</Typography>
          <Button onClick={() => {
            copyToClipboard(`${baseUrl}/house/join/${appVM.house?.invitationCode}`)
          }}>Copy invitation link</Button>
        </>
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
    ctx.res
      .writeHead(302, {
        Location: `/auth?redirectUrl=${encodeURIComponent(ctx.req.url || "/")}`,
      })
      .end();
  }
  const res = await fetch(
    `${getBaseUrl(ctx.req)}/api/houses/${houseId}`, {
    method: "GET",
    headers: { "cookie": ctx.req.headers.cookie as string }
  })
  const data = await res.json();
  if (!res.ok) {
    return { props: { house: null } };
  }
  return { props: { house: data.house, baseUrl: getBaseUrl(ctx.req) } };
}

export default observer(House);

