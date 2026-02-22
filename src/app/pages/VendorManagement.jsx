import { useState } from "react";
import { useData } from "../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../components/ui/table";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
function VendorManagement() {
  const { vendors } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    gstNumber: ""
  });
  const filteredVendors = vendors.filter(
    (v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.gstNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAddVendor = () => {
    toast.success("Vendor added successfully!");
    setIsDialogOpen(false);
    setNewVendor({ name: "", gstNumber: "" });
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
            <div>
              <CardTitle>Vendor Management</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Manage and monitor vendor information
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vendor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                  <DialogDescription>
                    Enter the vendor details to add to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName">Vendor Name</Label>
                    <Input
    id="vendorName"
    value={newVendor.name}
    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
    placeholder="Enter vendor name"
  />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorGST">GST Number</Label>
                    <Input
    id="vendorGST"
    value={newVendor.gstNumber}
    onChange={(e) => setNewVendor({ ...newVendor, gstNumber: e.target.value })}
    placeholder="29ABCDE1234F1Z5"
  />
                  </div>
                  <Button onClick={handleAddVendor} className="w-full">
                    Add Vendor
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
    placeholder="Search vendors..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="pl-10"
  />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>Total Bills</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell className="font-mono text-sm">{vendor.gstNumber}</TableCell>
                  <TableCell>{vendor.totalBills}</TableCell>
                  <TableCell className="font-bold">₹{vendor.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getRiskBadge(vendor.riskLevel)}>
                      {vendor.riskLevel}
                    </Badge>
                  </TableCell>
                </TableRow>)}
              {filteredVendors.length === 0 && <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No vendors found
                  </TableCell>
                </TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
}
export {
  VendorManagement as default
};
