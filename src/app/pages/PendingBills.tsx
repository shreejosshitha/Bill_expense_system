import { Link } from 'react-router';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Eye, AlertTriangle } from 'lucide-react';

export default function PendingBills() {
  const { bills } = useData();

  const pendingBills = bills.filter(b => b.status === 'pending_accounts' || b.status === 'pending_manager');

  const getRiskBadge = (level: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[level] || colors.low;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Bills for Review</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {pendingBills.length} bill(s) awaiting approval
              </p>
            </div>
          </div>
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
                <TableHead>Risk Level</TableHead>
                <TableHead>Fraud Alerts</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingBills.map((bill) => (
                <TableRow key={bill.id} className={bill.riskLevel === 'high' ? 'bg-red-50' : ''}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.employeeName}</TableCell>
                  <TableCell>{bill.vendorName}</TableCell>
                  <TableCell className="font-bold">₹{bill.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{bill.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskBadge(bill.riskLevel)}>
                      {bill.riskLevel} - {bill.riskScore}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {bill.fraudAlerts.length > 0 ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{bill.fraudAlerts.length}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link to={`/bill/${bill.id}`}>
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {pendingBills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                    No pending bills
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
