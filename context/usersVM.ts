import { sendHttp } from "utils/sendHttp";
import { makeAutoObservable } from "mobx";
import { AuthVM } from "./authVM";

export const enum Role {
  Admin = "Admin",
  Standard = "Standard",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export class UsersVM {
  users: IUser[] | Error = [];
  currentUser: IUser | undefined = {} as IUser;
  constructor() {
    makeAutoObservable(this);
  }

  async getUsers(id?: string) {
    let bearerToken = localStorage.getItem(AuthVM.authTokenName);
    if (bearerToken) {
      try {
        const response = await sendHttp<{ users: IUser[] }>({
          url: "users/all",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        });
        if (response.error) {
          this.users = new Error(response.error.message);
        }
        if (response.res) {
          this.users = response.res.users;
          if (id) {
            this.onClick(id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      this.users = new Error("You Are Not Logged In");
    }
  }

  onClick(id: string) {
    if (Array.isArray(this.users)) {
      this.currentUser = this.users.find((user: IUser) => user.id === id);
    }
  }
}
