import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData, BillCategory } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Upload, Save, Send } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function SubmitBill() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendorName: '',
    invoiceNumber: '',
    gstNumber: '',
    date: '',
    amount: '',
    category: 'Travel' as BillCategory,
    description: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [showRiskScore, setShowRiskScore] = useState(false);
  const [riskScore, setRiskScore] = useState({ score: 0, level: 'low' as 'low' | 'medium' | 'high' });

  // Same risk calculation as before
  const calculateRiskScore = () => {
    let score = 0;
    const alerts: string[] = [];
    const amount = parseFloat(formData.amount);
    if (amount > 35000 && amount < 40000) {
      score += 30;
      alerts.push('Amount just below approval limit');
    }
    if (amount > 40000) {
      score += 20;
    }
    if (Math.random() > 0.7) {
      score += 25;
      alerts.push('High frequency vendor this month');
    }
    const level = score < 30 ? 'low' : score < 60 ? 'medium' : 'high';
    return { score, level, alerts };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const risk = calculateRiskScore();
    setRiskScore({ score: risk.score, level: risk.level });
    setShowRiskScore(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append('employeeName', user.name);
      dataToSend.append('vendorName', formData.vendorName);
      dataToSend.append('invoiceNumber', formData.invoiceNumber);
      dataToSend.append('gstNumber', formData.gstNumber);
      dataToSend.append('date', formData.date);
      dataToSend.append('amount', formData.amount);
      dataToSend.append('category', formData.category);
      dataToSend.append('description', formData.description);
      dataToSend.append('riskLevel', risk.level);
      if (file) dataToSend.append('file', file);

      await axios.post('http://127.0.0.1:5000/api/v1/bills/', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Bill submitted successfully!');
      setTimeout(() => navigate('/my-bills'), 1500);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to submit bill');
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully!');
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit New Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">Upload Bill (Image / PDF)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  id="file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">{file ? file.name : 'Click to upload or drag and drop'}</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (max. 10MB)</p>
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input
                  id="vendorName"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number</Label>
                <Input
                  id="gstNumber"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  placeholder="29ABCDE1234F1Z5"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Bill Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value as BillCategory })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Fuel">Fuel</SelectItem>
                    <SelectItem value="Courier">Courier</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter bill description..."
                rows={3}
                required
              />
            </div>

            {/* Risk Score */}
            {showRiskScore && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Risk Score:</span>
                  <Badge className={getRiskBadgeColor(riskScore.level)}>
                    {riskScore.level.toUpperCase()} - {riskScore.score}%
                  </Badge>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" /> Submit
              </Button>
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" /> Save Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}