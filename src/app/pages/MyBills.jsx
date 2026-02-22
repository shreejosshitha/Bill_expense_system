import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { Search, Eye } from "lucide-react";
function MyBills() {
  const { user } = useAuth();
  const { bills } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const myBills = bills.filter((b) => b.employeeName === user?.name);
  const filteredBills = myBills.filter(
    (b) => b.id.toLowerCase().includes(searchTerm.toLowerCase()) || b.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
  const getRiskBadge = (level) => {
    const colors = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700"
    };
    return colors[level] || colors.low;
  };
  return <div className="space-y-6">
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
              {filteredBills.map((bill) => <TableRow key={bill.id}>
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
                      {bill.status === "pending_accounts" ? "Pending Accounts" : bill.status === "pending_manager" ? "Pending Manager" : bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskBadge(bill.riskLevel)}>
                      {bill.riskScore}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link to={`/bill/${bill.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>)}
              {filteredBills.length === 0 && <TableRow>
                  <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                    No bills found
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}
export {
  MyBills as default
};
