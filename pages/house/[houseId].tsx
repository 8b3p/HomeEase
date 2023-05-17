import { useAppVM } from "@/context/Contexts";
import { getBaseUrl } from "@/utils/apiService";
import { Check } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

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
  session: Session;
}

function copyToClipboard(text: string) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
}

const House = ({ house, baseUrl, session }: props) => {
  const appVM = useAppVM();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [linkButtonContent, setContent] = useState<string | JSX.Element>('Copy invitation link')

  const leaveHouseHandler = async () => {
    setLeaving(true);
    const res = await fetch(`/api/houses/${house?.id}/users/${session.user.id}`, {
      method: "DELETE",
    })
    const data = await res.json();
    if (!res.ok) {
      appVM.showAlert(data.error, 'error')
      setLeaving(false);
      return;

    }
    appVM.house = null;
    router.push('/');
    setLeaving(false);
  }

  const copyLinkHandler = () => {
    if (typeof linkButtonContent !== "string") return
    copyToClipboard(`${baseUrl}/house/join/${appVM.house?.invitationCode}`)
    setContent(<Check />)
    setTimeout(() => {
      setContent('Copy invitation link')
    }, 1000)
  }

  return (
    <Stack height='100%' alignItems='center' justifyContent="center">
      {appVM.house ? (
        <Stack spacing={4} justifyContent="center" alignItems="center">
          {house?.users.map((user) => (<Typography variant="h5" key={user.id}>{user.firstName + ' ' + user.lastName}</Typography>))}
          <Button variant="contained" onClick={copyLinkHandler} >{linkButtonContent}</Button>
          <LoadingButton color="error" loading={leaving} onClick={leaveHouseHandler}>Leave House</LoadingButton>
        </Stack>
      ) : (
        <Typography variant="h4">You are not part of this house</Typography>

      )}
    </Stack>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const houseId: string = ctx.params?.houseId as string
  const session = await getSession(ctx)

  if (!session) {
    return {
      props: {},
      redirect: {
        destination: `/auth?redirectUrl=${encodeURIComponent(ctx.req.url || "/")}`
      }
    }
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
  return {
    props: {
      session: session,
      house: data.house,
      baseUrl: getBaseUrl(ctx.req)
    }
  };
}

export default observer(House);

