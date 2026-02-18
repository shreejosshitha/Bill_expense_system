import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  DollarSign,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

export default function BillDetail() {
  const { billId } = useParams();
  const { user } = useAuth();
  const { bills, updateBillStatus } = useData();
  const navigate = useNavigate();

  const bill = bills.find(b => b.id === billId);
  const [comment, setComment] = useState('');

  if (!bill) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Bill not found</p>
      </div>
    );
  }

  const handleApprove = () => {
    updateBillStatus(bill.id, 'approved', user?.role || '', user?.name || '', comment);
    toast.success('Bill approved successfully!');
    navigate(-1);
  };

  const handleReject = () => {
    updateBillStatus(bill.id, 'rejected', user?.role || '', user?.name || '', comment);
    toast.error('Bill rejected');
    navigate(-1);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bill Details - {bill.id}</h2>
          <p className="text-gray-500">Review and approve expense bill</p>
        </div>
        <Badge className={getStatusBadge(bill.status)}>
          {bill.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bill Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bill Image Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Bill Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-2" />
                  <p>Bill image preview</p>
                  <p className="text-sm">Document uploaded by {bill.employeeName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bill Information */}
          <Card>
            <CardHeader>
              <CardTitle>Bill Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <User className="w-4 h-4" />
                    <span>Employee</span>
                  </div>
                  <p className="font-medium">{bill.employeeName}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Package className="w-4 h-4" />
                    <span>Vendor</span>
                  </div>
                  <p className="font-medium">{bill.vendorName}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <FileText className="w-4 h-4" />
                    <span>Invoice Number</span>
                  </div>
                  <p className="font-medium">{bill.invoiceNumber}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <FileText className="w-4 h-4" />
                    <span>GST Number</span>
                  </div>
                  <p className="font-medium">{bill.gstNumber}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Bill Date</span>
                  </div>
                  <p className="font-medium">{new Date(bill.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Amount</span>
                  </div>
                  <p className="font-bold text-lg">₹{bill.amount.toLocaleString()}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500 mb-1">Category</p>
                <Badge variant="outline">{bill.category}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{bill.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Risk & Approval */}
        <div className="space-y-6">
          {/* Risk Score Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Risk Score</span>
                  <Badge className={getRiskBadgeColor(bill.riskLevel)}>
                    {bill.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <Progress value={bill.riskScore} className="h-2" />
                <p className={`text-right mt-1 font-bold ${getRiskColor(bill.riskLevel)}`}>
                  {bill.riskScore}%
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-medium">Fraud Alerts</p>
                {bill.fraudAlerts.length > 0 ? (
                  bill.fraudAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-700">{alert}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-2 p-2 bg-green-50 rounded border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-green-700">No fraud alerts detected</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Duplicate Invoice Check</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Vendor Frequency Alert</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Amount Threshold Check</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Policy Compliance</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bill.approvalHistory.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'approved'
                            ? 'bg-green-100'
                            : step.status === 'rejected'
                            ? 'bg-red-100'
                            : 'bg-yellow-100'
                        }`}
                      >
                        {step.status === 'approved' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : step.status === 'rejected' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      {index < bill.approvalHistory.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{step.role}</p>
                      <p className="text-sm text-gray-600">{step.name}</p>
                      {step.timestamp && (
                        <p className="text-xs text-gray-400">{step.timestamp}</p>
                      )}
                      {step.comment && (
                        <p className="text-sm text-gray-600 mt-1 italic">"{step.comment}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments & Actions */}
          {bill.status === 'pending' && (user?.role === 'accounts' || user?.role === 'manager') && (
            <Card>
              <CardHeader>
                <CardTitle>Review Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Comments (Optional)</Label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your comments..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>

                <Button variant="outline" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Escalate
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
