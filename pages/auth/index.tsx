import AuthForm from "@/components/auth/AuthForm";
import { isThereUser, sendRegisterRequest } from "@/utils/apiService";
import { makeStyles, shorthands } from "@fluentui/react-components";
import { Alert } from "@fluentui/react-components/unstable";
import { DismissRegular } from "@fluentui/react-icons";
import { observer } from "mobx-react-lite";
import { signIn, useSession } from "next-auth/react";
import React from "react";

const useStyles = makeStyles({
  container: {
    height: "100%",
    width: "100%",
  },
  alert: {
    position: "absolute",
    top: "12.5%",
    left: "50%",
    width: "70%",
    minWidth: "230px",
    maxWidth: "330px",
    "& > div": {
      position: "relative",
      left: "-50%",
      ...shorthands.padding("1rem"),
    },
  },
});

function Auth() {
  const [error, setError] = React.useState<string | undefined>();
  const [success, setSuccess] = React.useState<string | undefined>();
  const session = useSession();
  const classes = useStyles();

  async function submitHandler<
    T extends {
      password: string;
      email: string;
      username?: { firstname: string; lastname: string };
    }
  >(Args: T) {
    resetErrors();
    console.dir(session);
    if (!Args.username) {
      //login
      console.log("Login");
      let res = await signIn("credentials", {
        redirect: false,
        email: Args.email,
        password: Args.password,
      });
      if (res?.error) {
        console.log(res.error);
        console.dir(res);
        setError(res.error);
        return;
      }
      console.dir(res);
      setSuccess("You have been signed in.");
    } else {
      console.log("Register");
      const res2 = await isThereUser(Args.email);
      if (res2.error) {
        console.dir(res2);
        console.error(res2.error.errorMessage);
        setError("Something went wrong, please try again");
      } else if (!res2.userExists) {
        const res1 = await sendRegisterRequest(Args);

        if (!res1.ok) {
          setError(res1.error?.errorMessage);
          console.dir(res1);
          return;
        }
        // signIn("credentials", {
        //   redirect: false,
        //   username: Args.username,
        //   password: Args.password,
        // });

        const res = await signIn("email", {
          redirect: false,
          email: Args.email,
          callbackUrl: "/",
        });
        if (res?.error) {
          console.dir(res.error);
          setError(res.error);
          return;
        }
        setSuccess("A sign in link has been sent to your email address.");
      } else {
        console.error("user already exist");
        setError("User already exists");
      }
    }
  }

  const resendAuthEmail = async (email: string) => {
    signIn("email", { redirect: false, email });
  };

  const resetErrors = () => {
    setError(undefined);
    setSuccess(undefined);
  };

  return (
    <div className={classes.container}>
      {error && (
        <div className={classes.alert}>
          <Alert
            intent='error'
            action={{
              icon: <DismissRegular />,
              onClick: () => setError(undefined),
            }}
          >
            {error}
          </Alert>
        </div>
      )}
      {success && (
        <div className={classes.alert}>
          <Alert
            intent='success'
            action={{
              icon: <DismissRegular />,
              onClick: () => setSuccess(undefined),
            }}
          >
            {success}
          </Alert>
        </div>
      )}
      <AuthForm submit={submitHandler} resendAuthEmail={resendAuthEmail} />
    </div>
  );
}

export default observer(Auth);
