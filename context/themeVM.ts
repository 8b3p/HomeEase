import { makeAutoObservable } from "mobx";

export type ThemeType = "light" | "dark";

export default class ThemeVM {
  static themeTokenName = "theme";
  public themeType: ThemeType = "light";
  public isServer = typeof window === "undefined";

  constructor() {
    makeAutoObservable(this);
  }

  // not working
  public hydrate = () => {
    if (this.isServer) return;
    this.themeType =
      (localStorage.getItem(ThemeVM.themeTokenName) as ThemeType) || null;

    if (!this.themeType) {
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      this.themeType = darkThemeMq.matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", this.themeType);
  }

  public toggleTheme = () => {
    this.themeType = this.themeType === "light" ? "dark" : "light";
    localStorage.setItem(ThemeVM.themeTokenName, this.themeType);
    document.documentElement.setAttribute("data-theme", this.themeType);
  };
}
