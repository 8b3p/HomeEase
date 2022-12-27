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
import {
  ClipboardPaste20Filled,
  Copy20Filled,
  Cut20Filled,
  DarkTheme24Filled,
  DarkTheme24Regular,
  SignOut24Regular,
  SignOutRegular,
} from "@fluentui/react-icons";
import { observer } from "mobx-react-lite";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  tabList: {
    marginInline: "1rem",
  },
});

const NavbarMenu = () => {
  const session = useSession();
  const classes = useStyles();
  const router = useRouter();

  return (
    <>
      {session.status === "authenticated" ? (
        <>
          <Button
            icon={<SignOutRegular />}
            size='large'
            appearance='transparent'
            onClick={() => {
              signOut({ callbackUrl: "/", redirect: true });
            }}
          />
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
                  icon={<DarkTheme24Regular />}
                  onClick={() => {
                    themeVM.toggleTheme;
                  }}
                >
                  Toggle Theme
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
          onTabSelect={(e, data: SelectTabData) => {
            router.push(data.value as any as string);
          }}
        >
          <Tab value='/auth' key='auth' aria-label='auth'>
            Login
          </Tab>
        </TabList>
      )}
    </>
  );
};

export default observer(NavbarMenu);
