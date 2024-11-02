// components/PaymentOptions.tsx

import React, { useState, useMemo } from 'react';
import { Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Payment, Status, User } from '@prisma/client';
import { Session } from 'next-auth';
import PaymentFilters from './payments/PaymentFilters';
import PaymentsList from './payments/paymentsList/PaymentsList';

interface PaymentOptionsProps {
  payments: Payment[];
  users: User[];
  session: Session;
  addButton?: JSX.Element;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ payments, users, session, addButton }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [selectedUser, setSelectedUser] = useState<string | 'All'>('All');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOption, setSortOption] = useState<string>('date-desc');

  // Filter payments based on search, status, user, and date range
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
      const matchesUser = selectedUser === 'All' ||
        (payment.payerId === selectedUser) ||
        (payment.recipientId === selectedUser);
      const matchesStartDate = startDate ? new Date(payment.createdAt) >= startDate : true;
      const matchesEndDate = endDate ? new Date(payment.createdAt) <= endDate : true;

      return matchesSearch && matchesStatus && matchesUser && matchesStartDate && matchesEndDate;
    });
  }, [payments, searchTerm, statusFilter, selectedUser, startDate, endDate]);

  // Sort the filtered payments based on sortOption
  const sortedPayments = useMemo(() => {
    const sorted = [...filteredPayments];
    switch (sortOption) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'amount-desc':
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        sorted.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredPayments, sortOption]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={4} width="100%" maxWidth="1200px" margin="auto" padding={2}>
        {/* Filters */}
        <PaymentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          sortOption={sortOption}
          setSortOption={setSortOption}
          addButton={addButton}
          users={users}
        />

        {/* Payments List */}
        <PaymentsList
          payments={sortedPayments}
          users={users}
          session={session}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default PaymentOptions;

