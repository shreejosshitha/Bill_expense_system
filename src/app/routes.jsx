import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubmitBill from "./pages/SubmitBill";
import MyBills from "./pages/MyBills";
import PendingBills from "./pages/PendingBills";
import AllBills from "./pages/AllBills";
import BillDetail from "./pages/BillDetail";
import VendorManagement from "./pages/VendorManagement";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import ApprovalPolicy from "./pages/ApprovalPolicy";
import SystemLogs from "./pages/SystemLogs";
function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
}
const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login
  },
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: "dashboard",
        Component: Dashboard
      },
      {
        path: "submit-bill",
        Component: SubmitBill
      },
      {
        path: "my-bills",
        Component: MyBills
      },
      {
        path: "pending-bills",
        Component: PendingBills
      },
      {
        path: "pending-approvals",
        Component: PendingBills
      },
      {
        path: "all-bills",
        Component: AllBills
      },
      {
        path: "high-risk-bills",
        element: <AllBills />
      },
      {
        path: "high-amount-bills",
        element: <AllBills />
      },
      {
        path: "risk-alerts",
        element: <AllBills />
      },
      {
        path: "bill/:billId",
        Component: BillDetail
      },
      {
        path: "vendor-management",
        Component: VendorManagement
      },
      {
        path: "notifications",
        Component: Notifications
      },
      {
        path: "profile",
        Component: Profile
      },
      {
        path: "reports",
        Component: Reports
      },
      {
        path: "approval-policy",
        Component: ApprovalPolicy
      },
      {
        path: "user-management",
        element: <div className="p-6"><h2 className="text-2xl font-bold">User Management</h2><p className="text-gray-500 mt-2">Manage system users and their roles</p></div>
      },
      {
        path: "analytics",
        Component: Dashboard
      },
      {
        path: "system-logs",
        Component: SystemLogs
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />
  }
]);
export {
  router
};
