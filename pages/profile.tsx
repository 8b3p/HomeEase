import { useAppVM } from "@/context/Contexts";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Box, Divider, Stack, useMediaQuery } from "@mui/material";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import NoHouse from "@/components/house/NoHouse";
import House from "@/components/house/House";
import { getBaseUrl } from "@/utils/apiService";
import UserSettings from "@/components/profile/UserSettings";

interface props {
  session: Session;
  baseUrl: string;
}

const Profile = ({ session, baseUrl }: props) => {
  const appVM = useAppVM();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width: 800px)");

  return (
    <Stack direction={isSmallScreen ? 'column' : 'row'} width="100%" height="100%" spacing={4} paddingBottom={2}>
      <Box width={isSmallScreen ? '100%' : '50%'}>
        <UserSettings />
      </Box>
      <Divider orientation={isSmallScreen ? 'horizontal' : 'vertical'} flexItem />
      <Box width={isSmallScreen ? '100%' : '50%'}>
        {
          session?.user.houseId ? (
            <House baseUrl={baseUrl} session={session} />
          ) : (
            <NoHouse />
          )
        }
      </Box>
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
