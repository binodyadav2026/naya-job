import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, Users, Briefcase } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/admin', icon: Home },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
];

export default function UserManagement() {
  const { user } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="user-management">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">User Management</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map((u) => (
                    <tr key={u.user_id} data-testid={`user-${u.user_id}`}>
                      <td className="px-6 py-4 font-medium text-[#0F172A]">{u.name}</td>
                      <td className="px-6 py-4 text-slate-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'recruiter'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {u.role !== 'admin' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(u.user_id)}
                            className="rounded-full"
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
