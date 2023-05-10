import AuthForm from "@/components/auth/AuthForm";
import { useAppVM } from "@/context/Contexts";
import { onLogin, onRegister } from "@/utils/apiService";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";


function Auth() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const appVM = useAppVM();
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
      appVM.showAlert(res.error?.errorMessage || "", "error")
      return;
    }
    appVM.showAlert('A sign in link has been sent to your email address.', 'success')
  }

  async function loginHandler(Args: { email: string; password: string }) {
    //*first: send the signin request with credentials
    const res = await onLogin(Args);
    if (!res.ok) {
      if (res.error?.unverifiedEmail) {
        appVM.showAlert(res.error.errorMessage, "error")
        return;
      }
      appVM.showAlert(res.error?.errorMessage || "", "error")
      return;
    }
    console.log(res)
    appVM.showAlert("Login successful", "success")
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
      appVM.showAlert(res.error, "error")
      return;
    }
    appVM.showAlert('A sign in link has been sent to your email address.', 'success')
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <AuthForm submit={submitHandler} resendAuthEmail={resendAuthEmail} loading={loading} />
    </Box>
  );
}

export default observer(Auth);
