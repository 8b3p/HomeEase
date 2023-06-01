import { useAppVM } from "@/context/Contexts";
import { UserPutRequestBody } from "@/pages/api/users/[userId]";
import { Card, ListItem, ListItemText, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import Password from "./Password";
import UserName from "./UserName";
import { useSession } from "next-auth/react";
import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";

interface props {
  session: Session;
}

const UserSettings = ({ session }: props) => {
  const appVM = useAppVM();
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const router = useRouter();
  const {update} = useSession();
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
      appVM.showAlert('User updated successfully', 'success');
      update();
    }
    router.push('/profile')
    setLoading(false);
  }


  return (
    <Stack height='100%' alignItems='center' justifyContent="start" paddingTop={4} spacing={4}>
      <Typography variant="h4">User Settings</Typography>
      {loading ? (<Box sx={{paddingTop: '3rem'}}><CircularProgress /></Box>) : (
        <Stack spacing={2} justifyContent="center" alignItems="start" width="100%">
          {/*show user info*/}
          <Card sx={theme => ({ width: '100%', borderRadius: theme.shape.borderRadius })}>
            <Stack padding={3} spacing={1} justifyContent="center" alignItems="start" width="100%">
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
                      >Name</Typography>
                    }
                    secondary={
                        <Typography
                          sx={{ display: 'block', textTransform: 'capitalize' }}
                          component="span"
                          variant={isSmallScreen ? "subtitle1" : "h5"}
                          color="text.primary"
                        >{session?.user.name}</Typography>
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
                    > Email </Typography>
                  }
                  secondary={
                      <Typography
                        component="span"
                        variant={isSmallScreen ? "subtitle1" : "h5"}
                        sx={{display: 'block'}}
                        color="text.primary"
                      > {session?.user.email} </Typography>
                  }
                />
              </ListItem>
              <ListItem alignItems="flex-start" disablePadding>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ display: 'inline', textTransform: 'capitalize' }}
                      component="span"
                      variant={isSmallScreen ? "body2" : "body1"}
                      color="text.secondary"
                    > Password </Typography>
                  }
                  secondary={
                      <Password session={session} updateUser={updateUser} />
                  }
                />
              </ListItem>
            </Stack>
          </Card>
        </Stack >
      )
      }
    </Stack >
  );
};

export default observer(UserSettings);

