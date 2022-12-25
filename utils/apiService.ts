import { safeUser } from "utils/safeUser";
import { errorResponse } from "types/errorResponse";

export async function sendRegisterRequest(Args: {
  username?: {firstname: string, lastname: string};
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
  console.dir(res);
  return { userExists: res };
}
