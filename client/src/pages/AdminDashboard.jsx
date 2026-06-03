import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminService } from '../services';
import {
  Users, MessageSquare, Activity, Award, Trash2, Shield,
  Download, Search, ChevronRight, TrendingUp, ToggleLeft, ToggleRight,
  BarChart3, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminStatCard = ({ icon: Icon, title, value, color, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="stat-card"
  >
    <div style={{ width: 48, height: 48, borderRadius: 12, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
      <Icon size={24} style={{ color }} />
    </div>
    <p style={{ color: '#64748B', fontSize: 13, marginBottom: 4 }}>{title}</p>
    <p style={{ color: '#F8FAFC', fontSize: 32, fontWeight: 900, fontFamily: 'Outfit, sans-serif', margin: 0 }}>{value}</p>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#1E293B', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: '#94A3B8', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#7C3AED', fontWeight: 600, margin: 0 }}>Users: {payload[0]?.value}</p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPagination, setUserPagination] = useState({});

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchInterviews();
  }, []);

  useEffect(() => {
    fetchUsers(userPage);
  }, [userPage]);

  const fetchStats = async () => {
    try {
      const res = await adminService.getStats();
      setStats(res.data.stats);
    } catch { toast.error('Failed to load stats'); }
    finally { setLoading(false); }
  };

  const fetchUsers = async (page = 1) => {
    setUsersLoading(true);
    try {
      const res = await adminService.getAllUsers({ page, limit: 15, search });
      setUsers(res.data.users || []);
      setUserPagination(res.data.pagination || {});
    } catch {} finally { setUsersLoading(false); }
  };

  const fetchInterviews = async () => {
    try {
      const res = await adminService.getAllInterviews({ page: 1, limit: 20 });
      setInterviews(res.data.interviews || []);
    } catch {}
  };

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}"? All their data will be permanently deleted.`)) return;
    try {
      await adminService.deleteUser(id);
      toast.success(`User ${name} deleted`);
      fetchUsers(userPage);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleUser = async (id) => {
    try {
      const res = await adminService.toggleUser(id);
      toast.success(res.data.message);
      fetchUsers(userPage);
    } catch {
      toast.error('Failed to toggle user status');
    }
  };

  const handleExport = async () => {
    try {
      const res = await adminService.exportUsers();
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'interviewace-users.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Users exported to CSV');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setUserPage(1);
    fetchUsers(1);
  };

  const getScoreColor = (s) => s >= 70 ? '#10B981' : s >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div>
      {/* Admin Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Shield size={24} style={{ color: '#F59E0B' }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
        </div>
        <p style={{ color: '#64748B' }}>Platform-wide analytics and user management</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          <AdminStatCard icon={Users} title="Total Students" value={stats?.totalUsers || 0} color="#7C3AED" gradient="rgba(124,58,237,0.15)" delay={0.05} />
          <AdminStatCard icon={MessageSquare} title="Total Interviews" value={stats?.totalInterviews || 0} color="#06B6D4" gradient="rgba(6,182,212,0.15)" delay={0.1} />
          <AdminStatCard icon={Activity} title="Active (7 days)" value={stats?.activeUsers || 0} color="#10B981" gradient="rgba(16,185,129,0.15)" delay={0.15} />
          <AdminStatCard icon={Award} title="Avg Score" value={`${stats?.averageScore || 0}%`} color="#F59E0B" gradient="rgba(245,158,11,0.15)" delay={0.2} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(99,102,241,0.1)', marginBottom: 24 }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: `Users (${userPagination.total || 0})` },
          { id: 'interviews', label: `Interviews (${interviews.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? '#7C3AED' : 'transparent'}`, color: activeTab === tab.id ? '#A5B4FC' : '#64748B', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {/* Weekly User Growth */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-static" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>User Growth</h3>
            <p style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>New user registrations per week</p>
            {stats?.weeklyUsers ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.weeklyUsers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                  <XAxis dataKey="week" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="users" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#475569' }}>No data yet</p></div>}
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-static" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 20 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => setActiveTab('users')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 10, cursor: 'pointer', color: '#E2E8F0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500 }}>
                  <Users size={16} style={{ color: '#7C3AED' }} /> Manage Users
                </span>
                <ChevronRight size={14} style={{ color: '#475569' }} />
              </button>
              <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 10, cursor: 'pointer', color: '#E2E8F0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500 }}>
                  <Download size={16} style={{ color: '#06B6D4' }} /> Export Users CSV
                </span>
                <ChevronRight size={14} style={{ color: '#475569' }} />
              </button>
              <button onClick={() => { fetchStats(); fetchUsers(); fetchInterviews(); toast.success('Data refreshed'); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 10, cursor: 'pointer', color: '#E2E8F0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500 }}>
                  <RefreshCw size={16} style={{ color: '#10B981' }} /> Refresh Data
                </span>
                <ChevronRight size={14} style={{ color: '#475569' }} />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 8, minWidth: 250 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                <input
                  className="input-field"
                  style={{ paddingLeft: 42, height: 42 }}
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0 20px', height: 42 }}>Search</button>
            </form>
            <button onClick={handleExport} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', height: 42 }}>
              <Download size={16} /> Export CSV
            </button>
          </div>

          {usersLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <LoadingSpinner size="lg" text="Loading users..." />
            </div>
          ) : (
            <div className="glass-card-static" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Joined</th>
                      <th>Interviews</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                              {u.profilePicture ? (
                                <img src={u.profilePicture} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{u.name?.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div>
                              <p style={{ color: '#E2E8F0', fontWeight: 600, fontSize: 13, margin: 0 }}>{u.name}</p>
                              <p style={{ color: '#64748B', fontSize: 12, margin: 0 }}>{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#64748B', fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ color: '#94A3B8', fontWeight: 600 }}>{u.interviewCount || 0}</td>
                        <td>
                          <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ color: '#64748B', fontSize: 13 }}>
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => handleToggleUser(u._id)}
                              title={u.isActive ? 'Deactivate' : 'Activate'}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}
                            >
                              {u.isActive ? <ToggleRight size={18} style={{ color: '#10B981' }} /> : <ToggleLeft size={18} />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B', transition: 'color 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {userPagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '16px', borderTop: '1px solid rgba(99,102,241,0.08)' }}>
                  <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage <= 1} className="btn-ghost" style={{ padding: '6px 14px' }}>Previous</button>
                  <span style={{ padding: '6px 14px', color: '#94A3B8', fontSize: 14 }}>Page {userPage} of {userPagination.pages}</span>
                  <button onClick={() => setUserPage(p => Math.min(userPagination.pages, p + 1))} disabled={userPage >= userPagination.pages} className="btn-ghost" style={{ padding: '6px 14px' }}>Next</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Interviews Tab */}
      {activeTab === 'interviews' && (
        <div className="glass-card-static" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map(iv => (
                  <tr key={iv._id}>
                    <td style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 500 }}>
                      {iv.userId?.name || 'Unknown'}<br />
                      <span style={{ color: '#64748B', fontSize: 11 }}>{iv.userId?.email}</span>
                    </td>
                    <td><span className="badge badge-purple">{iv.type?.replace(/-/g, ' ')}</span></td>
                    <td style={{ color: '#94A3B8', textTransform: 'capitalize', fontSize: 13 }}>{iv.difficulty}</td>
                    <td style={{ color: getScoreColor(iv.overallScores?.overall || 0), fontWeight: 700 }}>{iv.overallScores?.overall || 0}%</td>
                    <td><span className={`badge ${iv.status === 'completed' ? 'badge-green' : 'badge-yellow'}`}>{iv.status}</span></td>
                    <td style={{ color: '#64748B', fontSize: 13 }}>{new Date(iv.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
