import { themeVM } from "@/context/Contexts";
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SelectTabData,
  Tab,
  TabList,
  makeStyles,
} from "@fluentui/react-components";
import { DarkThemeRegular, SignOutRegular } from "@fluentui/react-icons";
import { observer } from "mobx-react-lite";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  tabList: {},
});

const NavbarMenu = () => {
  const session = useSession();
  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      {session.status === "authenticated" ? (
        <>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Avatar
                color='brand'
                size={40}
                name={session.data.user?.name || undefined}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem
                  icon={<DarkThemeRegular />}
                  onClick={() => {
                    themeVM.toggleTheme();
                  }}
                >
                  Toggle Theme
                </MenuItem>
                <MenuItem
                    icon={<SignOutRegular />}
                    onClick={async () => {
                      const data = await signOut({
                        callbackUrl: "/",
                        redirect: false,
                      });
                      router.push(data.url);
                    }}
                >
                  Signout
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </>
      ) : (
        <TabList
          className={classes.tabList}
          selectedValue={router.pathname}
          size='small'
          onTabSelect={(_e, data: SelectTabData) => {
            router.push(data.value as any as string);
          }}
        >
          <Button
            icon={<DarkThemeRegular />}
            size='large'
            onClick={() => {
              themeVM.toggleTheme();
            }}
            appearance='transparent'
          />
          <Tab value='/auth' key='auth' aria-label='auth'>
            Login
          </Tab>
        </TabList>
      )}
    </>
  );
};

export default observer(NavbarMenu);
