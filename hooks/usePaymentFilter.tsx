import { useState, useEffect } from 'react';
import { Payment, Status } from '@prisma/client';

interface UsePaymentFilterProps {
  payments: Payment[];
}

interface UsePaymentFilterReturn {
  filteredPayments: Payment[];
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
}

const usePaymentFilter = ({ payments }: UsePaymentFilterProps): UsePaymentFilterReturn => {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(payments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [selectedUser, setSelectedUser] = useState<string | 'All'>('All');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    let tempPayments = [...payments];

    // Filter by search term
    if (searchTerm) {
      tempPayments = tempPayments.filter((payment) =>
        payment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      tempPayments = tempPayments.filter(
        (payment) => payment.status === statusFilter
      );
    }

    // Filter by user
    if (selectedUser !== 'All') {
      tempPayments = tempPayments.filter(
        (payment) =>
          payment.payerId === selectedUser || payment.recipientId === selectedUser
      );
    }

    // Filter by date range
    if (startDate) {
      tempPayments = tempPayments.filter(
        (payment) => new Date(payment.createdAt) >= startDate
      );
    }
    if (endDate) {
      tempPayments = tempPayments.filter(
        (payment) => new Date(payment.createdAt) <= endDate
      );
    }

    setFilteredPayments(tempPayments);
  }, [searchTerm, statusFilter, selectedUser, startDate, endDate, payments]);

  return {
    filteredPayments,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedUser,
    setSelectedUser,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
};

export default usePaymentFilter;

