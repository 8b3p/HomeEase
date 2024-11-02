import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import NavbarMenu from "./NavbarMenu";
import { Skeleton, useMediaQuery, Grid } from "@mui/material";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const session = useSession();

  if (isMobile) {
    return (
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        spacing={2}
        sx={{ minHeight: "4rem", paddingInline: "1rem" }}
      >
        <Typography
          variant='h4'
          fontFamily='Pacifico'
          sx={{ color: "primary.main", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          HomeEase
        </Typography>
        <Stack direction='row'>
          <NavbarMenu />
        </Stack>
      </Stack>
    );
  }

  return (
    <Grid container spacing={2} sx={{ paddingInline: '1rem' }} >
      <Grid item xs={4} minHeight="4rem">
        <Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={2} minHeight="4rem">
          <Typography
            variant='h4'
            fontFamily='Pacifico'
            sx={{ color: "primary.main", cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            HomeEase
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={4} minHeight="4rem">
        <Stack direction='row' justifyContent='center' alignItems='center' spacing={2} minHeight="4rem">
          {session.status === "authenticated" ? (
            <div>
              <Button
                variant='text'
                onClick={() => router.push("/chores")}
                sx={{ textTransform: "none" }}
              >Chores</Button>
              <Button
                variant='text'
                onClick={() => router.push("/payments")}
                sx={{ textTransform: "none" }}
              >Payments</Button>
            </div>
          ) : (
            session.status === "loading" && (
              <>
                <Skeleton variant='rounded' width={60} height={30} />
                <Skeleton variant='rounded' width={60} height={30} />
              </>
            )
          )}
        </Stack>
      </Grid>
      <Grid item xs={4} minHeight="4rem">
        <Stack justifyContent='center' alignItems='end' spacing={2} minHeight="4rem">
          <NavbarMenu />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default observer(Navbar);
