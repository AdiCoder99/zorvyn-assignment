import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Form State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transaction/all');
      setTransactions(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.put(`/transaction/delete/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await api.post('/transaction/add', {
        amount: Number(amount),
        type,
        category,
        date,
        note
      });
      setShowAddForm(false);
      setAmount('');
      setCategory('');
      setNote('');
      fetchTransactions();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-sm font-medium">Loading transactions...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight">Transactions</h1>
        {isAdmin && !showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" strokeWidth={2} />
            Add Transaction
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-text-main)]">New Transaction</h2>
            <button onClick={() => setShowAddForm(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
          {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 text-sm">{formError}</div>}
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Amount</label>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input-field" required>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" maxLength={50} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-text-main)] mb-1">Note (optional)</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} className="input-field" maxLength={200} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Saving...' : 'Save Transaction'}
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
                <th className="table-th">Date</th>
                <th className="table-th">Category</th>
                <th className="table-th">Type</th>
                <th className="table-th">Amount</th>
                <th className="table-th">Note</th>
                {isAdmin && <th className="table-th text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-main)] bg-white">
              {transactions.map((txn) => (
                <tr key={txn._id} className="hover:bg-gray-50">
                  <td className="table-td">{format(new Date(txn.date), 'MMM dd, yyyy')}</td>
                  <td className="table-td font-medium">{txn.category}</td>
                  <td className="table-td">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${txn.type === 'income' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className={`table-td font-medium ${txn.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                    {txn.type === 'income' ? '+' : '-'}${txn.amount.toFixed(2)}
                  </td>
                  <td className="table-td text-[var(--color-text-muted)] truncate max-w-xs">{txn.note || '-'}</td>
                  {isAdmin && (
                    <td className="table-td text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-[var(--color-text-muted)] hover:text-blue-600 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button onClick={() => handleDelete(txn._id)} className="p-1 text-[var(--color-text-muted)] hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="table-td text-center text-[var(--color-text-muted)]">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
