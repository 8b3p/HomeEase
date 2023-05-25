// pages/index.tsx
import type { NextPage } from "next";
import { Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
// import { useThemeVM } from "@/context/Contexts";
// import { useEffect, useState } from "react";
// import { stopAnimation, startAnimation } from '@/styles/three'

const Home: NextPage = () => {
  // const themeVM = useThemeVM();
  // const [hasMounted, setHasMounted] = useState(false);
  //
  // useEffect(() => {
  //   if (hasMounted) {
  //     startAnimation(themeVM.themeType === "light" ? 0xffffff : 0x000000);
  //   }
  //   setHasMounted(true);
  // }, [hasMounted, themeVM.themeType]);

  return (
    <Typography variant="h1" textAlign="center">
      Welcome to HomeEase
    </Typography>
  );
};

export default observer(Home);

