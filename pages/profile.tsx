import { useAppVM } from "@/context/Contexts";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Stack, useMediaQuery } from "@mui/material";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import NoHouse from "@/components/house/NoHouse";
import House from "@/components/house/House";
import { getBaseUrl } from "@/utils/apiService";

interface props {
  session: Session;
  baseUrl: string;
}

const Profile = ({ session, baseUrl }: props) => {
  const appVM = useAppVM();
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [loading, setLoading] = useState(true);

  return (
    <Stack>
      {
        session?.user.houseId ? (
          <House baseUrl={baseUrl} session={session} />
        ) : (
          <NoHouse />
        )
      }
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
  return {
    props: {
      session: session,
      baseUrl: getBaseUrl(ctx.req)
    }
  };
};

export default observer(Profile);
