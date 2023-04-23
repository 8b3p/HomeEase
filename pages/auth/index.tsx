import { ShowAlert } from "@/components/UI/Alert";
import AuthForm from "@/components/auth/AuthForm";
import { isThereUser, sendRegisterRequest } from "@/utils/apiService";
import { makeStyles, shorthands } from "@fluentui/react-components";
import { SendRegular } from "@fluentui/react-icons";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
  const session = useSession();
  const router = useRouter();
  if (session.status === "authenticated") {
    router.push("/");
  }

  const [loading, setLoading] = React.useState(false);

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
      console.error(res2);
      ShowAlert("Something went wrong, please try again", "error");
    } else if (!res2.userExists) {
      //*second: if not, send the register request
      const res1 = await sendRegisterRequest(Args);
      // handle error
      if (!res1.ok) {
        ShowAlert(res1.error?.errorMessage, "error");
        console.error(res1);
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
        console.error(res.error);
        ShowAlert(res.error, "error");
        return;
      }

      //*fourth: if the email verification request is successful, show a success message
      ShowAlert(
        "A sign in link has been sent to your email address.",
        "success"
      );
    } else {
      //*if the user already exists, show an error message
      console.error("user already exist");
      ShowAlert("User already exists", "error");
    }
  }

  async function loginHandler(Args: { email: string; password: string }) {
    //*first: send the signin request with credentials
    try {
      let res = await signIn("credentials", {
        redirect: false,
        email: Args.email,
        password: Args.password,
      });
      // handle error
      if (res?.error) {
        if (
          res.error === "Email not verified. click to send verification link"
        ) {
          ShowAlert(res.error, "error", {
            onClick: () => resendAuthEmail(Args.email),
            Icon: <SendRegular />,
          });
          return;
        }
        console.error(res);
        ShowAlert(res.error, "error");
        return;
      }
      //*second: if the signin request is successful, show a success message
      ShowAlert("You signed in successfully", "success");
    } catch (e) {
      console.error(e);
    }
  }

  async function submitHandler<
    T extends {
      password: string;
      email: string;
      username?: { firstname: string; lastname: string };
    }
  >(Args: T) {
    // resetMessages();
    setLoading(true);
    if (!Args.username) {
      //!login
      await loginHandler(Args as { email: string; password: string });
    } else {
      //!register
      await signupHandler(
        Args as {
          password: string;
          email: string;
          username: { firstname: string; lastname: string };
        }
      );
    }
    setLoading(false);
  }

  const resendAuthEmail = async (email: string) => {
    const res = await signIn("email", { redirect: false, email });
    if (res?.error) {
      ShowAlert(res.error, "error");
      return;
    }
    ShowAlert("A sign in link has been sent to your email address.", "success");
  };

  // const resetMessages = () => {
  //   setError(undefined);
  //   setSuccess(undefined);
  // };

  return (
    <div className={classes.container}>
      <AuthForm
        submit={submitHandler}
        resendAuthEmail={resendAuthEmail}
        loading={loading}
      />
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {},
  };
}

export default observer(Auth);
