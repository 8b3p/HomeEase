import { IconButton, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import { Status } from "@prisma/client";
import { Session } from "next-auth";
import { ArrowRight, ArrowLeft, Circle } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import styled from "@mui/styled-engine";
import { useState } from "react";

interface props {
  byDay: { [key: string]: { status: Status; userId: string }[] } | undefined;
  setSelected: (arg: Date) => void;
  selected: Date;
  session: Session;
  addButton?: JSX.Element;
}

const daysInterval = 5;

const Item = styled(Paper)(({ theme }: any) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  position: "relative",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: theme.shadows[0],
  textAlign: 'center',
  height: '100%',
}));

const DateOptions = ({ byDay, selected, setSelected, session, addButton }: props) => {
  const currentDate = selected
  const start = new Date(currentDate); // Create a new date object for the start date
  start.setDate(currentDate.getDate() - 1); // Set the start date to yesterday
  const [startDate, setStartDate] = useState<Date>(start)
  const isMobile = useMediaQuery('(max-width: 600px)')

  const handleDayJump = (day: number) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const date = new Date();
    date.setTime(startDate.getTime() + (day * msPerDay))
    setSelected(date)
    setStartDate(date)
  }
  return (
    <Stack
      justifyContent='start'
      alignItems='center'
      width='100%'
    >
      <Paper
        sx={(theme) => ({
          width: "100%",
          boxShadow: theme.shadows[5],
          padding: "0.5rem",
          borderRadius: theme.shape.borderRadius,
        })}
      >
        <Grid container columns={daysInterval} height="3rem" width="100%">
          <Grid xs={daysInterval - 1}>
            <Stack alignItems="center" height="100%" direction="row">
              <IconButton onClick={() => handleDayJump(-daysInterval)}><ArrowLeft /></IconButton>
              <IconButton onClick={() => handleDayJump(daysInterval)}><ArrowRight /></IconButton>
              <Stack justifyContent="center" alignItems="center">
                {selected.toLocaleString('default', { weekday: 'short' })}, {selected.toLocaleString('default', { month: 'long' })} {selected.getDate()}
              </Stack>
            </Stack>
          </Grid>
          <Grid xs={1} alignItems="center">
            <Stack justifyContent="center" alignItems="center" height="100%">
              {addButton}
            </Stack>
          </Grid>
        </Grid>
        <Grid container columns={daysInterval} height="3rem" width="100%">
          {new Array(daysInterval).fill(0).map((_, i) => {
            const date = new Date();
            const msPerDay = 1000 * 60 * 60 * 24;
            date.setTime(startDate.getTime() + (i * msPerDay))
            const dateString = date.toLocaleString(undefined, { day: "numeric", month: 'long', year: 'numeric' });
            const day = date.getDate();
            const dayOfWeek = date.toLocaleString('default', { weekday: 'short' });
            return (
              <Grid xs={1} key={i}>
                <Item onClick={() => { setSelected(date) }} sx={selected.getDate() === date.getDate() ? { color: 'primary.main', cursor: 'pointer' } : { cursor: "pointer" }}>
                  <Typography variant='h6' sx={{ cursor: "pointer" }}>{isMobile ? '' : dayOfWeek} {day}</Typography>
                  {byDay && byDay[dateString] && byDay[dateString].length > 0 ?
                    <Circle
                      sx={{
                        position: 'absolute',
                        fontSize: '6px',
                        top: '80%'
                      }}
                      color={byDay[dateString].filter(day => day.status === "Pending").find(day => day.userId === session.user?.id) ? "info" : "disabled"}
                    /> : ''}
                </Item>
              </Grid>
            )
          })}
        </Grid>
      </Paper>
    </Stack >
  )
}

export default DateOptions;
