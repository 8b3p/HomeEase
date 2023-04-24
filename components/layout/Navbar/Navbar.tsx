import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import NavbarMenu from "./NavbarMenu";

const Navbar = () => {
  const router = useRouter();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems='center' spacing={2} sx={{ minHeight: "4rem", paddingInline: "1rem" }}>
      <Stack direction="row" justifyContent="center" alignItems='center'>
        <Typography variant="h5" sx={{ marginRight: '1rem', color: "primary.main", cursor: 'pointer' }} onClick={() => router.push('/')}>
          Fluent UI
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ marginRight: '1rem' }} />
        <Button variant="text" onClick={() => router.push('/chores')} sx={{ textTransform: 'none' }}>Chores</Button>
        <Button variant="text" onClick={() => router.push('/payments')} sx={{ textTransform: 'none' }}>Payments</Button>
      </Stack>
      <Stack direction="row" justifyContent="center" alignItems='center' >
        <NavbarMenu />
      </Stack>
    </Stack>
  );
};

export default observer(Navbar);
