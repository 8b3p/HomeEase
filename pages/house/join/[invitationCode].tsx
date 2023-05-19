import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import prisma from "@/utils/PrismaClient";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useAppVM } from "@/context/Contexts";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";

interface props {
  house?: { id: string; name: string };
  isPartOfHouse?: boolean;
}

const InvitationPage = ({ house, isPartOfHouse }: props) => {
  const appVM = useAppVM();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const invitationCode = router.query.invitationCode as string;

  const joinHouse = async () => {
    // Call API route to join user to house using invitation code
    setLoading(true);
    const response = await fetch(`/api/houses/join/${invitationCode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      // Handle error
      appVM.showAlert(data.error, "error");
      router.push("/house");
      return;
    }
    // User successfully joined house
    const { users, ...house } = data.house;
    appVM.house = house;
    appVM.showAlert(`You have joined "${data.house.name}" house`, "success");
    router.push(`/house/${appVM.house?.id}`);
  };

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }
    if (!house) {
      appVM.showAlert("Invalid invitaion link", "error");
      router.push("/");
      return;
    }
    if (isPartOfHouse) {
      appVM.showAlert(`You are already part of "${house.name}" house`, "error");
      router.push(`/house/${house.id}`);
      return;
    }
    setLoading(false);
  }, [house, appVM, router, isPartOfHouse, hasMounted]);

  return (
    <Stack height='100%' alignItems='center' justifyContent='center'>
      {loading ? (
        <LinearProgress
          sx={{
            width: "60%",
            minWidth: "200px",
          }}
        />
      ) : (
        <Button
          variant='outlined'
          onClick={joinHouse}
          size='large'
          sx={{ fontSize: "1.5rem" }}
        >
          Join &quot;{house?.name}&quot; ?
        </Button>
      )}
    </Stack>
  );
};

export const getServerSideProps: GetServerSideProps<props> = async ctx => {
  const session = await getSession(ctx);
  const invitationCode = ctx.query.invitationCode as string;

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

  const house = await prisma.house.findUnique({
    where: {
      invitationCode,
    },
    select: {
      id: true,
      name: true,
      users: true,
    },
  });

  if (house) {
    const { users, ...safeHouse } = house;
    const isPartOfHouse = house?.users.some(
      user => user.id === session?.user?.id
    );
    return { props: { house: safeHouse, isPartOfHouse } };
  }

  return { props: {} };
};

export default observer(InvitationPage);
