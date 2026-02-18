import React, { createContext, useContext, useState, ReactNode } from 'react';

/* ================= TYPES ================= */

export type BillStatus =
  | 'pending'
  | 'pending_accounts'
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

export interface ApprovalStep {
  role: string;
  name: string;
  status: 'submitted' | 'approved' | 'rejected';
  timestamp?: string;
  comment?: string;
}

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

/* ================= MOCK DATA ================= */

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
    status: 'pending_accounts',
    riskScore: 25,
    riskLevel: 'low',
    fraudAlerts: [],
    approvalHistory: [
      {
        role: 'Employee',
        name: 'John Doe',
        status: 'submitted',
        timestamp: '2026-02-10 10:30',
      },
    ],
  },
];

const mockVendors: Vendor[] = [];
const mockNotifications: Notification[] = [];

/* ================= PROVIDER ================= */

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  /* ================= ADD BILL ================= */

  const addBill = (
    billData: Omit<Bill, 'id' | 'status' | 'approvalHistory'>
  ) => {
    const newBill: Bill = {
      ...billData,
      id: `BILL${String(bills.length + 1).padStart(3, '0')}`,
      status: 'pending_accounts', // Goes to Accounts first for approval
      approvalHistory: [
        {
          role: 'Employee',
          name: billData.employeeName,
          status: 'submitted',
          timestamp: new Date().toLocaleString(),
        },
      ],
    };

    setBills((prev) => [newBill, ...prev]);
  };

  /* ================= WORKFLOW ================= */

  const updateBillStatus = (
  billId: string,
  status: BillStatus,
  role: string,
  name: string,
  comment?: string
) => {
  // 🚨 BLOCK EMPLOYEE FROM APPROVING
  if (role === 'employee') {
    console.log('Employee cannot approve bills');
    return;
  }

  setBills((prevBills) =>
    prevBills.map((bill) => {
      if (bill.id !== billId) return bill;

      const newStep: ApprovalStep = {
        role,
        name,
        status: status === 'rejected' ? 'rejected' : 'approved',
        timestamp: new Date().toLocaleString(),
        comment,
      };

      const updatedHistory = [...bill.approvalHistory, newStep];

      /* ----- ACCOUNTS STEP ----- */
      if (role === 'accounts') {
        // Only process if bill is pending accounts
        if (bill.status !== 'pending_accounts') {
          return bill;
        }

        if (status === 'rejected') {
          return {
            ...bill,
            status: 'rejected',
            approvalHistory: updatedHistory,
          };
        }

        // Small amount (≤₹5000) → final approval
        if (bill.amount <= 5000) {
          return {
            ...bill,
            status: 'approved',
            approvalHistory: updatedHistory,
          };
        }

        // Large amount (>₹5000) → escalate to manager
        return {
          ...bill,
          status: 'pending_manager',
          approvalHistory: updatedHistory,
        };
      }

      /* ----- MANAGER STEP ----- */
      if (role === 'manager') {
        // Only process if bill is pending manager
        if (bill.status !== 'pending_manager') {
          return bill;
        }
        
        return {
          ...bill,
          status,
          approvalHistory: updatedHistory,
        };
      }

      return bill;
    })
  );


    /* ================= NOTIFICATIONS ================= */

    // Create notification based on the status and role
    let notificationTitle = '';
    let notificationMessage = '';
    let notificationType: 'info' | 'warning' | 'success' | 'error' = 'info';
    
    if (status === 'approved') {
      notificationTitle = 'Bill Approved';
      notificationType = 'success';
      // Check if it was approved by manager or accounts
      if (role === 'manager') {
        notificationMessage = `Your bill ${billId} has been approved by Manager ${name}`;
      } else {
        notificationMessage = `Your bill ${billId} has been approved by Accounts`;
      }
    } else if (status === 'rejected') {
      notificationTitle = 'Bill Rejected';
      notificationType = 'error';
      notificationMessage = `Your bill ${billId} has been rejected by ${role === 'manager' ? 'Manager' : 'Accounts'}`;
    } else if (status === 'pending_manager') {
      notificationTitle = 'Bill Escalated to Manager';
      notificationType = 'info';
      notificationMessage = `Your bill ${billId} has been forwarded to Manager for final approval`;
    } else {
      notificationTitle = 'Bill Updated';
      notificationMessage = `Bill ${billId} has been updated by ${name}`;
    }

    const newNotification: Notification = {
      id: `N${String(notifications.length + 1).padStart(3, '0')}`,
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
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