import AuthForm from "@/components/auth/AuthForm";
import { isThereUser, sendRegisterRequest } from "@/utils/apiService";
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
    //*first: check if the user already exists
    const res2 = await isThereUser(Args.email);
    // handle error
    if (res2.error) {
      console.error(res2);
      setError("Something went wrong, please try again");
    } else if (!res2.userExists) {
      //*second: if not, send the register request
      const res1 = await sendRegisterRequest(Args);
      // handle error
      if (!res1.ok) {
        setError(res1.error?.errorMessage)
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
        setError(res.error)
        return;
      }

      //*fourth: if the email verification request is successful, show a success message
      setSuccess('A sign in link has been sent to your email address.')
    } else {
      //*if the user already exists, show an error message
      console.error("user already exist");
      setError('User already exists')
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
          // ShowAlert(res.error, "error", {
          //   onClick: () => resendAuthEmail(Args.email),
          //   Icon: <SendRegular />,
          // });
          // TODO : add resend email verification link
          return;
        }
        console.error(res);
        setError(res.error)
        return;
      }
      //*second: if the signin request is successful, show a success message
      setSuccess('You signed in successfully')
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
