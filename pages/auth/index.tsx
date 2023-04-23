import AuthForm from "@/components/auth/AuthForm";
import { isThereUser } from "@/utils/apiService";
import { Alert, Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { signIn } from "next-auth/react";
import React from "react";

// const useStyles = makeStyles({
//   container: {
//     height: "100%",
//     width: "100%",
//   },
//   alert: {
//     position: "absolute",
//     top: "12.5%",
//     left: "50%",
//     width: "70%",
//     minWidth: "230px",
//     maxWidth: "330px",
//     "& > div": {
//       position: "relative",
//       left: "-50%",
//       ...shorthands.padding("1rem"),
//     },
//   },
// });

function Auth() {
  const [error, setError] = React.useState<string | undefined>();
  const [success, setSuccess] = React.useState<string | undefined>();

  async function submitHandler<
    T extends { username: string; password: string; email?: string }
  >(Args: T) {
    if (!Args.email) {
      //login
      console.log("Login");
      let res = await signIn("credentials", {
        redirect: false,
        username: Args.username,
        password: Args.password,
      });
      if (res?.error) console.log(res.error);
      console.dir(res);
      setError("Something went wrong, please try again");
    } else {
      console.log("Register");
      // const res = await sendRegisterRequest(Args);

      // if (!res.ok) {
      //   setError(res.error?.errorMessage);
      //   console.dir(res);
      //   return;
      // }
      // signIn("credentials", {
      //   redirect: false,
      //   username: Args.username,
      //   password: Args.password,
      // });
      const res = await isThereUser(Args.email);
      if (res.error) {
        console.dir(res);
        console.error(res.error.errorMessage);
        setError("Something went wrong, please try again");
      } else if (!res.userExists) {
        const res1 = await signIn("email", {
          redirect: false,
          email: Args.email,
          callbackUrl: "/",
        });
        if (res1?.error) {
          console.dir(res1.error);
          setError(res1.error);
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

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {error && (
        <Box sx={{
          position: "absolute",
          top: "12.5%",
          left: "50%",
          width: "70%",
          minWidth: "230px",
          maxWidth: "330px",
        }} >
          <Alert
            severity="error"
            onClose={() => setError(undefined)}
          >
            {error}
          </Alert>
        </Box>
      )}
      {success && (
        <Box sx={{
          position: "absolute",
          top: "12.5%",
          left: "50%",
          width: "70%",
          minWidth: "230px",
          maxWidth: "330px",
        }} >
          <Alert
            severity="success"
            onClose={() => setSuccess(undefined)}
          >
            {success}
          </Alert>
        </Box>
      )}
      <AuthForm submit={submitHandler} resendAuthEmail={resendAuthEmail} />
    </Box>
  );
}

export default observer(Auth);
