import { Text, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "calc(100% - 4rem)",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Chores = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Text size={600}>I'm a Chore</Text>
    </div>
  );
};

export default Chores;
