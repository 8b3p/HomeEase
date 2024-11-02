import React from 'react';
import { Paper, Grid2, TextField, MenuItem, useMediaQuery, InputAdornment, useTheme, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Search } from '@mui/icons-material';
import { Status, User } from '@prisma/client';
import { capitalize } from '@mui/material/utils';

interface PaymentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: Status | 'All';
  setStatusFilter: (value: Status | 'All') => void;
  selectedUser: string | 'All';
  setSelectedUser: (value: string | 'All') => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  sortOption: string; // New prop for sorting
  setSortOption: (value: string) => void; // New setter prop
  addButton?: JSX.Element;
  users: User[]; // Pass users to populate the User filter
}

// Define sorting options
const SORT_OPTIONS = [
  { value: 'date-asc', label: 'Date (Oldest First)' },
  { value: 'date-desc', label: 'Date (Newest First)' },
  { value: 'amount-asc', label: 'Amount (Low to High)' },
  { value: 'amount-desc', label: 'Amount (High to Low)' },
];

const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  searchTerm, setSearchTerm, statusFilter, setStatusFilter, selectedUser, setSelectedUser,
  startDate, setStartDate, endDate, setEndDate, sortOption, setSortOption, addButton, users,
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const theme = useTheme();

  return (
    <>
      <Paper sx={{ padding: theme.spacing(3), borderRadius: theme.shape.borderRadius, width: '100%', boxShadow: theme.shadows[3] }}>
        <Grid2 container spacing={2} alignItems="center">
          {/* Search Field */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid2>

          {/* Status Filter */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label="Status"
              variant="outlined"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
              fullWidth
              slotProps={{
                input: {
                  // Additional props if needed
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              {Object.values(Status).map((status) => (
                <MenuItem key={status} value={status}>
                  {capitalize(status)}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>

          {/* User Filter */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label="User"
              variant="outlined"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value as string | 'All')}
              fullWidth
              slotProps={{
                input: {
                  // Additional props if needed
                },
              }}
            >
              <MenuItem value="All">All Users</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {capitalize(user.firstName)} {capitalize(user.lastName)}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>

          {/* Start Date Picker */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
          </Grid2>

          {/* End Date Picker */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </Grid2>

          {/* Sort Option */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label="Sort By"
              variant="outlined"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  // Additional props if needed
                },
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>

        </Grid2>
      </Paper>
      {addButton}
    </>
  );
};

export default PaymentFilters;

