import { signIn } from "next-auth/react";
import { errorResponse } from "types/errorResponse";

interface registerArgs {
  password: string;
  email: string;
  username: { firstname: string; lastname: string };
}

interface loginArgs {
  password: string;
  email: string;
}

interface authResponse {
  ok: boolean;
  error?: {
    errorMessage: string;
    unverifiedEmail?: boolean;
  };
}

export async function onRegister({ username, email, password }: registerArgs): Promise<authResponse> {
  //*first: check if the user already exists
  const res2 = await isThereUser(email);
  if (res2.error) {
    return { ok: false, error: { errorMessage: "Something went wrong, please try again" } }
    // handle error
  } else if (!res2.userExists) {
    //*second: if not, send the register request
    const res1 = await sendRegisterRequest({ username, email, password });
    // handle error
    if (!res1.ok) {
      return { ok: false, error: { errorMessage: "Something went wrong, please try again" } }
    }
    //*third: if the register request is successful, send the email verification request
    const res = await signIn("email", {
      redirect: false,
      email: email,
      callbackUrl: "/",
    });
    // handle error
    if (res?.error) {
      return { ok: false, error: { errorMessage: res.error } }
    }
    //*fourth: if the email verification request is successful, show a success message
    return { ok: true }
  } else {
    //*if the user already exists, show an error message
    return { ok: false, error: { errorMessage: "User already exists" } }
  }
};

export async function onLogin({ email, password }: loginArgs): Promise<authResponse> {
  //*first: send the signin request with credentials
  try {
    let res = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    // handle error
    if (res?.error) {
      if (
        res.error === "Email not verified. click to send verification link"
      ) {
        return { ok: false, error: { errorMessage: res.error, unverifiedEmail: true } }
      }
      return { ok: false, error: { errorMessage: res.error } }
    }
    //*second: if the signin request is successful, show a success message
    return { ok: true }
  } catch (e) {
    return { ok: false, error: { errorMessage: "Something went wrong, please try again" } }
  }
};

export async function sendRegisterRequest(Args: {
  username?: { firstname: string, lastname: string };
  password: string;
  email: string;
}): Promise<{ ok: boolean; error?: errorResponse }> {
  const resJson = await fetch("api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Args),
  });
  if (!resJson.ok) {
    const res = (await resJson.json()) as errorResponse;
    res.status = resJson.status;
    return { ok: false, error: res };
  } else return { ok: true };
}

export async function isThereUser(
  email: string
): Promise<{ userExists?: boolean; error?: errorResponse }> {
  const resJson = await fetch("api/auth/checkIfUserExists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!resJson.ok) {
    const res = (await resJson.json()) as errorResponse;
    return { error: res };
  }
  const res = (await resJson.json()) as boolean;
  return { userExists: res };
}
