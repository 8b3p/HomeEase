import GlobalAlert from "@/components/UI/GlobalAlert";
import { AlertProps } from "@mui/material";
import { House, User } from "@prisma/client";
import { makeAutoObservable } from "mobx";
import React from "react";
import ReactDOM from "react-dom/client";

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
  public house: Partial<House> | null = null;
  public user: Partial<User> | null = null;
  private alertTimer: NodeJS.Timeout | null = null;
  private alertRoot: ReactDOM.Root | null = null;

  public get fullName() {
    return `${this.user?.firstName} ${this.user?.lastName}`;
  }

  constructor(house?: House, user?: User) {
    if (house) this.house = house;
    if (user) this.user = user;
    makeAutoObservable(this);
  }

  public createHouse = async (name: string) => {
  }

  public showAlert = (message: string, type: AlertProps['severity']) => {
    if (this.alertTimer) { clearTimeout(this.alertTimer); this.alertRoot?.unmount() }
    const target = document.getElementById('alert-root');
    if (target) {
      const Alert = React.createElement(GlobalAlert, { message, severity: type });
      this.alertRoot = ReactDOM.createRoot(target);
      this.alertRoot.render(Alert);
      this.alertTimer = setTimeout(() => { this.alertRoot?.unmount() }, 7000);
    }
  }

  public hydrate = (data: HydrationData) => {
    if (!data || !data.user) {
      this.user = null;
      this.house = null;
      return;
    }
    const { house, ...user } = data.user
    this.user = user;
    this.house = house
  }
}



