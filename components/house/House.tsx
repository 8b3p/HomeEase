import { useAppVM } from "@/context/Contexts";
import { Check, CopyAll } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface props {
  baseUrl: string
  session: Session;
}

const House = ({ baseUrl, session }: props) => {
  const appVM = useAppVM();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linkButtonContent, setContent] = useState<string | JSX.Element>(<CopyAll />)
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const leaveHouseHandler = async () => {
    setLeaving(true);
    const res = await fetch(`/api/houses/${session.user.houseId}/users/${session.user.id}`, {
      method: "DELETE",
    })
    const data = await res.json();
    if (!res.ok) {
      appVM.showAlert(data.message, 'error')
      setLeaving(false);
      return;
    }
    appVM.house = null;
    setLeaving(false);
  }

  useEffect(() => {
    const getHouse = async () => {
      setLoading(true);
      const res = await fetch(`/api/houses/${session.user.houseId}`)
      const data = await res.json();
      if (!res.ok) {
        appVM.showAlert(data.message, 'error')
        return;
      }
      appVM.house = data.house;
      setLoading(false);
    }
    getHouse()
  }, [session.user.houseId, appVM])

  const copyLinkHandler = async () => {
    await navigator.clipboard.writeText(`${baseUrl}/house/join/${appVM.house?.invitationCode}`)
    setContent(<Check />)
    setTimeout(() => {
      setContent('Copy invitation link')
    }, 500)
  }

  return (
    <Stack height='100%' alignItems='center' justifyContent="start" paddingTop={isSmallScreen ? 0 : 4}>
      <Typography variant="h4">House Settings</Typography>
      {loading ? (<>loading</>) : (
        <Stack spacing={4} justifyContent="center" alignItems="center">
          {appVM.house?.users?.map((user) => (<Typography variant="h5" key={user.id}>{user.firstName + ' ' + user.lastName}</Typography>))}
          <Button variant="contained" onClick={copyLinkHandler} >{linkButtonContent}</Button>
          <LoadingButton color="error" loading={leaving} onClick={leaveHouseHandler}>Leave House</LoadingButton>
        </Stack>
      )}
    </Stack>
  );
};

export default observer(House);

