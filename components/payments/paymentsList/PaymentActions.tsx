import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Check, Close, Edit, MoreVert } from "@mui/icons-material";
import { Status } from "@prisma/client";

interface props { direction: "Outgoing" | "Incoming"; status: Status; onApprove: () => void; onCancel: () => void; onEdit: () => void; statusText: string; }

const PaymentActions = ({ direction, status, onApprove, onCancel, onEdit, statusText, }: props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:600px)");

  // State for mobile action menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
  const handleMenuClose = () => { setAnchorEl(null); };

  return (
    <>
      {!isMobile ? (
        // Desktop View: Show action buttons directly
        <Typography
          color={status === Status.Completed ? theme.palette.success.main : status === Status.Cancelled ? theme.palette.error.main : "inherit"}
          sx={{ textTransform: "capitalize" }}
        >
          {direction === "Outgoing" && status === Status.Pending && (
            <>
              <IconButton
                onClick={onApprove}
                aria-label="Approve Payment"
                size="small"
              >
                <Check color="success" />
              </IconButton>
              <IconButton
                onClick={onCancel}
                aria-label="Cancel Payment"
                size="small"
              >
                <Close color="error" />
              </IconButton>
            </>
          )}
          {status === Status.Pending ? (
            <IconButton onClick={onEdit} aria-label="Edit Payment" size="small" >
              <Edit color="info" />
            </IconButton>
          ) : (
            statusText
          )}
        </Typography>
      ) : (
        // Mobile View: Use a menu for actions
        <>
          {status === Status.Pending ? (
            <>
              <IconButton onClick={handleMenuOpen}
                aria-label="Payment Actions"
                aria-controls={menuOpen ? "payment-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
              >
                <MoreVert />
              </IconButton>
              <Menu
                id="payment-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right", }}
                transformOrigin={{ vertical: "top", horizontal: "right", }}
                keepMounted
              >
                {direction === "Outgoing" && status === Status.Pending && (
                  <div>
                    <MenuItem onClick={() => { onApprove(); handleMenuClose(); }} >
                      <Check color="success" fontSize="small" sx={{ marginRight: 1 }} />
                      Approve
                    </MenuItem>
                    <MenuItem onClick={() => { onCancel(); handleMenuClose(); }} >
                      <Close color="error" fontSize="small" sx={{ marginRight: 1 }} />
                      Cancel
                    </MenuItem>
                  </div>
                )}

                {status === Status.Pending && (
                  <MenuItem onClick={() => { onEdit(); handleMenuClose(); }} >
                    <Edit color="info" fontSize="small" sx={{ marginRight: 1 }} />
                    Edit
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            // Display status text for Completed or Cancelled
            <Typography
              color={status === Status.Completed ? theme.palette.success.main : theme.palette.error.main}
              sx={{ textTransform: "capitalize" }}
            >
              {statusText}
            </Typography>
          )}
        </>
      )}
    </>
  );
};

export default PaymentActions;
