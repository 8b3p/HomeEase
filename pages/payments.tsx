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
const Payments = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Text size={600}>I'm a Payment</Text>
    </div>
  );
};

export default Payments;
