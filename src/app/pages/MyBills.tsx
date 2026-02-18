import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Search, Eye } from 'lucide-react';
import axios from 'axios';

export default function MyBills() {
  const { user } = useAuth();
  const [bills, setBills] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch bills from backend
  useEffect(() => {
    if (!user) return;

    axios.get(`http://127.0.0.1:5000/api/v1/bills/user/${user.id}`)
      .then(res => setBills(res.data))
      .catch(err => console.error(err));
  }, [user]);

  const filteredBills = bills.filter(
    b =>
      b.id.toString().includes(searchTerm) ||
      b.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Approved: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.Pending;
  };

  const getRiskBadge = (level: string) => {
    const colors = {
      Low: 'bg-green-100 text-green-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      High: 'bg-red-100 text-red-700',
    };
    return colors[level] || colors.Low;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Bills</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.vendorName}</TableCell>
                  <TableCell>{bill.invoiceNumber}</TableCell>
                  <TableCell>₹{bill.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{bill.category}</Badge>
                  </TableCell>
                  <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(bill.status)}>
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskBadge(bill.riskScore)}>
                      {bill.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/bill/${bill.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                    No bills found
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