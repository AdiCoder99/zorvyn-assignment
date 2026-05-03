import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [recent, setRecent] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, recentRes, categoryRes] = await Promise.all([
          api.get('/summary/overview'),
          api.get('/summary/recent-transactions'),
          api.get('/summary/category-wise')
        ]);
        setOverview(overviewRes.data);
        setRecent(recentRes.data);
        setCategoryData(categoryRes.data.filter(c => c.totalExpense > 0).map(c => ({ name: c._id, value: c.totalExpense })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-sm font-medium">Loading dashboard...</div>;

  const COLORS = ['#111827', '#4b5563', '#9ca3af', '#d1d5db', '#e5e7eb'];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-main)] tracking-tight">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Total Balance</span>
            <DollarSign className="w-5 h-5 text-[var(--color-text-muted)]" strokeWidth={1.5} />
          </div>
          <span className="text-3xl font-bold text-[var(--color-text-main)]">
            ${overview?.balance.toFixed(2)}
          </span>
        </div>
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Total Income</span>
            <ArrowUpRight className="w-5 h-5 text-green-600" strokeWidth={1.5} />
          </div>
          <span className="text-3xl font-bold text-green-700">
            ${overview?.totalIncome.toFixed(2)}
          </span>
        </div>
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">Total Expense</span>
            <ArrowDownRight className="w-5 h-5 text-red-600" strokeWidth={1.5} />
          </div>
          <span className="text-3xl font-bold text-red-700">
            ${overview?.totalExpense.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Recent Transactions</h2>
          <div className="table-container">
            <table className="table-base">
              <thead>
                <tr>
                  <th className="table-th">Date</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">Type</th>
                  <th className="table-th text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-main)] bg-white">
                {recent.map((txn) => (
                  <tr key={txn._id}>
                    <td className="table-td">{format(new Date(txn.date), 'MMM dd, yyyy')}</td>
                    <td className="table-td font-medium">{txn.category}</td>
                    <td className="table-td">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${txn.type === 'income' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className={`table-td text-right font-medium ${txn.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                      {txn.type === 'income' ? '+' : '-'}${txn.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td colSpan="4" className="table-td text-center text-[var(--color-text-muted)]">No recent transactions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Expenses by Category</h2>
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '0', border: '1px solid #e5e7eb', boxShadow: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-[var(--color-text-muted)]">No data available</div>
            )}
            <div className="mt-4 space-y-2">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[var(--color-text-main)]">{entry.name}</span>
                  </div>
                  <span className="font-medium">${entry.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
