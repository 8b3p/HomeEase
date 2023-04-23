// pages/index.tsx
import type { NextPage } from "next";

import { Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useThemeVM } from "@/context/Contexts";

const Home: NextPage = () => {
  const themeVM = useThemeVM();

  return (
    <div>
      <Typography variant="h2" textAlign="center">
        Current theme is {themeVM.themeType}
      </Typography>
    </div>
  );
};

export default observer(Home);

