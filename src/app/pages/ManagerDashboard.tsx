import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { FileCheck, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function ManagerDashboard() {
  const { bills } = useData();

  const pendingFinalApprovals = bills.filter(b => b.status === 'pending_manager').length;
  const highAmountBills = bills.filter(b => b.amount >= 40000).length;
  const riskAlerts = bills.filter(b => b.riskLevel === 'high').length;
  const avgApprovalTime = 2.5; // Mock data in hours

  // Approval delay tracking
  const delayData = [
    { day: 'Mon', hours: 2.1 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 2.5 },
    { day: 'Thu', hours: 3.2 },
    { day: 'Fri', hours: 2.0 },
  ];

  // Department-wise expense
  const deptData = [
    { dept: 'Sales', amount: 45000 },
    { dept: 'Marketing', amount: 32000 },
    { dept: 'IT', amount: 58000 },
    { dept: 'HR', amount: 18000 },
    { dept: 'Operations', amount: 35000 },
  ];

  const getRiskBadge = (level: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[level as keyof typeof colors] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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

      {/* Charts */}
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
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bills Requiring Manager Approval */}
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
              {bills.filter(b => b.status === 'pending_manager').map((bill) => (
                <TableRow key={bill.id}>
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
                    {bill.fraudAlerts.length > 0 ? (
                      <Badge variant="outline" className="text-red-600 border-red-300">
                        {bill.fraudAlerts.length} alert(s)
                      </Badge>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {bills.filter(b => b.status === 'pending_manager').length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    No bills requiring approval
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
