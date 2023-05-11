import { useThemeVM, useAppVM } from "@/context/Contexts";
import { ThemeType } from "@/context/themeVM";
import { stringToColor } from "@/utils/stringToColor";
import { Assignment, AttachMoney, DarkMode, House, LightMode, Logout } from "@mui/icons-material";
import { Divider, Skeleton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { observer } from "mobx-react-lite";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

function stringAvatar(name: string, theme: ThemeType) {
  return {
    sx: {
      bgcolor: stringToColor(name, theme),
    },
    children: `${name.split(' ')[0][0].toUpperCase()}${name.split(' ')[1][0].toUpperCase()}`,
  };
}

const NavbarMenu = ({ isMobile }: { isMobile: boolean }) => {
  const appVM = useAppVM();
  const session = useSession();
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
    <div>
      {session.status === "authenticated" ? (
        <div>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: isMobile ? 0 : 2 }}
          >
            <Avatar variant="rounded"{...stringAvatar(session.data.user.name || '', themeVM.themeType)} />
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
            {isMobile && (
              <div>
                <MenuItem onClick={() => router.push('/chores')}>
                  <ListItemIcon>
                    <Assignment fontSize="small" />
                  </ListItemIcon>
                  Chores
                </MenuItem>
                <MenuItem onClick={() => router.push('/payments')}>
                  <ListItemIcon>
                    <AttachMoney fontSize="small" />
                  </ListItemIcon>
                  Payments
                </MenuItem>
              </div>
            )}
            <MenuItem onClick={() => {
              if (appVM.house) router.push(`/house/${appVM.house.id}`)
              else router.push('/house')
            }}>
              <ListItemIcon>
                <House fontSize="small" />
              </ListItemIcon>
              House Management
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { themeVM.toggleTheme() }}>
              <ListItemIcon>
                {themeVM.themeType === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </ListItemIcon>
              Change Theme
            </MenuItem>
            <MenuItem onClick={() => {
              signOut({
                redirect: true,
                callbackUrl: '/'
              })
            }}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      ) : session.status === "loading" ? (
        <div>
          <Skeleton variant="rounded" width={40} height={40} />
        </div >
      ) : (
        <div>
          <Button variant="text" onClick={() => { router.push('/auth') }} sx={{ textTransform: 'none' }}>Login</Button>
          <IconButton onClick={() => { themeVM.toggleTheme(); }}>
            {themeVM.themeType === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </div >
      )}
    </div >
  );
};

export default observer(NavbarMenu);
