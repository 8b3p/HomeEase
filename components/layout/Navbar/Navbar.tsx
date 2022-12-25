import { useThemeVM } from "context/Contexts";
import {
  Avatar,
  Button,
  Divider,
  makeStyles,
  SelectTabData,
  Tab,
  TabList,
  Text,
  tokens,
} from "@fluentui/react-components";
import { observer } from "mobx-react-lite";
import { DarkTheme24Regular, DarkThemeRegular } from "@fluentui/react-icons";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import NavbarMenu from "./NavbarMenu";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "4rem",
    paddingInline: "1rem",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    rowGap: "1rem",
    columnGap: "1rem",
  },
  logo: {
    marginRight: "1rem",
  },
  tabList: {
    marginInline: "1rem",
  },
});

const Navbar = () => {
  const classes = useStyles();
  const themeVM = useThemeVM();
  const router = useRouter();
  const session = useSession();

  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <Text className={classes.logo} weight='semibold' size={700}>
          Fluent UI
        </Text>
        <Divider vertical />
        <TabList
          selectedValue={router.pathname}
          size='small'
          className={classes.tabList}
          onTabSelect={(e, data: SelectTabData) => {
            router.push(data.value as any as string);
          }}
        >
          <Tab value='/' key='home' aria-label='Home'>
            Home
          </Tab>
          <Tab value='/payments' key='payments' aria-label='payments'>
            Payments
          </Tab>
          <Tab value='/chores' key='chores' aria-label='chores'>
            Chores
          </Tab>
        </TabList>
      </div>
      <div className={classes.section}>
        <NavbarMenu />
        <Button
          icon={<DarkThemeRegular />}
          onClick={() => {
            themeVM.toggleTheme();
          }}
          appearance='transparent'
        />
      </div>
    </div>
  );
};

export default observer(Navbar);
