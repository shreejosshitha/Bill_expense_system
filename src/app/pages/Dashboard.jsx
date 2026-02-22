import { useAuth } from "../context/AuthContext";
import EmployeeDashboard from "./EmployeeDashboard";
import AccountsDashboard from "./AccountsDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AdminDashboard from "./AdminDashboard";
function Dashboard() {
  const { user } = useAuth();
  switch (user?.role) {
    case "employee":
      return <EmployeeDashboard />;
    case "accounts":
      return <AccountsDashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <EmployeeDashboard />;
  }
}
export {
  Dashboard as default
};
