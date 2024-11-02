import { observer } from "mobx-react-lite";
import { Box, Divider, Grow, Stack, useMediaQuery } from "@mui/material";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import NoHouse from "@components/house/NoHouse";
import House from "@components/house/House";
import { getBaseUrl } from "@utils/apiService";
import UserSettings from "@components/profile/UserSettings";

interface props {
  session: Session;
  baseUrl: string;
}

const Profile = ({ session, baseUrl }: props) => {
  const isSmallScreen = useMediaQuery("(max-width: 800px)");

  return (
    <Grow in={true}>
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        width='100%'
        minHeight='100%'
        spacing={4}
        paddingBottom={2}
      >
        <Box width={isSmallScreen ? "100%" : "50%"}>
          <UserSettings session={session} />
        </Box>
        <Divider
          orientation={isSmallScreen ? "horizontal" : "vertical"}
          flexItem
        />
        <Box width={isSmallScreen ? "100%" : "50%"}>
          {session?.user.houseId ? (
            <House baseUrl={baseUrl} session={session} />
          ) : (
            <NoHouse />
          )}
        </Box>
      </Stack>
    </Grow>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      props: {},
      redirect: {
        destination: `/auth?redirectUrl=${encodeURIComponent(ctx.resolvedUrl)}`,
      },
    };
  }
  return {
    props: {
      session: session,
      baseUrl: getBaseUrl(ctx.req),
    },
  };
};

export default observer(Profile);
