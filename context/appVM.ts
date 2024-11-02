import GlobalAlert from "@components/UI/GlobalAlert";
import { AlertProps } from "@mui/material";
import { House, User } from "@prisma/client";
import { User as NextAuthUser } from "next-auth";
import { makeAutoObservable } from "mobx";
import { Session } from "next-auth";
import React from "react";
import ReactDOM from "react-dom/client";
import PaymentFormVM from "./PaymentFormVM";

export interface HydrationData {
  user: Session["user"] | null;
}

export default class AppVM {
  public static currency = "₺";
  public isServer = typeof window === "undefined";
  public house: Partial<House & { users: User[] }> | null = null;
  public user: Session["user"] | null = null;
  private static alertTimer: NodeJS.Timeout | null = null;
  private static alertRoot: ReactDOM.Root | null = null;

  constructor(house?: House, user?: Session["user"]) {
    if (house) this.house = house;
    if (user) this.user = user;
    makeAutoObservable(this);
  }

  public static showAlert = (
    message: string,
    type: AlertProps["severity"],
    action?: {
      icon: JSX.Element;
      action: () => void;
    }
  ) => {
    if (this.alertTimer) {
      clearTimeout(this.alertTimer);
      this.alertRoot?.unmount();
    }
    const target = document.getElementById("alert-root");
    if (target) {
      const Alert = React.createElement(GlobalAlert, {
        message,
        severity: type,
        action,
      });
      this.alertRoot = ReactDOM.createRoot(target);
      this.alertRoot.render(Alert);
      this.alertTimer = setTimeout(() => {
        this.alertRoot?.unmount();
      }, 7000);
    }
  };

  public newPaymentForm = (
    users: Partial<User>[],
    houseId: string,
    defaultDate: Date,
    currentUser: NextAuthUser
  ): PaymentFormVM => {
    return new PaymentFormVM(users, houseId, defaultDate, currentUser);
  };

  public hydrate = (data: HydrationData) => {
    if (!data || !data.user) {
      this.user = null;
      this.house = null;
      return;
    }
    this.user = data.user;
  };
}
