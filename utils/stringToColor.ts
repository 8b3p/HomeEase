import { ThemeType } from "@context/themeVM";

export function stringToColor(string: string, theme: ThemeType) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (i = 0; i < 3; i += 1) {
    /* eslint-disable no-bitwise */
    const value = (hash >> (i * 8)) & 0xff;
    color += `55${value.toString(16)}`.slice(-2);
  }

  if (theme === "dark") {
    //make the color lighter
    color = color.replace(/[1,2,3,4]/g, "a");
  } else if (theme === "light") {
    //make the color darker
    color = color.replace(/[c,d,e,f]/g, "6");
  } else {
  }

  return color;
}
