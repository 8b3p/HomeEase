import { House, User } from "@prisma/client";
import { makeAutoObservable } from "mobx";

export interface HydrationData {
  user: {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    house: House | null
  } | null
}

export default class AppVM {
  public isServer = typeof window === "undefined";
  public house: House | null = null;
  public user: Partial<User> | null = null;

  public get fullName() {
    return `${this.user?.firstName} ${this.user?.lastName}`;
  }

  constructor(house?: House, user?: User) {
    if (house) this.house = house;
    if (user) this.user = user;
    makeAutoObservable(this);
  }


  public hydrate = (data: HydrationData) => {
    if (!data || !data.user) return
    const { house, ...user } = data.user
    this.user = user;
    this.house = house
  }

}
