import { useAppVM } from "@/context/Contexts";
import { Container, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";

const House = () => {
  const appVM = useAppVM();

  return (
    <Container>
      <Stack height='100%' alignItems='center'>
        {appVM.house ? (
          <></>
        ) : (
          <Typography variant="h1">House</Typography>
        )}
      </Stack>
    </Container>
  );
};

export default observer(House);

