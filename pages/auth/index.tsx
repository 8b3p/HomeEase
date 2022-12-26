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

  async function signupHandler(Args: {
    password: string;
    email: string;
    username: { firstname: string; lastname: string };
  }) {
    //*first: check if the user already exists
    const res2 = await isThereUser(Args.email);
    // handle error
    if (res2.error) {
      console.dir(res2);
      console.error(res2.error.errorMessage);
      setError("Something went wrong, please try again");
    } else if (!res2.userExists) {
      //*second: if not, send the register request
      const res1 = await sendRegisterRequest(Args);
      // handle error
      if (!res1.ok) {
        setError(res1.error?.errorMessage);
        console.dir(res1);
        return;
      }

      //*third: if the register request is successful, send the email verification request
      const res = await signIn("email", {
        redirect: false,
        email: Args.email,
        callbackUrl: "/",
      });
      // handle error
      if (res?.error) {
        console.dir(res.error);
        setError(res.error);
        return;
      }

      //*fourth: if the email verification request is successful, show a success message
      setSuccess("A sign in link has been sent to your email address.");
    } else {
      //*if the user already exists, show an error message
      console.error("user already exist");
      setError("User already exists");
    }
  }

  async function loginHandler(Args: { email: string; password: string }) {
    //*first: send the signin request with credentials
    let res = await signIn("credentials", {
      redirect: false,
      email: Args.email,
      password: Args.password,
    });
    // handle error
    if (res?.error) {
      console.log(res.error);
      console.dir(res);
      setError(res.error);
      return;
    }
    //*second: if the signin request is successful, show a success message
    setSuccess("You have been signed in.");
  }

  async function submitHandler<
    T extends {
      password: string;
      email: string;
      username?: { firstname: string; lastname: string };
    }
  >(Args: T) {
    resetMessages();
    console.dir(session);
    if (!Args.username) {
      //!login
      console.log("Login");
      await loginHandler(Args as { email: string; password: string });
    } else {
      //!register
      console.log("Register");
      await signupHandler(
        Args as {
          password: string;
          email: string;
          username: { firstname: string; lastname: string };
        }
      );
    }
  }

  const resendAuthEmail = async (email: string) => {
    signIn("email", { redirect: false, email });
  };

  const resetMessages = () => {
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
