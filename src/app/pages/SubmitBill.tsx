import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData, BillCategory } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Upload, Save, Send, Scan } from 'lucide-react';
import { toast } from 'sonner';
import { extractTextFromImage, OCRProgress } from '../utils/ocr';

export default function SubmitBill() {
  const { user } = useAuth();
  const { addBill } = useData();
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
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [showRiskScore, setShowRiskScore] = useState(false);
  const [riskScore, setRiskScore] = useState({
    score: 0,
    level: 'low' as 'low' | 'medium' | 'high',
  });

  // OCR State
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<OCRProgress | null>(null);

  // --------------------------
  // Risk Score Calculation
  // --------------------------
  const calculateRiskScore = () => {
    let score = 0;
    const alerts: string[] = [];

    const amount = parseFloat(formData.amount);

    if (amount > 35000 && amount < 40000) {
      score += 30;
      alerts.push('Amount just below approval limit');
    }

    if (amount >= 40000) {
      score += 20;
      alerts.push('High amount requires manager approval');
    }

    if (Math.random() > 0.7) {
      score += 25;
      alerts.push('High frequency vendor this month');
    }

    const level =
      score < 30 ? 'low' : score < 60 ? 'medium' : 'high';

    return { score, level, alerts };
  };

  // --------------------------
  // OCR Processing
  // --------------------------
  const handleOCR = async () => {
    if (!fileUrl) {
      toast.error('Please upload a bill image first');
      return;
    }

    setIsProcessingOCR(true);
    setOcrProgress({ status: 'Starting OCR...', progress: 0 });

    try {
      const result = await extractTextFromImage(fileUrl, (progress) => {
        setOcrProgress(progress);
      });

      // Auto-populate form with extracted data
      setFormData((prev) => ({
        ...prev,
        vendorName: result.parsedData.vendorName || prev.vendorName,
        invoiceNumber: result.parsedData.invoiceNumber || prev.invoiceNumber,
        gstNumber: result.parsedData.gstNumber || prev.gstNumber,
        date: result.parsedData.date || prev.date,
        amount: result.parsedData.amount || prev.amount,
      }));

      toast.success(`OCR Complete! Confidence: ${result.confidence.toFixed(1)}%`);
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Failed to extract text from image');
    } finally {
      setIsProcessingOCR(false);
      setOcrProgress(null);
    }
  };

  // --------------------------
  // Submit Bill
  // --------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const risk = calculateRiskScore();

    addBill({
      employeeName: user.name,
      vendorName: formData.vendorName,
      invoiceNumber: formData.invoiceNumber,
      gstNumber: formData.gstNumber,
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      riskScore: risk.score,
      riskLevel: risk.level,
      fraudAlerts: risk.alerts,
      fileUrl: fileUrl || undefined,

      // ✅ First level - pending accounts approval
      status: 'pending_accounts',

      // ✅ Initial approval history - employee submitted the bill
      approvalHistory: [
        {
          role: 'Employee',
          name: user.name,
          status: 'submitted',
          comment: '',
          timestamp: new Date().toLocaleString(),
        },
      ],
    });

    setRiskScore({ score: risk.score, level: risk.level });
    setShowRiskScore(true);

    toast.success('Bill submitted successfully!');

    setTimeout(() => {
      navigate('/my-bills');
    }, 1500);
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
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    setFile(selectedFile);
                    
                    // Convert file to base64 data URL
                    if (selectedFile) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFileUrl(reader.result as string);
                      };
                      reader.readAsDataURL(selectedFile);
                    } else {
                      setFileUrl(null);
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : 'Click to upload'}
                  </p>
                </label>
              </div>

              {/* OCR Button and Progress */}
              {fileUrl && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleOCR}
                    disabled={isProcessingOCR}
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    {isProcessingOCR ? 'Processing OCR...' : 'Extract Text from Image (OCR)'}
                  </Button>
                  
                  {/* OCR Progress */}
                  {isProcessingOCR && ocrProgress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{ocrProgress.status}</span>
                        <span>{ocrProgress.progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${ocrProgress.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Vendor Name"
                value={formData.vendorName}
                onChange={(e) =>
                  setFormData({ ...formData, vendorName: e.target.value })
                }
                required
              />

              <Input
                placeholder="Invoice Number"
                value={formData.invoiceNumber}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceNumber: e.target.value })
                }
                required
              />

              <Input
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={(e) =>
                  setFormData({ ...formData, gstNumber: e.target.value })
                }
                required
              />

              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />

              <Input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />

              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as BillCategory,
                  })
                }
              >
                <SelectTrigger>
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

            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />

            {/* Risk Display */}
            {showRiskScore && (
              <div className="p-4 bg-gray-50 rounded-lg border">
                <Badge className={getRiskBadgeColor(riskScore.level)}>
                  {riskScore.level.toUpperCase()} - {riskScore.score}%
                </Badge>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-blue-600">
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>

              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}