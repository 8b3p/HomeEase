import { Avatar, ListItem, ListItemAvatar, ListItemText, Stack, Typography, useMediaQuery } from "@mui/material";
import { User } from "@prisma/client";
import { observer } from "mobx-react-lite";
import { stringAvatar } from "@components/layout/Navbar/NavbarMenu";
import { useThemeVM } from "@/context/Contexts";

interface props {
  user: Partial<User>;
}

const HouseUser = ({ user }: props) => {
  const themeVM = useThemeVM();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <Stack spacing={4} justifyContent="center" alignItems="center">
      <ListItem alignItems="flex-start" disablePadding>
        <ListItemAvatar>
          <Avatar
            {...stringAvatar(user.firstName + " " + user.lastName, themeVM.themeType)}
          />
        </ListItemAvatar>
        <ListItemText
          sx={{ textTransform: 'capitalize' }}
          primary={
              <Typography
                sx={{ display: 'block' }}
                component="span"
                variant="body2"
                color="text.secondary"
              >
                Name
              </Typography>
          }
          secondary={
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body1"
              color="text.primary"
            >
              {user.firstName} {user.lastName}
            </Typography>
          }
        />
      </ListItem>
    </Stack>
  );
};

export default observer(HouseUser);
