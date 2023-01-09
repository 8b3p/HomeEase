import { useThemeVM } from "context/Contexts";
import {
  Button,
  Divider,
  makeStyles,
  SelectTabData,
  Tab,
  TabList,
  Text,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import { observer } from "mobx-react-lite";
import { DarkThemeRegular } from "@fluentui/react-icons";
import { useRouter } from "next/router";
import NavbarMenu from "./NavbarMenu";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "4rem",
    paddingInline: "1rem",
    marginInline: "auto",
    backgroundColor: tokens.colorNeutralBackground1,
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
    marginInline: "1rem",
  },
  tabList: {
    marginInline: "1rem",
  },
});

const Navbar = () => {
  const classes = useStyles();
  const themeVM = useThemeVM();
  const router = useRouter();

  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <Text className={classes.logo} weight='semibold' size={700}>
          Omair
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
        <Tooltip content={<p>Change Theme</p>} relationship='inaccessible'>
          <Button
            icon={<DarkThemeRegular />}
            size='large'
            onClick={() => {
              themeVM.toggleTheme();
            }}
            appearance='transparent'
          />
        </Tooltip>
        <NavbarMenu />
      </div>
    </div>
  );
};

export default observer(Navbar);
