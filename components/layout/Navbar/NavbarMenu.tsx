import { useThemeVM, useAppVM } from "@/context/Contexts";
import { stringToColor } from "@/utils/stringToColor";
import { DarkMode, House, LightMode, Logout } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { observer } from "mobx-react-lite";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";



function stringAvatar(name: string) {
  console.log(name)
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0].toUpperCase()}${name.split(' ')[1][0].toUpperCase()}`,
  };
}


const NavbarMenu = () => {
  const appVM = useAppVM();
  const themeVM = useThemeVM();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {appVM.user ? (
        <>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
          >
            <Avatar variant="rounded"{...stringAvatar(appVM.fullName || '')} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { router.push('/house') }}>
              <ListItemIcon>
                <House fontSize="small" />
              </ListItemIcon>
              Manage House
            </MenuItem>
            <MenuItem onClick={() => { themeVM.toggleTheme() }}>
              <ListItemIcon>
                {themeVM.themeType === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </ListItemIcon>
              Change Theme
            </MenuItem>
            <MenuItem onClick={() => { signOut() }}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Button variant="text" onClick={() => { router.push('/auth') }} sx={{ textTransform: 'none' }}>Login</Button>
          <IconButton onClick={() => { themeVM.toggleTheme(); }}>
            {themeVM.themeType === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </>
      )}
    </>
  );
};

export default observer(NavbarMenu);
