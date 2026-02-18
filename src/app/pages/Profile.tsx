import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, Shield, Edit } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-8">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl">
                {user?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-bold">{user?.name}</h3>
              <Badge className="mt-2 capitalize">{user?.role}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <Input value={user?.name} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <Input value={user?.email} readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <Input value={user?.role} readOnly className="capitalize" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input value={user?.id} readOnly />
              </div>
            </div>

            <div className="pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Change Password</Label>
            <Button variant="outline" className="mt-2">
              Update Password
            </Button>
          </div>
          <div>
            <Label>Two-Factor Authentication</Label>
            <Button variant="outline" className="mt-2">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
