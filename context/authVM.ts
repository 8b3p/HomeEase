/**
 * @file MobX Store
 * @module store/authVM
 * @see https://mobx.js.org/README.html
 */

import { sendHttp } from "../utils/sendHttp";
import { makeAutoObservable } from "mobx";
import { IUser } from "./usersVM";

interface registerArgs {
  user: { name: string; email: string; password: string };
  email: string;
  password: string;
}

export class AuthVM {
  static authTokenName = "authToken";
  isLoggedIn = false;
  bearerToken: string = "";
  loggedInUser: IUser | null = null;
  constructor() {
    makeAutoObservable(this);

    this.bearerToken = localStorage.getItem(AuthVM.authTokenName) || "";
    if (this.bearerToken) {
      this.getLoggedInUser();
      this.isLoggedIn = true;
    }
  }
  getLoggedInUser = () => {
    sendHttp<IUser>({
      url: "users/me",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.bearerToken}`,
      },
    })
      .then(({ res, error }) => {
        if (error) {
          this.loggedInUser = {} as IUser;
        }
        this.loggedInUser = res;
      })
      .catch(err => {
        console.error(err);
      });
  };

  onLogout = () => {
    this.isLoggedIn = false;
    this.loggedInUser = {} as IUser;
    localStorage.removeItem(AuthVM.authTokenName);
    window.location.reload();
  };

  onLogin = async (
    email: string,
    password: string
  ): Promise<{ error?: string; ok: boolean }> => {
    try {
      const { res, error } = await sendHttp<{
        token: string;
        user: IUser;
      }>({
        url: "auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email,
          password,
        },
      });
      if (error) {
        if (error.status === 401) {
          return { error: "Wrong Password", ok: false };
        } else if (error.status === 404) {
          return { error: "User Not Found", ok: false };
        }
        return { error: "Something Went Wrong", ok: false };
      }
      this.bearerToken = res.token;
      localStorage.setItem(AuthVM.authTokenName, this.bearerToken);
      this.isLoggedIn = true;
      this.loggedInUser = res.user;
      return { ok: true };
    } catch (error: any) {
      return { error: error.messsage, ok: false };
    }
  };

  onRegister = async (
    data: registerArgs
  ): Promise<{ error?: string; ok: boolean }> => {
    try {
      const { res, error } = await sendHttp<{
        token: string;
        user: IUser;
      }>({
        url: "auth/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      if (error) {
        return { error: error.message, ok: false };
      }
      this.bearerToken = res.token;
      localStorage.setItem(AuthVM.authTokenName, this.bearerToken);
      this.isLoggedIn = true;
      this.loggedInUser = res.user;
      return { ok: true };
    } catch (error: any) {
      return { error: error.messsage, ok: false };
    }
  };
}
