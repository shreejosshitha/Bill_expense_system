import { createContext, useContext, useState, useEffect } from "react";
const DataContext = createContext(void 0);
const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};
const mockBills = [
  {
    id: "BILL001",
    employeeName: "John Doe",
    vendorName: "City Travels",
    invoiceNumber: "INV-001",
    gstNumber: "29ABCDE1234F1Z5",
    date: "2026-02-10",
    amount: 4500,
    category: "Travel",
    description: "Client meeting travel expense",
    status: "pending_accounts",
    riskScore: 25,
    riskLevel: "low",
    fraudAlerts: [],
    approvalHistory: [
      {
        role: "Employee",
        name: "John Doe",
        status: "submitted",
        timestamp: "2026-02-10 10:30"
      }
    ]
  }
];
const mockVendors = [];
const mockNotifications = [];
const BILLS_STORAGE_KEY = "bills_data";
const NOTIFICATIONS_STORAGE_KEY = "notifications_data";
const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return fallback;
};
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};
const DataProvider = ({ children }) => {
  const [bills, setBills] = useState(
    () => loadFromStorage(BILLS_STORAGE_KEY, mockBills)
  );
  const [vendors] = useState(mockVendors);
  const [notifications, setNotifications] = useState(
    () => loadFromStorage(NOTIFICATIONS_STORAGE_KEY, mockNotifications)
  );
  useEffect(() => {
    saveToStorage(BILLS_STORAGE_KEY, bills);
  }, [bills]);
  useEffect(() => {
    saveToStorage(NOTIFICATIONS_STORAGE_KEY, notifications);
  }, [notifications]);
  const addBill = (billData) => {
    const newBill = {
      ...billData,
      id: `BILL${String(bills.length + 1).padStart(3, "0")}`,
      status: "pending_accounts",
      // Goes to Accounts first for approval
      approvalHistory: [
        {
          role: "Employee",
          name: billData.employeeName,
          status: "submitted",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleString()
        }
      ]
    };
    setBills((prev) => [newBill, ...prev]);
  };
  const updateBillStatus = (billId, status, role, name, comment) => {
    if (role === "employee") {
      console.log("Employee cannot approve bills");
      return;
    }
    setBills(
      (prevBills) => prevBills.map((bill) => {
        if (bill.id !== billId) return bill;
        const newStep = {
          role,
          name,
          status: status === "rejected" ? "rejected" : "approved",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleString(),
          comment
        };
        const updatedHistory = [...bill.approvalHistory, newStep];
        if (role === "accounts") {
          if (bill.status !== "pending_accounts") {
            return bill;
          }
          if (status === "rejected") {
            return {
              ...bill,
              status: "rejected",
              approvalHistory: updatedHistory
            };
          }
          if (bill.amount <= 5e3) {
            return {
              ...bill,
              status: "approved",
              approvalHistory: updatedHistory
            };
          }
          return {
            ...bill,
            status: "pending_manager",
            approvalHistory: updatedHistory
          };
        }
        if (role === "manager") {
          if (bill.status !== "pending_manager") {
            return bill;
          }
          return {
            ...bill,
            status,
            approvalHistory: updatedHistory
          };
        }
        return bill;
      })
    );
    let notificationTitle = "";
    let notificationMessage = "";
    let notificationType = "info";
    if (status === "approved") {
      notificationTitle = "Bill Approved";
      notificationType = "success";
      if (role === "manager") {
        notificationMessage = `Your bill ${billId} has been approved by Manager ${name}`;
      } else {
        notificationMessage = `Your bill ${billId} has been approved by Accounts`;
      }
    } else if (status === "rejected") {
      notificationTitle = "Bill Rejected";
      notificationType = "error";
      notificationMessage = `Your bill ${billId} has been rejected by ${role === "manager" ? "Manager" : "Accounts"}`;
    } else if (status === "pending_manager") {
      notificationTitle = "Bill Escalated to Manager";
      notificationType = "info";
      notificationMessage = `Your bill ${billId} has been forwarded to Manager for final approval`;
    } else {
      notificationTitle = "Bill Updated";
      notificationMessage = `Bill ${billId} has been updated by ${name}`;
    }
    const newNotification = {
      id: `N${String(notifications.length + 1).padStart(3, "0")}`,
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleString(),
      read: false
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };
  const markNotificationAsRead = (id) => {
    setNotifications(
      (prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n)
    );
  };
  return <DataContext.Provider
    value={{
      bills,
      vendors,
      notifications,
      addBill,
      updateBillStatus,
      markNotificationAsRead
    }}
  >
      {children}
    </DataContext.Provider>;
};
export {
  DataProvider,
  useData
};
