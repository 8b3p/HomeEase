import { makeAutoObservable } from "mobx";

export type ThemeType = "light" | "dark";

export enum Color {
  VIOLET = "#7C3AED",
  LIGHT_VIOLET = "#A479F3",
  DARK_VIOLET = "#5A1E9D",
  BLUE = "#3B82F6",
  LIGHT_BLUE = "#60A5FA",
  DARK_BLUE = "#2563EB",
  GREEN = "#10B981",
  LIGHT_GREEN = "#34D399",
  DARK_GREEN = "#059669",
  YELLOW = "#FBBF24",
  LIGHT_YELLOW = "#FCD34D",
  DARK_YELLOW = "#D69E2E",
  RED = "#EF4444",
  LIGHT_RED = "#F87171",
  DARK_RED = "#DC2626",
  GRAY = "#6B7280",
  LIGHT_GRAY = "#9CA3AF",
  DARK_GRAY = "#4B5563",

  //background colors
  BACKGROUND = "#F9EAFB",
  BACKGROUND_DARK = "#1F0637",
  BACKGROUND_DARKER = "#110827",
  BACKGROUND_DARKEST = "#100B1B",
  BACKGROUND_LIGHT = "#D2C7DF",
  BACKGROUND_LIGHTER = "#E5D7EB",
  BACKGROUND_LIGHTEST = "#F9DAFB",

  //text colors
  TEXT = "#F9EAFB",
  TEXT_DARK = "#5B4563",
  TEXT_DARKER = "#7B6280",
  TEXT_DARKEST = "#9CA3AF",
  TEXT_LIGHT = "#D2C7DF",
  TEXT_LIGHTER = "#E5D7EB",
  TEXT_LIGHTEST = "#F9DAFB",

  //border colors
  BORDER = "#E5E7EB",
  BORDER_DARK = "#9CA3AF",
  BORDER_DARKER = "#6B7280",
  BORDER_DARKEST = "#4B5563",
  BORDER_LIGHT = "#F3F4F6",
  BORDER_LIGHTER = "#F9FAFB",
  BORDER_LIGHTEST = "#FFFFFF",

  //other colors
  WHITE = "#FFFFFF",
  BLACK = "#000000",
  TRANSPARENT = "transparent",
  SUCCESS = "#10B981",
  WARNING = "#FBBF24",
  ERROR = "#EF4444",
  INFO = "#3B82F6",

  //social colors
  FACEBOOK = "#4267B2",
  TWITTER = "#1DA1F2",
  INSTAGRAM = "#E1306C",
  LINKEDIN = "#0A66C2",
  PINTEREST = "#E60023",
  YOUTUBE = "#FF0000",
  REDDIT = "#FF4500",
  WHATSAPP = "#25D366",
  TELEGRAM = "#0088CC",
  TUMBLR = "#35465C",
  SNAPCHAT = "#FFFC00",
}

export interface Theme {
  "--primary-color": Color;
  "--secondary-color": Color;
  "--border-color": Color;
  "--success-color": Color;
  "--warning-color": Color;
  "--error-color": Color;
  "--info-color": Color;
  "--text-color": Color;
  "--text-color-light": Color;
  "--text-color-lighter": Color;
  "--text-color-lightest": Color;
  "--text-color-dark": Color;
  "--text-color-darker": Color;
  "--text-color-darkest": Color;
  "--background-color": Color;
  "--background-color-dark": Color;
  "--background-color-darker": Color;
  "--background-color-darkest": Color;
  "--background-color-light": Color;
  "--background-color-lighter": Color;
  "--background-color-lightest": Color;

  "--primary-color-hover": Color;
  "--secondary-color-hover": Color;
  "--background-color-hover": Color;
  "--text-color-hover": Color;
  "--border-color-hover": Color;

  "--primary-color-active": Color;
  "--secondary-color-active": Color;
  "--background-color-active": Color;
  "--text-color-active": Color;
  "--border-color-active": Color;

  "--primary-color-focus": Color;
  "--secondary-color-focus": Color;
  "--background-color-focus": Color;
  "--text-color-focus": Color;
  "--border-color-focus": Color;

  "--primary-color-disabled": Color;
  "--secondary-color-disabled": Color;
  "--background-color-disabled": Color;
  "--text-color-disabled": Color;
  "--border-color-disabled": Color;

  "--primary-color-disabled-hover": Color;
  "--secondary-color-disabled-hover": Color;
  "--background-color-disabled-hover": Color;
  "--text-color-disabled-hover": Color;
  "--border-color-disabled-hover": Color;

  "--primary-color-disabled-active": Color;
  "--secondary-color-disabled-active": Color;
  "--background-color-disabled-active": Color;
  "--text-color-disabled-active": Color;
  "--border-color-disabled-active": Color;

  "--primary-color-disabled-focus": Color;
  "--secondary-color-disabled-focus": Color;
  "--background-color-disabled-focus": Color;
  "--text-color-disabled-focus": Color;
  "--border-color-disabled-focus": Color;
}

export class ThemeVM {
  static themeTokenName = "theme";
  theme: ThemeType | null = null;
  themeColors: Record<ThemeType, Theme> = {
    light: {
      "--text-color-light": Color.TEXT_LIGHT,
      "--text-color-lighter": Color.TEXT_LIGHTER,
      "--text-color-lightest": Color.TEXT_LIGHTEST,
      "--text-color-dark": Color.TEXT_DARK,
      "--text-color-darker": Color.TEXT_DARKER,
      "--text-color-darkest": Color.TEXT_DARKEST,
      "--background-color-light": Color.BACKGROUND_LIGHT,
      "--background-color-lighter": Color.BACKGROUND_LIGHTER,
      "--background-color-lightest": Color.BACKGROUND_LIGHTEST,
      "--background-color-darkest": Color.BACKGROUND_LIGHT,
      "--success-color": Color.SUCCESS,
      "--warning-color": Color.WARNING,
      "--error-color": Color.ERROR,
      "--info-color": Color.INFO,

      "--primary-color": Color.VIOLET,
      "--secondary-color": Color.GRAY,
      "--border-color": Color.BORDER_LIGHT,
      "--text-color": Color.TEXT_DARK,
      "--background-color": Color.BACKGROUND,
      "--background-color-dark": Color.BACKGROUND_LIGHTER,
      "--background-color-darker": Color.BACKGROUND_LIGHT,

      "--primary-color-hover": Color.LIGHT_VIOLET,
      "--secondary-color-hover": Color.LIGHT_GRAY,
      "--background-color-hover": Color.BACKGROUND_LIGHT,
      "--text-color-hover": Color.TEXT_DARKER,
      "--border-color-hover": Color.BORDER_LIGHT,

      "--primary-color-active": Color.DARK_VIOLET,
      "--secondary-color-active": Color.DARK_GRAY,
      "--background-color-active": Color.BACKGROUND_DARK,
      "--text-color-active": Color.TEXT_DARKEST,
      "--border-color-active": Color.BORDER_DARK,

      "--primary-color-focus": Color.LIGHT_VIOLET,
      "--secondary-color-focus": Color.LIGHT_GRAY,
      "--background-color-focus": Color.BACKGROUND_LIGHT,
      "--text-color-focus": Color.TEXT_DARKER,
      "--border-color-focus": Color.BORDER_LIGHT,

      "--primary-color-disabled": Color.LIGHT_VIOLET,
      "--secondary-color-disabled": Color.LIGHT_GRAY,
      "--background-color-disabled": Color.BACKGROUND_LIGHT,
      "--text-color-disabled": Color.TEXT_LIGHTER,
      "--border-color-disabled": Color.BORDER_LIGHT,

      "--primary-color-disabled-hover": Color.LIGHT_VIOLET,
      "--secondary-color-disabled-hover": Color.LIGHT_GRAY,
      "--background-color-disabled-hover": Color.BACKGROUND_LIGHT,
      "--text-color-disabled-hover": Color.TEXT_DARKER,
      "--border-color-disabled-hover": Color.BORDER_LIGHT,

      "--primary-color-disabled-active": Color.DARK_VIOLET,
      "--secondary-color-disabled-active": Color.DARK_GRAY,
      "--background-color-disabled-active": Color.BACKGROUND_DARK,
      "--text-color-disabled-active": Color.TEXT_DARKEST,
      "--border-color-disabled-active": Color.BORDER_DARK,

      "--primary-color-disabled-focus": Color.LIGHT_VIOLET,
      "--secondary-color-disabled-focus": Color.LIGHT_GRAY,
      "--background-color-disabled-focus": Color.BACKGROUND_LIGHT,
      "--text-color-disabled-focus": Color.TEXT_DARKER,
      "--border-color-disabled-focus": Color.BORDER_LIGHT,
    },
    dark: {
      "--background-color-darkest": Color.BACKGROUND_DARKEST,
      "--background-color-light": Color.BACKGROUND_LIGHT,
      "--background-color-lighter": Color.BACKGROUND_LIGHTER,
      "--background-color-lightest": Color.BACKGROUND_LIGHTEST,
      "--text-color-light": Color.TEXT_LIGHT,
      "--text-color-lighter": Color.TEXT_LIGHTER,
      "--text-color-lightest": Color.TEXT_LIGHTEST,
      "--text-color-dark": Color.TEXT_DARK,
      "--text-color-darker": Color.TEXT_DARKER,
      "--text-color-darkest": Color.TEXT_DARKEST,
      "--success-color": Color.SUCCESS,
      "--warning-color": Color.WARNING,
      "--error-color": Color.ERROR,
      "--info-color": Color.INFO,

      "--primary-color": Color.VIOLET,
      "--secondary-color": Color.GRAY,
      "--border-color": Color.BORDER_DARK,
      "--text-color": Color.TEXT_LIGHT,
      "--background-color": Color.BACKGROUND_DARK,
      "--background-color-dark": Color.BACKGROUND_DARKER,
      "--background-color-darker": Color.BACKGROUND_DARKEST,

      "--primary-color-hover": Color.LIGHT_VIOLET,
      "--secondary-color-hover": Color.LIGHT_GRAY,
      "--background-color-hover": Color.BACKGROUND_DARKER,
      "--text-color-hover": Color.TEXT_LIGHTER,
      "--border-color-hover": Color.BORDER_DARK,

      "--primary-color-active": Color.DARK_VIOLET,
      "--secondary-color-active": Color.DARK_GRAY,
      "--background-color-active": Color.BACKGROUND,
      "--text-color-active": Color.TEXT_LIGHTEST,
      "--border-color-active": Color.BORDER_LIGHT,

      "--primary-color-focus": Color.LIGHT_VIOLET,
      "--secondary-color-focus": Color.LIGHT_GRAY,
      "--background-color-focus": Color.BACKGROUND_DARKER,
      "--text-color-focus": Color.TEXT_LIGHTER,
      "--border-color-focus": Color.BORDER_DARK,

      "--primary-color-disabled": Color.VIOLET,
      "--secondary-color-disabled": Color.GRAY,
      "--background-color-disabled": Color.BACKGROUND_DARK,
      "--text-color-disabled": Color.TEXT_LIGHT,
      "--border-color-disabled": Color.BORDER_DARK,

      "--primary-color-disabled-hover": Color.LIGHT_VIOLET,
      "--secondary-color-disabled-hover": Color.LIGHT_GRAY,
      "--background-color-disabled-hover": Color.BACKGROUND_DARKER,
      "--text-color-disabled-hover": Color.TEXT_LIGHTER,
      "--border-color-disabled-hover": Color.BORDER_DARK,

      "--primary-color-disabled-active": Color.DARK_VIOLET,
      "--secondary-color-disabled-active": Color.DARK_GRAY,
      "--background-color-disabled-active": Color.BACKGROUND,
      "--text-color-disabled-active": Color.TEXT_LIGHTEST,
      "--border-color-disabled-active": Color.BORDER_LIGHT,

      "--primary-color-disabled-focus": Color.LIGHT_VIOLET,
      "--secondary-color-disabled-focus": Color.LIGHT_GRAY,
      "--background-color-disabled-focus": Color.BACKGROUND_DARKER,
      "--text-color-disabled-focus": Color.TEXT_LIGHTER,
      "--border-color-disabled-focus": Color.BORDER_DARK,
    },
  };

  constructor() {
    this.theme =
      (localStorage.getItem(ThemeVM.themeTokenName) as ThemeType) || null;

    if (!this.theme) {
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      console.dir(darkThemeMq);
      this.theme = darkThemeMq.matches ? "dark" : "light";
    }
    makeAutoObservable(this);
  }

  toggleTheme = () => {
    this.theme = this.theme === "light" ? "dark" : "light";
    localStorage.setItem(ThemeVM.themeTokenName, this.theme);
  };
}
