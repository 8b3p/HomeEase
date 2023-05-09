import AuthForm from "@/components/auth/AuthForm";
import { onLogin, onRegister } from "@/utils/apiService";
import { Alert, Box, Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";


function Auth() {
  const [error, setError] = React.useState<string | undefined>();
  const [success, setSuccess] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const session = useSession();
  if (session.status === "authenticated") {
    router.push("/");
  }

  async function signupHandler(Args: {
    password: string;
    email: string;
    username: { firstname: string; lastname: string };
  }) {
    const res = await onRegister(Args);
    if (!res.ok) {
      setError(res.error?.errorMessage)
      console.error(res);
      return;
    }
    setSuccess('A sign in link has been sent to your email address.')
  }

  async function loginHandler(Args: { email: string; password: string }) {
    //*first: send the signin request with credentials
    const res = await onLogin(Args);
    if (!res.ok) {
      if (res.error?.unverifiedEmail) {
        // ShowAlert(res.error, "error", {
        //   onClick: () => resendAuthEmail(Args.email),
        //   Icon: <SendRegular />,
        // });
        // TODO : add resend email verification link
      }
      setError(res.error?.errorMessage)
    }
    setSuccess('You signed in successfully')
  }

  async function submitHandler<T extends {
    password: string;
    email: string;
    username?: { firstname: string; lastname: string };
  }>(Args: T) {
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
      setError(res.error);
      return;
    }
    setSuccess("A sign in link has been sent to your email address.")
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(undefined);
    setSuccess(undefined);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Snackbar open={success || error ? true : false} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error ? error : success}
        </Alert>
      </Snackbar>
      <AuthForm submit={submitHandler} resendAuthEmail={resendAuthEmail} loading={loading} />
    </Box>
  );
}

export default observer(Auth);
