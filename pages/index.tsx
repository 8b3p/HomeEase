import { useThemeVM } from "@/context/Contexts";
import themeVM from "@/context/themeVM";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Text,
  makeStyles,
} from "@fluentui/react-components";
import {
  Copy24Filled,
  Copy24Regular,
  DarkTheme24Filled,
  DarkTheme24Regular,
  bundleIcon,
  iconFilledClassName,
  iconRegularClassName,
} from "@fluentui/react-icons";
import { observer } from "mobx-react-lite";

interface props {
  children: React.ReactNode;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "calc(100% - 4rem)",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    ":hover": {
      [`& > span .${iconFilledClassName}`]: {
        display: "none",
      },
      [`& > span .${iconRegularClassName}`]: {
        display: "inline",
      },
    },
  },
});

const CopyIcon = bundleIcon(Copy24Filled, Copy24Regular);

const Home = ({ children }: props) => {
  const classes = useStyles();
  const themeVM = useThemeVM();

  return (
    <div className={classes.root}>
      <Text align='center' size={600} weight='semibold'>
        Welcome to the home page
      </Text>
    </div>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default observer(Home);
