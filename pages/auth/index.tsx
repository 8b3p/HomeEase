import AuthForm from "@/components/auth/AuthForm";
import AppVM from "@/context/appVM";
import { useAppVM } from "@/context/Contexts";
import { onLogin, onRegister } from "@/utils/apiService";
import { Send } from "@mui/icons-material";
import { Box, Grow } from "@mui/material";
import { observer } from "mobx-react-lite";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function Auth() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function signupHandler(Args: {
    password: string;
    email: string;
    username: { firstname: string; lastname: string };
  }) {
    const res = await onRegister(Args);
    if (!res.ok) {
      AppVM.showAlert(res.error?.errorMessage || "", "error");
      return;
    }
    AppVM.showAlert(
      "A sign in link has been sent to your email address.",
      "success"
    );
  }

  async function loginHandler(Args: { email: string; password: string }) {
    //*first: send the signin request with credentials
    const res = await onLogin({ ...Args, redirectUrl: "/" });
    if (!res.ok) {
      if (res.error?.unverifiedEmail) {
        AppVM.showAlert(res.error.errorMessage, "warning", {
          icon: <Send color='warning' />,
          action: () => {
            resendAuthEmail(Args.email);
          },
        });
        return;
      }
      AppVM.showAlert(res.error?.errorMessage || "", "error");
      return;
    }
    router.push((router.query?.redirectUrl as string) ?? "/");
    AppVM.showAlert("Login successful", "success");
  }

  useEffect(() => {
    // this is to prefetch the page that the user is trying to access, so that it loads faster
    router.prefetch((router.query?.redirectUrl as string) ?? "/");
  });

  async function submitHandler<
    T extends {
      password: string;
      email: string;
      username?: { firstname: string; lastname: string };
    }
  >(Args: T) {
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
      console.log(res?.error);
      if (res?.error == "EmailSignin") {
        AppVM.showAlert("Could not send email, please try again", "error");
      } else {
        AppVM.showAlert(res.error, "error");
      }
      return;
    }
    AppVM.showAlert(
      "A sign in link has been sent to your email address.",
      "success"
    );
  };

  return (
    <Grow in={true}>
      <Box sx={{ width: "100%", height: "100%" }}>
        <AuthForm
          submit={submitHandler}
          resendAuthEmail={resendAuthEmail}
          loading={loading}
        />
      </Box>
    </Grow>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);

  if (session) {
    ctx.res.writeHead(302, { Location: "/" }).end();
  }

  return { props: {} };
};

export default observer(Auth);
