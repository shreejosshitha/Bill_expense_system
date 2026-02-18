import React, { createContext, useContext, useState, ReactNode } from 'react';

export type BillStatus = 'pending' | 'approved' | 'rejected';
export type RiskLevel = 'low' | 'medium' | 'high';
export type BillCategory = 'Travel' | 'Repair' | 'Fuel' | 'Courier' | 'Office Supplies' | 'Other';

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
  updateBillStatus: (billId: string, status: BillStatus, role: string, name: string, comment?: string) => void;
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

// Mock data
const mockBills: Bill[] = [
  {
    id: 'BILL001',
    employeeName: 'John Doe',
    vendorName: 'City Travels',
    invoiceNumber: 'INV-2024-001',
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
      { role: 'Employee', name: 'John Doe', status: 'approved', timestamp: '2026-02-10 10:30' }
    ],
  },
  {
    id: 'BILL002',
    employeeName: 'Jane Smith',
    vendorName: 'Tech Repairs Co',
    invoiceNumber: 'INV-2024-002',
    gstNumber: '29ABCDE1234F1Z6',
    date: '2026-02-12',
    amount: 38000,
    category: 'Repair',
    description: 'Laptop repair and upgrade',
    status: 'pending',
    riskScore: 75,
    riskLevel: 'high',
    fraudAlerts: ['Amount just below approval limit', 'High frequency vendor this month'],
    approvalHistory: [
      { role: 'Employee', name: 'Jane Smith', status: 'approved', timestamp: '2026-02-12 14:20' }
    ],
  },
  {
    id: 'BILL003',
    employeeName: 'Mike Wilson',
    vendorName: 'Fast Fuel Station',
    invoiceNumber: 'INV-2024-003',
    gstNumber: '29ABCDE1234F1Z7',
    date: '2026-02-15',
    amount: 2500,
    category: 'Fuel',
    description: 'Monthly fuel expense',
    status: 'approved',
    riskScore: 15,
    riskLevel: 'low',
    fraudAlerts: [],
    approvalHistory: [
      { role: 'Employee', name: 'Mike Wilson', status: 'approved', timestamp: '2026-02-15 09:10' },
      { role: 'Accounts', name: 'Sarah Smith', status: 'approved', timestamp: '2026-02-15 11:30', comment: 'Verified and approved' }
    ],
  },
  {
    id: 'BILL004',
    employeeName: 'Sarah Connor',
    vendorName: 'Express Courier',
    invoiceNumber: 'INV-2024-003',
    gstNumber: '29ABCDE1234F1Z8',
    date: '2026-02-14',
    amount: 1200,
    category: 'Courier',
    description: 'Document delivery',
    status: 'pending',
    riskScore: 55,
    riskLevel: 'medium',
    fraudAlerts: ['Duplicate invoice number detected'],
    approvalHistory: [
      { role: 'Employee', name: 'Sarah Connor', status: 'approved', timestamp: '2026-02-14 16:45' }
    ],
  },
  {
    id: 'BILL005',
    employeeName: 'Robert Brown',
    vendorName: 'Office Mart',
    invoiceNumber: 'INV-2024-005',
    gstNumber: '29ABCDE1234F1Z9',
    date: '2026-02-16',
    amount: 15000,
    category: 'Office Supplies',
    description: 'Office furniture and supplies',
    status: 'approved',
    riskScore: 20,
    riskLevel: 'low',
    fraudAlerts: [],
    approvalHistory: [
      { role: 'Employee', name: 'Robert Brown', status: 'approved', timestamp: '2026-02-16 10:00' },
      { role: 'Accounts', name: 'Sarah Smith', status: 'approved', timestamp: '2026-02-16 14:20' },
      { role: 'Manager', name: 'Mike Johnson', status: 'approved', timestamp: '2026-02-16 16:30' }
    ],
  },
];

const mockVendors: Vendor[] = [
  { id: 'V001', name: 'City Travels', gstNumber: '29ABCDE1234F1Z5', totalBills: 12, totalAmount: 54000, riskLevel: 'low' },
  { id: 'V002', name: 'Tech Repairs Co', gstNumber: '29ABCDE1234F1Z6', totalBills: 8, totalAmount: 304000, riskLevel: 'high' },
  { id: 'V003', name: 'Fast Fuel Station', gstNumber: '29ABCDE1234F1Z7', totalBills: 25, totalAmount: 62500, riskLevel: 'low' },
  { id: 'V004', name: 'Express Courier', gstNumber: '29ABCDE1234F1Z8', totalBills: 15, totalAmount: 18000, riskLevel: 'medium' },
  { id: 'V005', name: 'Office Mart', gstNumber: '29ABCDE1234F1Z9', totalBills: 6, totalAmount: 90000, riskLevel: 'low' },
];

const mockNotifications: Notification[] = [
  { id: 'N001', title: 'New Bill Submitted', message: 'John Doe submitted a bill for ₹4,500', type: 'info', timestamp: '2026-02-17 09:30', read: false },
  { id: 'N002', title: 'High Risk Alert', message: 'Bill BILL002 has been flagged as high risk', type: 'warning', timestamp: '2026-02-17 08:15', read: false },
  { id: 'N003', title: 'Bill Approved', message: 'Your bill BILL003 has been approved', type: 'success', timestamp: '2026-02-16 11:30', read: true },
  { id: 'N004', title: 'Duplicate Invoice', message: 'Duplicate invoice number detected in BILL004', type: 'error', timestamp: '2026-02-16 16:45', read: false },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addBill = (billData: Omit<Bill, 'id' | 'status' | 'approvalHistory'>) => {
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
    setBills([newBill, ...bills]);

    // Add notification
    const newNotification: Notification = {
      id: `N${String(notifications.length + 1).padStart(3, '0')}`,
      title: 'New Bill Submitted',
      message: `${billData.employeeName} submitted a bill for ₹${billData.amount.toLocaleString()}`,
      type: 'info',
      timestamp: new Date().toLocaleString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const updateBillStatus = (billId: string, status: BillStatus, role: string, name: string, comment?: string) => {
    setBills(bills.map(bill => {
      if (bill.id === billId) {
        const newStep: ApprovalStep = {
          role,
          name,
          status: status === 'pending' ? 'approved' : status,
          timestamp: new Date().toLocaleString(),
          comment,
        };
        return {
          ...bill,
          status,
          approvalHistory: [...bill.approvalHistory, newStep],
        };
      }
      return bill;
    }));

    // Add notification
    const newNotification: Notification = {
      id: `N${String(notifications.length + 1).padStart(3, '0')}`,
      title: status === 'approved' ? 'Bill Approved' : 'Bill Rejected',
      message: `Bill ${billId} has been ${status} by ${name}`,
      type: status === 'approved' ? 'success' : 'error',
      timestamp: new Date().toLocaleString(),
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
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
