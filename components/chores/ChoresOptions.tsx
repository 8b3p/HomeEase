import { IconButton, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import { Chore, ChoreAssignment, User } from "@prisma/client";
import AssignChoreForm from "@/components/chores/AssignChoreForm";
import { Session } from "next-auth";
import { ArrowRight, ArrowLeft, Circle } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import styled from "@mui/styled-engine";
import { useState } from "react";

interface props {
  assignmentsByDay: { [key: string]: ChoreAssignment[] } | undefined;
  setSelected: (arg: Date) => void;
  selected: Date;
  chores: Chore[];
  users: Partial<User>[];
  session: Session;
}

const daysInterval = 5;

const Item = styled(Paper)(({ theme }: any) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  position: "relative",
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '100%',
}));

const ChoreOptions = ({ assignmentsByDay, selected, setSelected, session, users, chores }: props) => {
  const currentDate = new Date(); // Get the current date
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
    <>
      <Stack direction="row" width="100%" padding="0.5rem 0" justifyContent="space-between">
        <Stack direction="row">
          <IconButton onClick={() => handleDayJump(-daysInterval)}><ArrowLeft /></IconButton>
          <IconButton onClick={() => handleDayJump(daysInterval)}><ArrowRight /></IconButton>
          <Stack justifyContent="center" alignItems="center">
            {selected.toLocaleString('default', { weekday: 'short' })}, {selected.toLocaleString('default', { month: 'long' })} {selected.getDate()}
          </Stack>
        </Stack>
        <AssignChoreForm
          houseId={session.user.houseId || ""}
          defaultDate={selected}
          chores={chores}
          users={users}
        />
      </Stack>
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
                {assignmentsByDay && assignmentsByDay[dateString] && assignmentsByDay[dateString].length > 0 ?
                  <Circle
                    sx={{
                      position: 'absolute',
                      fontSize: '6px',
                      top: '80%'
                    }}
                    color={assignmentsByDay[dateString].filter(chore => chore.status === "Pending").find(chore => chore.userId === session.user?.id) ? "info" : "disabled"}
                  /> : ''}
              </Item>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

export default ChoreOptions;
