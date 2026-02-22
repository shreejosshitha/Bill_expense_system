import { useData } from "../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, FileText, AlertTriangle, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
function AdminDashboard() {
  const { bills, vendors } = useData();
  const totalUsers = 48;
  const totalBills = bills.length;
  const fraudAlerts = bills.filter((b) => b.fraudAlerts.length > 0).length;
  const policyViolations = bills.filter((b) => b.riskLevel === "high").length;
  const vendorSpending = vendors.slice(0, 5).map((v) => ({
    name: v.name,
    amount: v.totalAmount
  }));
  const topVendors = [...vendors].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5);
  const growthData = [
    { month: "Sep", amount: 78e3 },
    { month: "Oct", amount: 85e3 },
    { month: "Nov", amount: 92e3 },
    { month: "Dec", amount: 88e3 },
    { month: "Jan", amount: 95e3 },
    { month: "Feb", amount: bills.reduce((sum, b) => sum + b.amount, 0) }
  ];
  const riskData = [
    { name: "Low", value: bills.filter((b) => b.riskLevel === "low").length, color: "#10b981" },
    { name: "Medium", value: bills.filter((b) => b.riskLevel === "medium").length, color: "#f59e0b" },
    { name: "High", value: bills.filter((b) => b.riskLevel === "high").length, color: "#ef4444" }
  ];
  return <div className="space-y-6">
      {
    /* Stats Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <p className="text-xs text-gray-500">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bills
            </CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalBills}</div>
            <p className="text-xs text-gray-500">All submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fraud Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{fraudAlerts}</div>
            <p className="text-xs text-gray-500">Flagged bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Policy Violations
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{policyViolations}</div>
            <p className="text-xs text-gray-500">High risk items</p>
          </CardContent>
        </Card>
      </div>

      {
    /* Advanced Analytics */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendor-wise Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={vendorSpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `\u20B9${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
    data={riskData}
    cx="50%"
    cy="50%"
    labelLine={false}
    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    outerRadius={80}
    fill="#8884d8"
    dataKey="value"
  >
                  {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `\u20B9${Number(value).toLocaleString()}`} />
                <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {
    /* Top 5 High Expense Vendors */
  }
      <Card>
        <CardHeader>
          <CardTitle>Top 5 High Expense Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topVendors.map((vendor, index) => <div key={vendor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 font-bold w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-gray-500">{vendor.totalBills} bills</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">₹{vendor.totalAmount.toLocaleString()}</p>
                  <Badge
    className={vendor.riskLevel === "low" ? "bg-green-100 text-green-700" : vendor.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}
  >
                    {vendor.riskLevel} risk
                  </Badge>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
}
export {
  AdminDashboard as default
};
