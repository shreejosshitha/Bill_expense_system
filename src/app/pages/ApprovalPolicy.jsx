import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Save, Settings } from "lucide-react";
import { toast } from "sonner";
function ApprovalPolicy() {
  const [policies, setPolicies] = useState({
    lowThreshold: 5e3,
    mediumThreshold: 4e4,
    travelLimitPerDay: 1e4,
    repairMaxLimit: 5e4,
    autoHighRiskThreshold: 70
  });
  const handleSave = () => {
    toast.success("Approval policies updated successfully!");
  };
  return <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Approval Policy Settings</h2>
          <p className="text-gray-500">Configure approval workflows and thresholds</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Amount-based Approval Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium mb-2">Rule 1: Low Amount Bills</h4>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>Amount &lt;</span>
                <Input
    type="number"
    value={policies.lowThreshold}
    onChange={(e) => setPolicies({ ...policies, lowThreshold: parseInt(e.target.value) })}
    className="w-32"
  />
                <span>→ Accounts Only</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Bills below this amount only require accounts approval
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium mb-2">Rule 2: Medium Amount Bills</h4>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>₹{policies.lowThreshold} - ₹</span>
                <Input
    type="number"
    value={policies.mediumThreshold}
    onChange={(e) => setPolicies({ ...policies, mediumThreshold: parseInt(e.target.value) })}
    className="w-32"
  />
                <span>→ Accounts → Manager</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Bills in this range require both accounts and manager approval
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium mb-2">Rule 3: High Amount Bills</h4>
              <div className="text-sm text-gray-700">
                <span>&gt; ₹{policies.mediumThreshold} → Escalate to Manager</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Bills above this amount require manager approval and may need additional review
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category-specific Limits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelLimit">Travel Limit per Day (₹)</Label>
              <Input
    id="travelLimit"
    type="number"
    value={policies.travelLimitPerDay}
    onChange={(e) => setPolicies({ ...policies, travelLimitPerDay: parseInt(e.target.value) })}
  />
              <p className="text-xs text-gray-500">Maximum allowed travel expense per day</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repairLimit">Repair Max Limit (₹)</Label>
              <Input
    id="repairLimit"
    type="number"
    value={policies.repairMaxLimit}
    onChange={(e) => setPolicies({ ...policies, repairMaxLimit: parseInt(e.target.value) })}
  />
              <p className="text-xs text-gray-500">Maximum allowed repair expense</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="riskThreshold">Auto High-Risk Threshold (%)</Label>
            <Input
    id="riskThreshold"
    type="number"
    value={policies.autoHighRiskThreshold}
    onChange={(e) => setPolicies({ ...policies, autoHighRiskThreshold: parseInt(e.target.value) })}
    className="max-w-xs"
  />
            <p className="text-xs text-gray-500">
              Bills with risk score above this value are automatically flagged as high-risk
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>;
}
export {
  ApprovalPolicy as default
};
