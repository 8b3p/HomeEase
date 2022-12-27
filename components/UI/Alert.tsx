import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { Alert } from "@fluentui/react-components/unstable";
import { DismissRegular } from "@fluentui/react-icons";
import React from "react";
import { Root, createRoot } from "react-dom/client";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    top: "5rem",
    left: "100%",
    width: "70%",
    minWidth: "230px",
    maxWidth: "360px",
    "& > div": {
      position: "relative",
      left: "calc(-100% - 1rem)",
      maxWidth: "310px",
      paddingBottom: "0.3rem",
      ...shorthands.padding("1rem"),
    },
    "& > .loadingBar": {
      ...shorthands.padding("0"),
      position: "absolute",
      top: "calc(100% - 0.3rem)",
      left: "calc(-100% - 1rem)",
      width: "100%",
      height: "0.3rem",
      zIndex: "1111",
      backgroundColor: tokens.colorNeutralStrokeAccessible,
      ...shorthands.borderRadius("0.3rem"),
      animationName: {
        from: {
          width: "0%",
        },
        to: { width: "100%" },
      },
      animationDuration: "3s",
      animationTimingFunction: "linear",
    },
    animationName: {
      from: {
        top: "3rem",
        opacity: 0,
      },
      to: {
        top: "5rem",
        opacity: 1,
      },
    },
    animationDuration: "0.3s",
  },
  fadeout: {
    animationName: {
      from: {
        top: "5rem",
        opacity: 1,
      },
      to: {
        top: "6rem",
        opacity: 0,
      },
    },
    animationDuration: "0.3s",
  },
});

let container: HTMLElement | null = null;
let timeout: NodeJS.Timeout | null = null;
let lastAlert: number = 1;

interface props {
  children: React.ReactNode;
  intent: "success" | "error" | "warning" | "info";
  Action?: {
    Icon: JSX.Element;
    onClick: () => void;
  };
}

const MyAlert = ({ children, intent, Action }: props) => {
  const classes = useStyles();
  const [mergedClasses, setMergedClasses] = React.useState(classes.root);

  setTimeout(() => {
    setMergedClasses(`${classes.root} ${classes.fadeout}`);
  }, 3000);

  return (
    <div className={mergedClasses}>
      {Action ? (
        <Alert
          intent={intent}
          action={{
            icon: Action.Icon,
            onClick: () => {
              Action.onClick();
            },
          }}
        >
          <div style={{ padding: "0.4rem" }}>{children}</div>
        </Alert>
      ) : (
        <Alert intent={intent}>{children}</Alert>
      )}
      <div
        className={"loadingBar"}
        style={
          intent === "error"
            ? { backgroundColor: "red" }
            : intent === "info"
            ? { backgroundColor: "cyan" }
            : intent === "warning"
            ? { backgroundColor: "yellow" }
            : { backgroundColor: "green" }
        }
      />
    </div>
  );
};

const removeAlert = () => {
  if (timeout) {
    clearTimeout(timeout);
    document.getElementById("alert" + lastAlert)?.remove();
    timeout = null;
  }
};

export const ShowAlert = (
  children: React.ReactNode,
  intent: "success" | "error" | "warning" | "info",
  Action?: {
    Icon: JSX.Element;
    onClick: () => void;
  }
) => {
  removeAlert();
  const defaultAction = Action
    ? Action
    : {
        Icon: <DismissRegular />,
        onClick: removeAlert,
      };
  let newAlert = document.createElement("div");
  newAlert.setAttribute("id", "alert" + lastAlert);
  let root: Root;
  if (!container) container = document.getElementById("alert");
  if (container) {
    newAlert = container.appendChild(newAlert);
    root = createRoot(newAlert);
    if (!root) return;

    root.render(
      <MyAlert intent={intent} Action={defaultAction}>
        {children}
      </MyAlert>
    );

    timeout = setTimeout(removeAlert, 3300);
  }
};

export default MyAlert;
