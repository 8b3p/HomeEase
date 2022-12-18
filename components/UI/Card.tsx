import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border(`1px solid ${tokens.colorSubtleBackgroundHover}`),
    ...shorthands.borderRadius("0.5rem"),
    ...shorthands.padding("1rem"),
    width: "fit-content",
    height: "fit-content",
    boxShadow: `0 0 10px 2px ${tokens.colorNeutralShadowAmbient}, 0 0 0 1px ${tokens.colorSubtleBackgroundHover}`,
  },
});

interface props {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className, ...props }: props) => {
  const classes = useStyles();
  return <div className={classes.root + " " + className}>{children}</div>;
};

export default Card;
