/**
 * @file MobX Store
 * @module store/authVM
 * @see https://mobx.js.org/README.html
 */

import { sendHttp } from "utils/sendHttp";
import { makeAutoObservable } from "mobx";

interface registerArgs {
  user: { name: string; email: string; password: string };
  email: string;
  password: string;
}

export class AuthVM {
  constructor() {
    makeAutoObservable(this);
  }

  public onRegister = async ({ user, email, password }: registerArgs) => {
    throw new Error("Not implemented");
  };

  public onLogin = async ({ email, password }: registerArgs) => {
    throw new Error("Not implemented");
  };
}
