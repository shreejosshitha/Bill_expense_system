import { useAuth } from "../context/AuthContext";
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
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
function EmployeeDashboard() {
  const { user } = useAuth();
  const { bills } = useData();
  const myBills = bills.filter((b) => b.employeeName === user?.name);
  const totalSubmitted = myBills.length;
  const approvedBills = myBills.filter((b) => b.status === "approved").length;
  const pendingBills = myBills.filter((b) => b.status === "pending_accounts" || b.status === "pending_manager").length;
  const rejectedBills = myBills.filter((b) => b.status === "rejected").length;
  const getPersonalExpenseData = () => {
    const monthlyExpenses = {};
    const now = /* @__PURE__ */ new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString("en-US", { month: "short" });
      monthlyExpenses[monthKey] = 0;
    }
    myBills.forEach((bill) => {
      const billDate = new Date(bill.date);
      const monthKey = billDate.toLocaleDateString("en-US", { month: "short" });
      if (monthlyExpenses[monthKey] !== void 0) {
        monthlyExpenses[monthKey] += bill.amount;
      }
    });
    return Object.entries(monthlyExpenses).map(([month, amount]) => ({ month, amount }));
  };
  const personalExpenseData = getPersonalExpenseData();
  const getCategoryData = () => {
    const categoryColors = {
      "Travel": "#3b82f6",
      "Repair": "#ef4444",
      "Fuel": "#10b981",
      "Courier": "#f59e0b",
      "Office Supplies": "#8b5cf6",
      "Other": "#6b7280"
    };
    const categoryExpenses = {};
    myBills.forEach((bill) => {
      if (categoryExpenses[bill.category]) {
        categoryExpenses[bill.category] += bill.amount;
      } else {
        categoryExpenses[bill.category] = bill.amount;
      }
    });
    return Object.entries(categoryExpenses).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || categoryColors["Other"]
    }));
  };
  const categoryData = getCategoryData();
  const getRiskBadge = (level) => {
    const colors = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700"
    };
    return colors[level] || colors.low;
  };
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
    /* Welcome */
  }
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h2>
        <p className="text-gray-500">Here's your expense overview</p>
      </div>

      {
    /* Stats Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Submitted
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmitted}</div>
            <p className="text-xs text-gray-500">All time bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Approved Bills
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedBills}</div>
            <p className="text-xs text-gray-500">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Bills
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingBills}</div>
            <p className="text-xs text-gray-500">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rejected Bills
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedBills}</div>
            <p className="text-xs text-gray-500">Need revision</p>
          </CardContent>
        </Card>
      </div>

      {
    /* Charts */
  }
      {myBills.length > 0 && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Expense Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={personalExpenseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `\u20B9${Number(value).toLocaleString()}`} />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Spending by Category</CardTitle>
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
        </div>}

      {
    /* Recent Activity */
  }
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myBills.slice(0, 5).map((bill) => <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.vendorName}</TableCell>
                  <TableCell>₹{bill.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(bill.status)}>
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskBadge(bill.riskLevel)}>
                      {bill.riskScore}%
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                </TableRow>)}
              {myBills.length === 0 && <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No bills submitted yet
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}
export {
  EmployeeDashboard as default
};
