import { useAppVM } from "@context/Contexts";
import { ContentCopy } from "@mui/icons-material";
import {
  Button,
  Card,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import HouseUser from "./HouseUser";
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { Grid2 } from "@mui/material";
import AppVM from "@context/appVM";

interface props {
  baseUrl: string;
  session: Session;
}

const House = ({ baseUrl, session }: props) => {
  const appVM = useAppVM();
  const [leaving, setLeaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [linkButtonContent, setContent] = useState<string | JSX.Element>(
    "Invitation Link"
  );
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const router = useRouter();

  const leaveHouseHandler = async () => {
    setLeaving(true);
    const res = await fetch(
      `/api/houses/${session.user.houseId}/users/${session.user.id}`,
      {
        method: "DELETE",
      }
    );
    const data = await res.json();
    if (!res.ok) {
      AppVM.showAlert(data.message, "error");
      setLeaving(false);
      return;
    }
    router.push("/profile");
  };

  useEffect(() => {
    const getHouse = async () => {
      setLoading(true);
      const res = await fetch(`/api/houses/${session.user.houseId}`);
      const data = await res.json();
      if (!res.ok) {
        AppVM.showAlert(data.message, "error");
        return;
      }
      appVM.house = data.house;
      setLoading(false);
    };
    getHouse();
  }, [session.user.houseId, appVM]);

  const copyLinkHandler = async () => {
    await navigator.clipboard.writeText(
      `${baseUrl}/house/join/${appVM.house?.invitationCode}`
    );
    setContent("Copied!");
    setTimeout(() => {
      setContent("Invitation Link");
    }, 1000);
  };

  return (
    <Stack
      height='100%'
      alignItems='center'
      justifyContent='start'
      paddingBottom={1}
      paddingTop={isSmallScreen ? 0 : 4}
      spacing={4}
    >
      <Typography variant='h4'>House Settings</Typography>
      {loading ? (
        <Box sx={{ paddingTop: "3rem" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card
          sx={theme => ({
            width: "100%",
            borderRadius: theme.shape.borderRadius,
          })}
        >
          <Stack
            padding={3}
            spacing={1}
            justifyContent='center'
            alignItems='start'
            width='100%'
          >
            <ListItem alignItems='flex-start' disablePadding>
              <ListItemText
                primary={
                  <Typography
                    sx={{ display: "inline", textTransform: "capitalize" }}
                    variant={isSmallScreen ? "body2" : "body1"}
                    color='text.secondary'
                  >
                    House Name
                  </Typography>
                }
                secondary={
                  <Typography
                    variant={isSmallScreen ? "subtitle1" : "h5"}
                    sx={{ display: "block" }}
                    color='text.primary'
                  >
                    {" "}
                    {appVM.house?.name}{" "}
                  </Typography>
                }
              />
            </ListItem>
            <Stack
              direction='row'
              spacing={2}
              justifyContent='space-between'
              width='100%'
              alignItems='center'
            >
              <ListItem alignItems='flex-start' disablePadding>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ display: "inline", textTransform: "capitalize" }}
                      variant={isSmallScreen ? "body2" : "body1"}
                      color='text.secondary'
                    >
                      Invitation Code
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant={isSmallScreen ? "subtitle1" : "h5"}
                      sx={{ display: "block" }}
                      color='text.primary'
                    >
                      {" "}
                      {appVM.house?.invitationCode}{" "}
                    </Typography>
                  }
                />
              </ListItem>
              <IconButton
                onClick={() => {
                  appVM.house?.invitationCode &&
                    navigator.clipboard.writeText(appVM.house?.invitationCode);
                }}
              >
                <ContentCopy color='primary' />
              </IconButton>
            </Stack>
            <Grid2 container columns={21} spacing={1} width='100%'>
              <Grid2>
                <Stack
                  justifyContent='center'
                  alignItems='center'
                  height='100%'
                  width='100%'
                >
                  <Button onClick={copyLinkHandler} sx={{ cursor: "pointer" }}>
                    {linkButtonContent}
                  </Button>
                </Stack>
              </Grid2>
              <Grid2>
                <Divider orientation='vertical' />
              </Grid2>
              <Grid2>
                <Stack
                  justifyContent='center'
                  alignItems='center'
                  height='100%'
                  width='100%'
                >
                  <Button
                    color='error'
                    onClick={leaveHouseHandler}
                    disabled={leaving}
                  >
                    {leaving ? <CircularProgress size={24} /> : "Leave House"}
                  </Button>
                </Stack>
              </Grid2>
            </Grid2>
            <Divider flexItem />
            <Typography variant='h4'>Members</Typography>
            {appVM.house?.users?.map(user => (
              <HouseUser key={user.id} user={user} />
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  );
};

export default observer(House);
