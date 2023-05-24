import { Divider, Stack, Typography, useMediaQuery } from "@mui/material"

interface props {
  title: string
  maxWidth?: number
  orientation?: "horizontal" | "vertical"
}

const DashText = ({ title, maxWidth, orientation }: props) => {
  const isMobile = useMediaQuery('(max-width: 600px)')

  return (
    <Stack
      direction={"row"}
      width={"100%"}
      alignItems='center'
      justifyContent='center'
      overflow="hidden"
      gap={2}
    >
      <Divider
        sx={{ width: "100%", maxWidth: isMobile ? (maxWidth ? maxWidth / 2 : "50px") : maxWidth ? maxWidth : "100px" }}
        orientation='horizontal'
      />
      <Typography noWrap overflow="unset" variant='h6'>{title}</Typography>
      <Divider
        sx={{ width: "100%", maxWidth: isMobile ? (maxWidth ? maxWidth / 2 : "50px") : maxWidth ? maxWidth : "100px" }}
        orientation='horizontal'
      />
    </Stack>

  )
}

export default DashText
