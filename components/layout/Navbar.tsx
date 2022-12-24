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
} from "@fluentui/react-components";
import { observer } from "mobx-react-lite";
import { DarkTheme24Regular } from "@fluentui/react-icons";
import { useRouter } from "next/router";

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

        <Button
          icon={<DarkTheme24Regular />}
          appearance='transparent'
          onClick={() => {
            themeVM.toggleTheme();
          }}
        />
      </div>
    </div>
  );
};

export default observer(Navbar);
