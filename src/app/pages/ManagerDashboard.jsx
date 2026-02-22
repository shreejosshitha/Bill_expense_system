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
import { FileCheck, DollarSign, AlertTriangle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
function ManagerDashboard() {
  const { bills } = useData();
  const pendingFinalApprovals = bills.filter((b) => b.status === "pending_manager").length;
  const highAmountBills = bills.filter((b) => b.amount >= 4e4).length;
  const riskAlerts = bills.filter((b) => b.riskLevel === "high").length;
  const avgApprovalTime = 2.5;
  const getApprovalDelayData = () => {
    const dayMap = {
      "Mon": [],
      "Tue": [],
      "Wed": [],
      "Thu": [],
      "Fri": [],
      "Sat": [],
      "Sun": []
    };
    bills.forEach((bill) => {
      if (bill.approvalHistory.length > 1) {
        const submitted = bill.approvalHistory.find((h) => h.status === "submitted");
        const approved = bill.approvalHistory.find((h) => h.status === "approved");
        if (submitted && approved && submitted.timestamp && approved.timestamp) {
          const submitDate = new Date(submitted.timestamp);
          const approveDate = new Date(approved.timestamp);
          const hours = (approveDate.getTime() - submitDate.getTime()) / (1e3 * 60 * 60);
          const day = submitDate.toLocaleDateString("en-US", { weekday: "short" });
          if (dayMap[day]) {
            dayMap[day].push(hours);
          }
        }
      }
    });
    return Object.entries(dayMap).map(([day, hoursArr]) => ({
      day,
      hours: hoursArr.length > 0 ? +(hoursArr.reduce((a, b) => a + b, 0) / hoursArr.length).toFixed(1) : 0
    }));
  };
  const delayData = getApprovalDelayData();
  const getDeptData = () => {
    const vendorExpenses = {};
    bills.forEach((bill) => {
      if (vendorExpenses[bill.vendorName]) {
        vendorExpenses[bill.vendorName] += bill.amount;
      } else {
        vendorExpenses[bill.vendorName] = bill.amount;
      }
    });
    return Object.entries(vendorExpenses).sort(([, a], [, b]) => b - a).slice(0, 5).map(([vendor, amount]) => ({ dept: vendor, amount }));
  };
  const deptData = getDeptData();
  const getRiskBadge = (level) => {
    const colors = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700"
    };
    return colors[level] || colors.low;
  };
  return <div className="space-y-6">
      {
    /* Stats Cards */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Final Approvals
            </CardTitle>
            <FileCheck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingFinalApprovals}</div>
            <p className="text-xs text-gray-500">Need your approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              High Amount Bills
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{highAmountBills}</div>
            <p className="text-xs text-gray-500">Above ₹40,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Risk Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{riskAlerts}</div>
            <p className="text-xs text-gray-500">High risk bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Approval Time
            </CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgApprovalTime}h</div>
            <p className="text-xs text-gray-500">Average response</p>
          </CardContent>
        </Card>
      </div>

      {
    /* Charts */
  }
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Approval Delay Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={delayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} hours`} />
                <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department-wise Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip formatter={(value) => `\u20B9${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {
    /* Bills Requiring Manager Approval */
  }
      <Card>
        <CardHeader>
          <CardTitle>Bills Requiring Manager Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Fraud Alerts</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.filter((b) => b.status === "pending_manager").map((bill) => <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.employeeName}</TableCell>
                  <TableCell>{bill.vendorName}</TableCell>
                  <TableCell>₹{bill.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getRiskBadge(bill.riskLevel)}>
                      {bill.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {bill.fraudAlerts.length > 0 ? <Badge variant="outline" className="text-red-600 border-red-300">
                        {bill.fraudAlerts.length} alert(s)
                      </Badge> : <span className="text-gray-400">None</span>}
                  </TableCell>
                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                </TableRow>)}
              {bills.filter((b) => b.status === "pending_manager").length === 0 && <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No bills requiring approval
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}
export {
  ManagerDashboard as default
};
