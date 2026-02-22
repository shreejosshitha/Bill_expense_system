import { useData } from "../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { FileText, AlertTriangle, TrendingUp, Copy } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
function AccountsDashboard() {
  const { bills } = useData();
  const pendingBills = bills.filter((b) => b.status === "pending_accounts").length;
  const highRiskBills = bills.filter((b) => b.riskLevel === "high").length;
  const totalMonthlyExpense = bills.reduce((sum, b) => sum + b.amount, 0);
  const duplicateAlerts = bills.filter((b) => b.fraudAlerts.some((a) => a.includes("Duplicate"))).length;
  const getMonthlyData = () => {
    const monthlyExpenses = {};
    const now = /* @__PURE__ */ new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      monthlyExpenses[monthKey] = 0;
    }
    bills.forEach((bill) => {
      const billDate = new Date(bill.date);
      const monthKey = billDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      if (monthlyExpenses[monthKey] !== void 0) {
        monthlyExpenses[monthKey] += bill.amount;
      }
    });
    return Object.entries(monthlyExpenses).map(([month, amount]) => ({
      month: month.split(" ")[0],
      // Just the month name
      amount
    }));
  };
  const monthlyData = getMonthlyData();
  const categoryData = [
    { name: "Travel", value: bills.filter((b) => b.category === "Travel").reduce((s, b) => s + b.amount, 0), color: "#3b82f6" },
    { name: "Repair", value: bills.filter((b) => b.category === "Repair").reduce((s, b) => s + b.amount, 0), color: "#ef4444" },
    { name: "Fuel", value: bills.filter((b) => b.category === "Fuel").reduce((s, b) => s + b.amount, 0), color: "#10b981" },
    { name: "Courier", value: bills.filter((b) => b.category === "Courier").reduce((s, b) => s + b.amount, 0), color: "#f59e0b" },
    { name: "Office Supplies", value: bills.filter((b) => b.category === "Office Supplies").reduce((s, b) => s + b.amount, 0), color: "#8b5cf6" }
  ];
  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      pending_accounts: "bg-blue-100 text-blue-700",
      pending_manager: "bg-purple-100 text-purple-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700"
    };
    return colors[status] || colors.pending;
  };
  return <div className="space-y-6">
      {
    /* Stats Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Bills
            </CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingBills}</div>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              High Risk Bills
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highRiskBills}</div>
            <p className="text-xs text-gray-500">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Monthly Expenses
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalMonthlyExpense / 1e3).toFixed(1)}K</div>
            <p className="text-xs text-gray-500">February 2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Duplicate Alerts
            </CardTitle>
            <Copy className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{duplicateAlerts}</div>
            <p className="text-xs text-gray-500">Potential duplicates</p>
          </CardContent>
        </Card>
      </div>

      {
    /* Charts */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `\u20B9${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category-wise Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
    data={categoryData}
    cx="50%"
    cy="50%"
    labelLine={false}
    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    outerRadius={80}
    fill="#8884d8"
    dataKey="value"
  >
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => `\u20B9${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {
    /* Bills Waiting for Approval */
  }
      <Card>
        <CardHeader>
          <CardTitle>Bills Waiting for Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.filter((b) => b.status === "pending_accounts").map((bill) => <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.employeeName}</TableCell>
                  <TableCell>{bill.vendorName}</TableCell>
                  <TableCell>₹{bill.amount.toLocaleString()}</TableCell>
                  <TableCell>{bill.category}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(bill.status)}>
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                </TableRow>)}
              {bills.filter((b) => b.status === "pending_accounts").length === 0 && <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No pending bills
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}
export {
  AccountsDashboard as default
};
