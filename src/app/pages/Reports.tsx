import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, FileText, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const { bills } = useData();
  const [dateFrom, setDateFrom] = useState('2026-02-01');
  const [dateTo, setDateTo] = useState('2026-02-28');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  // Monthly expense data
  const monthlyData = [
    { month: 'Sep 2025', amount: 78000, count: 15 },
    { month: 'Oct 2025', amount: 85000, count: 18 },
    { month: 'Nov 2025', amount: 92000, count: 22 },
    { month: 'Dec 2025', amount: 88000, count: 20 },
    { month: 'Jan 2026', amount: 95000, count: 24 },
    { month: 'Feb 2026', amount: bills.reduce((sum, b) => sum + b.amount, 0), count: bills.length },
  ];

  // Category breakdown
  const categoryData = [
    { name: 'Travel', amount: bills.filter(b => b.category === 'Travel').reduce((s, b) => s + b.amount, 0) },
    { name: 'Repair', amount: bills.filter(b => b.category === 'Repair').reduce((s, b) => s + b.amount, 0) },
    { name: 'Fuel', amount: bills.filter(b => b.category === 'Fuel').reduce((s, b) => s + b.amount, 0) },
    { name: 'Courier', amount: bills.filter(b => b.category === 'Courier').reduce((s, b) => s + b.amount, 0) },
    { name: 'Office', amount: bills.filter(b => b.category === 'Office Supplies').reduce((s, b) => s + b.amount, 0) },
  ];

  // Approval time trend
  const approvalTimeData = [
    { day: 'Mon', hours: 2.1 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 2.5 },
    { day: 'Thu', hours: 3.2 },
    { day: 'Fri', hours: 2.0 },
  ];

  const handleExportPDF = () => {
    toast.success('Exporting report as PDF...');
  };

  const handleExportExcel = () => {
    toast.success('Exporting report as Excel...');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Select value={vendorFilter} onValueChange={setVendorFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  <SelectItem value="city-travels">City Travels</SelectItem>
                  <SelectItem value="tech-repairs">Tech Repairs Co</SelectItem>
                  <SelectItem value="fast-fuel">Fast Fuel Station</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                  <SelectItem value="Courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Risk Level</Label>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex items-end">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={handleExportPDF} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
            <Button onClick={handleExportExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Approval Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={approvalTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} hours`} />
                <Line type="monotone" dataKey="hours" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Fraud Pattern Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-gray-600 mb-1">Duplicate Invoices Detected</p>
              <p className="text-2xl font-bold text-red-600">
                {bills.filter(b => b.fraudAlerts.some(a => a.includes('Duplicate'))).length}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600 mb-1">High Frequency Vendors</p>
              <p className="text-2xl font-bold text-yellow-600">
                {bills.filter(b => b.fraudAlerts.some(a => a.includes('frequency'))).length}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">Amount Threshold Alerts</p>
              <p className="text-2xl font-bold text-orange-600">
                {bills.filter(b => b.fraudAlerts.some(a => a.includes('limit'))).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
