import {
  makeStyles,
  Text,
  tokens,
} from "@fluentui/react-components";
import {
  iconFilledClassName,
  iconRegularClassName,
} from "@fluentui/react-icons";
import { observer } from "mobx-react-lite";

const useStyles = makeStyles({
  root: {
    display: "flex",
    // height: "calc(100% - 4rem)",
    height: "100vh",
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


const Home = () => {
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
