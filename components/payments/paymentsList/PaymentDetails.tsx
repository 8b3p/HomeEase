import React from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText, Stack, Typography, useTheme } from "@mui/material";
import { User } from "@prisma/client";
import AppVM from "@context/appVM";

interface props {
  amount: number;
  description: string;
  user: Partial<User>;
  date: Date;
}

const PaymentDetails = ({ amount, description, user, date }: props) => {
  const theme = useTheme();

  // Function to format the date
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <ListItem alignItems="flex-start" disablePadding sx={{ flex: 1 }}>
      <ListItemAvatar>
        <Avatar alt={`${user.firstName} ${user.lastName}`} sx={{ bgcolor: theme.palette.primary.main }} >
          {`${user.firstName?.[0].toUpperCase()}${user.lastName?.[0].toUpperCase()}`}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{ marginLeft: 2 }}
        primary={
          <Typography variant="h6" color="text.primary">
            {`${AppVM.currency}${amount.toFixed(2)}`}
          </Typography>
        }
        secondary={
          <Stack spacing={0.5}>
            <Typography component="span" variant="body2" color="text.primary" sx={{ textTransform: "capitalize" }} >
              {`${user.firstName} ${user.lastName}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {formatDate(date)}
            </Typography>
          </Stack>
        }
      />
    </ListItem>
  );
};

export default PaymentDetails;

