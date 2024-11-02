import React, { useState } from "react";
import { Avatar, Button, IconButton, ListItemIcon, Menu, MenuItem, Skeleton, Stack, useMediaQuery, } from "@mui/material";
import { Assignment, AttachMoney, DarkMode, LightMode, Menu as MenuIcon, Logout, Person, } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { stringToColor } from "@utils/stringToColor";
import { useThemeVM } from "@context/Contexts";
import { ThemeType } from "@context/themeVM";

interface NavbarMenuProps { }

export function stringAvatar(name: string, theme: ThemeType) {
  return {
    sx: { bgcolor: stringToColor(name, theme) },
    children: `${name.split(" ")[0][0].toUpperCase()}${name
      .split(" ")[1][0]
      .toUpperCase()}`,
  };
}

const NavbarMenu: React.FC<NavbarMenuProps> = () => {
  const { status } = useSession();
  const themeVM = useThemeVM();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Menu Items
  const menuItems = [
    {
      label: "Chores",
      icon: <Assignment fontSize="small" />,
      onClick: () => {
        router.push("/chores");
        handleMenuClose();
      },
    },
    {
      label: "Payments",
      icon: <AttachMoney fontSize="small" />,
      onClick: () => {
        router.push("/payments");
        handleMenuClose();
      },
    },
    {
      label:
        themeVM.themeType === "dark" ? "Light Mode" : "Dark Mode",
      icon:
        themeVM.themeType === "dark" ? (
          <LightMode fontSize="small" />
        ) : (
          <DarkMode fontSize="small" />
        ),
      onClick: () => {
        themeVM.toggleTheme();
        handleMenuClose();
      },
    },
    {
      label: "Profile",
      icon: <Person fontSize="small" />,
      onClick: () => {
        router.push("/profile");
        handleMenuClose();
      },
    },
    {
      label: "Logout",
      icon: <Logout fontSize="small" />,
      onClick: () => {
        signOut({ redirect: true, callbackUrl: "/" });
        handleMenuClose();
      },
    },
  ];

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {status === "authenticated" ? (
        <>
          {!isMobile && (
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton onClick={() => themeVM.toggleTheme()} sx={{ padding: "0.75rem" }}>
                {themeVM.themeType === "dark" ? <LightMode /> : <DarkMode />}
              </IconButton>
              <IconButton onClick={() => router.push("/profile")} sx={{ padding: "0.75rem" }}>
                <Person />
              </IconButton>
              <IconButton onClick={() => signOut({ redirect: true, callbackUrl: "/" })} sx={{ padding: "0.75rem" }}>
                <Logout />
              </IconButton>
            </Stack>
          )}
          {isMobile && (
            <div>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ padding: "0.75rem" }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* Mobile: Display Menu Items */}
                {isMobile &&
                  menuItems.map((item) => (
                    <MenuItem key={item.label} onClick={item.onClick}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      {item.label}
                    </MenuItem>
                  ))}
                {/* Non-mobile: No additional items */}
              </Menu>
            </div>
          )}
        </>
      ) : status === "loading" ? (
        // Loading State: Show Skeleton
        <Avatar variant="rounded">
          <Skeleton variant="circular" width={40} height={40} />
        </Avatar>
      ) : (
        // Not Authenticated: Show Login Button and Theme Toggle
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="text"
            onClick={() => {
              router.push("/auth");
            }}
            sx={{ textTransform: "none" }}
          >
            Login
          </Button>
          <IconButton onClick={() => themeVM.toggleTheme()}>
            {themeVM.themeType === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
};

export default observer(NavbarMenu);

