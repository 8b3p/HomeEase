import { useAppVM } from "@/context/Contexts";
import { UserPutRequestBody } from "@/pages/api/users/[userId]";
import { Check, Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Avatar, Button, Card, Chip, Divider, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Theme, Typography, useMediaQuery } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Password from "./Password";
import UserName from "./UserName";

const UserSettings = () => {
  const appVM = useAppVM();
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);


  const updateUser = async (body: UserPutRequestBody) => {
    setLoading(true);
    const res = await fetch(`/api/users/${session?.user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json();
    if (!res.ok) {
      appVM.showAlert(data.message, 'error');
    } else {
      if (body.name) {
        const capitalizedFirstName = body.name.firstname.charAt(0).toUpperCase() + body.name.firstname.slice(1);
        const capitalizedLastName = body.name.lastname.charAt(0).toUpperCase() + body.name.lastname.slice(1);
        console.log({ ...session?.user, name: capitalizedFirstName + " " + capitalizedLastName })
        const sess = await update({ user: { ...session?.user, name: capitalizedFirstName + " " + capitalizedLastName } });
        console.log(sess)
      }
      appVM.showAlert('User updated successfully', 'success');
    }
    setLoading(false);
  }


  return (
    <Stack height='100%' alignItems='center' justifyContent="start" paddingTop={4} spacing={4}>
      <Typography variant="h4">User Settings</Typography>
      {loading || status === "loading" ? (<>loading</>) : (
        <Stack spacing={2} justifyContent="center" alignItems="start" width="100%">
          {/*show user info*/}
          <Card sx={theme => ({ width: '100%', borderRadius: theme.shape.borderRadius })}>
            <Stack padding={3} spacing={2} justifyContent="center" alignItems="start" width="100%">
              <Stack direction="row" spacing={2} justifyContent="space-between" width="100%" alignItems="center">
                <ListItem alignItems="flex-start" disablePadding>
                  <ListItemText
                    sx={{ textTransform: 'capitalize' }}
                    primary={
                      <Typography
                        sx={{ display: 'inline', textTransform: 'capitalize' }}
                        component="span"
                        variant={isSmallScreen ? "body2" : "body1"}
                        color="text.secondary"
                      >
                        Name
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline', textTransform: 'capitalize' }}
                          component="span"
                          variant={isSmallScreen ? "subtitle1" : "h5"}
                          color="text.primary"
                        >
                          {session?.user.name}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <UserName session={session} updateUser={updateUser} />
              </Stack>
              <ListItem alignItems="flex-start" disablePadding>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ display: 'inline', textTransform: 'capitalize' }}
                      component="span"
                      variant={isSmallScreen ? "body2" : "body1"}
                      color="text.secondary"
                    >
                      Email
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant={isSmallScreen ? "subtitle1" : "h5"}
                        color="text.primary"
                      >
                        {session?.user.email}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </Stack>
          </Card>
          <Password session={session} updateUser={updateUser} />
        </Stack >
      )
      }
    </Stack >
  );
};

export default observer(UserSettings);

