import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Plus, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user/all');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/user/update-role/${userId}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      await api.put(`/user/update-status/${userId}`, { isActive });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/user/delete/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await api.post('/user/create', { name, email, password, role });
      setShowAddForm(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('viewer');
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-sm font-medium">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight">Users</h1>
        {isAdmin && !showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2">
             <Plus className="w-4 h-4" strokeWidth={2} />
             Add User
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">New User</h2>
            <button onClick={() => setShowAddForm(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
          {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 text-sm">{formError}</div>}
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field" required>
                <option value="viewer">Viewer</option>
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving...' : 'Save User'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="table-base">
            <thead>
              <tr>
                <th className="table-th">Name</th>
                <th className="table-th">Email</th>
                <th className="table-th">Role</th>
                <th className="table-th">Status</th>
                <th className="table-th">Joined</th>
                {isAdmin && <th className="table-th text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-main)] bg-white">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="table-td font-medium">{u.name}</td>
                  <td className="table-td text-[var(--color-text-muted)]">{u.email}</td>
                  <td className="table-td">
                    {isAdmin && u._id !== currentUser._id ? (
                      <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="border border-[var(--color-border-main)] text-sm px-2 py-1 bg-white focus:outline-none focus:border-[var(--color-primary)]"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="text-sm text-[var(--color-text-main)] capitalize">{u.role}</span>
                    )}
                  </td>
                  <td className="table-td">
                    {isAdmin && u._id !== currentUser._id ? (
                      <button 
                        onClick={() => handleStatusChange(u._id, !u.isActive)}
                        className={`px-2 py-1 text-xs font-medium border rounded ${u.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </button>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${u.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="table-td text-[var(--color-text-muted)]">
                    {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                  </td>
                  {isAdmin && (
                    <td className="table-td text-right">
                      {u._id !== currentUser._id && (
                        <button 
                          onClick={() => handleDelete(u._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="table-td text-center text-[var(--color-text-muted)]">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
