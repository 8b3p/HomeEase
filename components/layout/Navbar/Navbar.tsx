import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useThemeVM } from "context/Contexts";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";

const Navbar = () => {
  const themeVM = useThemeVM();
  const router = useRouter();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems='center' spacing={2} sx={{ minHeight: "4rem", paddingInline: "1rem" }}>
      <Stack direction="row" justifyContent="center" alignItems='center' >
        <Typography variant="h5" sx={{ marginRight: '1rem' }}>
          Fluent UI
        </Typography>
        <Tabs value={router.pathname} onChange={(_, value: string) => {
          router.push(value);
        }}
        >
          <Tab value="/chores" label="Chores" sx={{ textTransform: 'none' }} disableRipple />
          <Tab value="/payments" label="Payments" sx={{ textTransform: 'none' }} disableRipple />
        </Tabs>
      </Stack>
      <Stack direction="row" justifyContent="center" alignItems='center' >
        <Tabs value={router.pathname} aria-label="disabled tabs example" onChange={(_, value: string) => {
          router.push(value);
        }}
        >
          <Tab value="/auth" label="Login" sx={{ textTransform: 'none' }} />
        </Tabs>
        {/*<TabList
          className={classes.tabList}
          selectedValue={router.pathname}
          size='small'
          onTabSelect={(e, data: SelectTabData) => {
            router.push(data.value as any as string);
          }}
        >
          <Tab value='/auth' key='auth' aria-label='auth'>
            Login
          </Tab>
        </TabList>*/}

        <IconButton onClick={() => { themeVM.toggleTheme(); }}>
          {themeVM.themeType === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default observer(Navbar);
