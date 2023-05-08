import { House, User } from "@prisma/client";
import { makeAutoObservable } from "mobx";

export default class AppVM {
  public isServer = typeof window === "undefined";
  public house: House | null = null;
  public user: User | null = null;

  constructor(house?: House, user?: User) {
    if (house) this.house = house;
    if (user) this.user = user;
    makeAutoObservable(this);
  }

}
