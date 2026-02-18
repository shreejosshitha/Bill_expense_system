import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Activity, Search } from 'lucide-react';
import { useState } from 'react';

// Mock system logs data
const mockLogs = [
  { id: 1, user: 'Sarah Smith', action: 'Approved Bill BILL001', date: '2026-02-17 10:30:45', ip: '192.168.1.10' },
  { id: 2, user: 'Admin User', action: 'Updated approval policy', date: '2026-02-17 09:15:22', ip: '192.168.1.1' },
  { id: 3, user: 'Mike Johnson', action: 'Rejected Bill BILL004', date: '2026-02-16 16:45:33', ip: '192.168.1.15' },
  { id: 4, user: 'John Doe', action: 'Login attempt successful', date: '2026-02-16 14:20:11', ip: '192.168.1.25' },
  { id: 5, user: 'Sarah Smith', action: 'Approved Bill BILL002', date: '2026-02-16 11:30:18', ip: '192.168.1.10' },
  { id: 6, user: 'Admin User', action: 'Added new vendor: Tech Repairs Co', date: '2026-02-15 15:22:45', ip: '192.168.1.1' },
  { id: 7, user: 'Jane Smith', action: 'Submitted Bill BILL002', date: '2026-02-15 14:20:33', ip: '192.168.1.30' },
  { id: 8, user: 'Unknown', action: 'Login attempt failed', date: '2026-02-15 10:15:22', ip: '203.0.113.0' },
  { id: 9, user: 'Mike Johnson', action: 'Approved Bill BILL005', date: '2026-02-14 16:30:11', ip: '192.168.1.15' },
  { id: 10, user: 'Admin User', action: 'System backup completed', date: '2026-02-14 02:00:00', ip: '192.168.1.1' },
];

export default function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = mockLogs.filter(
    log =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm)
  );

  const getActionBadge = (action: string) => {
    if (action.includes('Approved')) {
      return 'bg-green-100 text-green-700';
    } else if (action.includes('Rejected')) {
      return 'bg-red-100 text-red-700';
    } else if (action.includes('failed')) {
      return 'bg-red-100 text-red-700';
    } else if (action.includes('Login') || action.includes('Submitted')) {
      return 'bg-blue-100 text-blue-700';
    } else {
      return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">System Activity Logs</h2>
          <p className="text-gray-500">Monitor all system activities and user actions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Logs</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="text-sm text-gray-600">{log.date}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>
                    <Badge className={getActionBadge(log.action)}>
                      {log.action.split(' ')[0]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No logs found
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
