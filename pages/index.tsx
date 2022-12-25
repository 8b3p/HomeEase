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
});

const Home = ({ children }: props) => {
  const classes = useStyles();

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
