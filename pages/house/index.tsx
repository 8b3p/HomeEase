import { useAppVM } from "@/context/Contexts";
import { Add } from "@mui/icons-material";
import {
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";
import { Session } from "next-auth";
import { getBaseUrl } from "@/utils/apiService";

interface props {
  session: Session;
}

const House = ({ session }: props) => {
  const appVM = useAppVM();
  const router = useRouter();
  const [newName, setNewName] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appVM.house) {
      router.push(`/house/${appVM.house.id}`);
    }
    // const checkHouse = async () => {
    //   const res = await fetch(`/api/users/${session.user.id}/house`);
    //   const data = await res.json();
    //   console.log(data);
    //   if (!res.ok) {
    //     appVM.showAlert(data.message, "error");
    //     return;
    //   }
    //   if (data.user.House) {
    //     appVM.house = data.user.House;
    //     return router.push(`/house/${data.user.House.id}`);
    //   }
    //   setLoading(false);
    // };
    // checkHouse();
    setLoading(false)
  }, [appVM, router, session.user.id]);

  const createHouse = async () => {
    if (validateHouseName(newName)) {
      setCreating(true);
      try {
        const res = await fetch("/api/houses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ name: newName }),
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          appVM.showAlert(data.message, "error");
          setCreating(false);
          return;
        }
        appVM.house = data.house;
        router.push(`/house/${appVM.house?.id}`);
      } catch (e: any) {
        appVM.showAlert(e.message, "error");
      }
      setCreating(false);
    }
  };

  const validateHouseName = (name: string) => {
    if (name.length < 3) {
      setInputError("House name must be at least 3 characters long");
      return false;
    }
    if (name.length > 20) {
      setInputError("House name must be less than 20 characters long");
      return false;
    }
    if (name.match(/[!@#$%^&*]/)) {
      setInputError("House name cannot contain special characters");
      return false;
    }
    setInputError("");
    return true;
  };

  return (
    <Stack height='100%' alignItems='center' justifyContent='center' gap={3}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant={isSmallScreen ? "h5" : "h4"}>
            You are not part of a house
          </Typography>
          <Stack
            direction={"row"}
            width={"100%"}
            alignItems='center'
            justifyContent='center'
            gap={2}
          >
            <Divider
              sx={{ width: "100%", maxWidth: isSmallScreen ? "50px" : "100px" }}
              orientation='horizontal'
            />
            <Typography variant='h6'>Create a house</Typography>
            <Divider
              sx={{ width: "100%", maxWidth: isSmallScreen ? "50px" : "100px" }}
              orientation='horizontal'
            />
          </Stack>
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            gap={2}
            alignItems={isSmallScreen ? "stretch" : ""}
          >
            <TextField
              error={inputError ? true : false}
              helperText={inputError}
              label='House Name'
              type='text'
              id='houseName'
              onChange={e => {
                setNewName(e.target.value);
              }}
              onBlur={() => {
                if (inputError) validateHouseName(newName);
              }}
            />
            <LoadingButton
              loading={creating}
              variant='contained'
              onClick={() => {
                createHouse();
              }}
            >
              <Add />
            </LoadingButton>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      props: {},
      redirect: {
        destination: `/auth?redirectUrl=${encodeURIComponent(
          ctx.req.url || "/"
        )}`,
      },
    };
  }

  const res = await fetch(`${getBaseUrl(ctx.req)}/api/users/${session?.user.id}/house`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      cookie: ctx.req.headers.cookie || "",
    }
  });
  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    return {
      props: {
        session
      }
    };
  }
  if (data.user.House) {
    return {
      props: {},
      redirect: {
        destination: `/house/${data.user.House.id}`,
      }
    }
  }
  return {
    props: {
      session: session,
    },
  };
};

export default observer(House);
