import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import NavbarMenu from "./NavbarMenu";
import { Skeleton, useMediaQuery } from "@mui/material";
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
          variant='h5'
          sx={{ color: "primary.main", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          HomeEase
        </Typography>
        <Stack direction='row'>
          <NavbarMenu isMobile={true} />
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      spacing={2}
      sx={{ minHeight: "4rem", paddingInline: "1rem" }}
    >
      <Stack
        direction='row'
        justifyContent='center'
        alignItems='center'
        spacing={2}
      >
        <Typography
          variant='h5'
          sx={{ color: "primary.main", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          HomeEase
        </Typography>
        <Divider orientation='vertical' flexItem />
        {session.status === "authenticated" ? (
          <div>
            <Button
              variant='text'
              onClick={() => router.push("/chores")}
              sx={{ textTransform: "none" }}
            >
              {" "}
              Chores{" "}
            </Button>
            <Button
              variant='text'
              onClick={() => router.push("/payments")}
              sx={{ textTransform: "none" }}
            >
              {" "}
              Payments{" "}
            </Button>
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
      <Stack direction='row' justifyContent='center' alignItems='center'>
        <NavbarMenu isMobile={false} />
      </Stack>
    </Stack>
  );
};

export default observer(Navbar);
