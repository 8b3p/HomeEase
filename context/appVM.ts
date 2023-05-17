import GlobalAlert from "@/components/UI/GlobalAlert";
import { AlertProps } from "@mui/material";
import { House } from "@prisma/client";
import { makeAutoObservable } from "mobx";
import { Session } from "next-auth";
import React from "react";
import ReactDOM from "react-dom/client";

export interface HydrationData {
  user: Session['user'] | null
}

export default class AppVM {
  public isServer = typeof window === "undefined";
  public house: Partial<House> | null = null;
  public user: Session['user'] | null = null;
  private alertTimer: NodeJS.Timeout | null = null;
  private alertRoot: ReactDOM.Root | null = null;

  constructor(house?: House, user?: Session['user']) {
    if (house) this.house = house;
    if (user) this.user = user;
    makeAutoObservable(this);
  }

  public showAlert = (message: string, type: AlertProps['severity'], action?: {
    icon: JSX.Element,
    action: () => void
  }) => {
    if (this.alertTimer) { clearTimeout(this.alertTimer); this.alertRoot?.unmount() }
    const target = document.getElementById('alert-root');
    if (target) {
      const Alert = React.createElement(GlobalAlert, { message, severity: type, action });
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
    this.user = data.user;
  }
}



