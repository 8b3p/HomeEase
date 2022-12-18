import AuthForm from "@/components/auth/AuthForm";
import { observer } from "mobx-react-lite";
import { signIn } from "next-auth/react";
import React from "react";

const Auth = () => {
  async function submitHandler<
    T extends { username: string; password: String; email?: string }
  >(Args: T) {
    if (!Args.email) {
      //login
      console.log("Login");
      console.dir(Args);
      let res = await signIn("credentials", {
        redirect: false,
        username: Args.username,
        password: Args.password,
      });
      if (res?.error) console.log(res.error);
      console.dir(res);
    } else {
      console.log("Register");
      // const resJson = await fetch("api/auth/register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(Args),
      // });
      // const res = await resJson.json();
      // if (resJson.status !== 201) console.dir(res);
      // console.dir(res);
      // signIn("credentials", {
      //   redirect: false,
      //   username: Args.username,
      //   password: Args.password,
      // });
      signIn("email", {});
    }
  }

  return (
    <>
      <AuthForm submit={submitHandler} />
    </>
  );
};

export default observer(Auth);
