import React, { createContext, useContext, useState, ReactNode } from 'react';

export type BillStatus =
  | 'pending'
  | 'pending_manager'
  | 'approved'
  | 'rejected';

export type RiskLevel = 'low' | 'medium' | 'high';
export type BillCategory =
  | 'Travel'
  | 'Repair'
  | 'Fuel'
  | 'Courier'
  | 'Office Supplies'
  | 'Other';

export interface Bill {
  id: string;
  employeeName: string;
  vendorName: string;
  invoiceNumber: string;
  gstNumber: string;
  date: string;
  amount: number;
  category: BillCategory;
  description: string;
  status: BillStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  fraudAlerts: string[];
  approvalHistory: ApprovalStep[];
  fileUrl?: string;
}

export interface ApprovalStep {
  role: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  comment?: string;
}

export interface Vendor {
  id: string;
  name: string;
  gstNumber: string;
  totalBills: number;
  totalAmount: number;
  riskLevel: RiskLevel;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

interface DataContextType {
  bills: Bill[];
  vendors: Vendor[];
  notifications: Notification[];
  addBill: (bill: Omit<Bill, 'id' | 'status' | 'approvalHistory'>) => void;
  updateBillStatus: (
    billId: string,
    status: BillStatus,
    role: string,
    name: string,
    comment?: string
  ) => void;
  markNotificationAsRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

/* ---------------- MOCK DATA ---------------- */

const mockBills: Bill[] = [
  {
    id: 'BILL001',
    employeeName: 'John Doe',
    vendorName: 'City Travels',
    invoiceNumber: 'INV-001',
    gstNumber: '29ABCDE1234F1Z5',
    date: '2026-02-10',
    amount: 4500,
    category: 'Travel',
    description: 'Client meeting travel expense',
    status: 'pending',
    riskScore: 25,
    riskLevel: 'low',
    fraudAlerts: [],
    approvalHistory: [
      {
        role: 'Employee',
        name: 'John Doe',
        status: 'approved',
        timestamp: '2026-02-10 10:30',
      },
    ],
  },
];

const mockVendors: Vendor[] = [];
const mockNotifications: Notification[] = [];

/* ---------------- PROVIDER ---------------- */

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  /* ---------------- ADD BILL ---------------- */

  const addBill = (
    billData: Omit<Bill, 'id' | 'status' | 'approvalHistory'>
  ) => {
    const newBill: Bill = {
      ...billData,
      id: `BILL${String(bills.length + 1).padStart(3, '0')}`,
      status: 'pending',
      approvalHistory: [
        {
          role: 'Employee',
          name: billData.employeeName,
          status: 'approved',
          timestamp: new Date().toLocaleString(),
        },
      ],
    };

    setBills((prev) => [newBill, ...prev]);
  };

  /* ---------------- WORKFLOW LOGIC ---------------- */

  const updateBillStatus = (
    billId: string,
    status: BillStatus,
    role: string,
    name: string,
    comment?: string
  ) => {
    setBills((prevBills) =>
      prevBills.map((bill) => {
        if (bill.id !== billId) return bill;

        const newStep: ApprovalStep = {
          role,
          name,
          status,
          timestamp: new Date().toLocaleString(),
          comment,
        };

        const updatedHistory = [...bill.approvalHistory, newStep];

        /* ---- SMALL (≤ 5000) ---- */
        if (bill.amount <= 5000) {
          return {
            ...bill,
            status,
            approvalHistory: updatedHistory,
          };
        }

        /* ---- MEDIUM (5001–20000) ---- */
        if (bill.amount > 5000 && bill.amount <= 20000) {
          if (role === 'accounts' && status === 'approved') {
            return {
              ...bill,
              status: 'pending_manager',
              approvalHistory: updatedHistory,
            };
          }

          if (role === 'manager') {
            return {
              ...bill,
              status,
              approvalHistory: updatedHistory,
            };
          }
        }

        /* ---- LARGE (>20000) ---- */
        if (bill.amount > 20000) {
          if (role === 'accounts' && status === 'approved') {
            return {
              ...bill,
              status: 'pending_manager',
              approvalHistory: updatedHistory,
            };
          }

          if (role === 'manager') {
            return {
              ...bill,
              status,
              approvalHistory: updatedHistory,
            };
          }
        }

        return bill;
      })
    );

    /* ---- Notification ---- */

    const newNotification: Notification = {
      id: `N${String(notifications.length + 1).padStart(3, '0')}`,
      title:
        status === 'approved'
          ? 'Bill Approved'
          : status === 'rejected'
          ? 'Bill Rejected'
          : 'Bill Updated',
      message: `Bill ${billId} has been ${status} by ${name}`,
      type:
        status === 'approved'
          ? 'success'
          : status === 'rejected'
          ? 'error'
          : 'info',
      timestamp: new Date().toLocaleString(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <DataContext.Provider
      value={{
        bills,
        vendors,
        notifications,
        addBill,
        updateBillStatus,
        markNotificationAsRead,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};