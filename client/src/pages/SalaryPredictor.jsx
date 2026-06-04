import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, TrendingUp, MapPin, Briefcase, Zap, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const SALARY_DATA = {
  sde: { tier1: { fresher: [18, 35], '1yr': [22, 42], '2yr': [28, 55], '3-5yr': [40, 80], '5yr+': [60, 130] }, tier2: { fresher: [8, 18], '1yr': [12, 25], '2yr': [18, 35], '3-5yr': [28, 55], '5yr+': [40, 80] }, tier3: { fresher: [3.6, 8], '1yr': [5, 12], '2yr': [8, 18], '3-5yr': [15, 30], '5yr+': [25, 50] } },
  data: { tier1: { fresher: [15, 30], '1yr': [20, 38], '2yr': [25, 50], '3-5yr': [38, 75], '5yr+': [55, 120] }, tier2: { fresher: [7, 16], '1yr': [10, 22], '2yr': [15, 30], '3-5yr': [25, 50], '5yr+': [38, 75] }, tier3: { fresher: [3, 7], '1yr': [4.5, 10], '2yr': [7, 16], '3-5yr': [13, 28], '5yr+': [22, 45] } },
  ml: { tier1: { fresher: [16, 32], '1yr': [22, 45], '2yr': [30, 60], '3-5yr': [45, 90], '5yr+': [65, 140] }, tier2: { fresher: [8, 18], '1yr': [12, 25], '2yr': [18, 36], '3-5yr': [30, 60], '5yr+': [45, 90] }, tier3: { fresher: [4, 9], '1yr': [6, 13], '2yr': [9, 19], '3-5yr': [16, 32], '5yr+': [28, 55] } },
  frontend: { tier1: { fresher: [12, 24], '1yr': [16, 30], '2yr': [22, 42], '3-5yr': [32, 65], '5yr+': [50, 100] }, tier2: { fresher: [6, 14], '1yr': [9, 20], '2yr': [14, 28], '3-5yr': [22, 45], '5yr+': [35, 70] }, tier3: { fresher: [3, 7], '1yr': [4, 9], '2yr': [7, 15], '3-5yr': [12, 25], '5yr+': [20, 40] } },
  backend: { tier1: { fresher: [14, 28], '1yr': [18, 36], '2yr': [24, 48], '3-5yr': [36, 72], '5yr+': [55, 110] }, tier2: { fresher: [7, 16], '1yr': [10, 22], '2yr': [16, 32], '3-5yr': [25, 50], '5yr+': [40, 80] }, tier3: { fresher: [3.2, 7.5], '1yr': [5, 11], '2yr': [8, 17], '3-5yr': [14, 28], '5yr+': [24, 48] } },
};

const CITIES = [{ name: 'Bangalore', multi: 1.15 }, { name: 'Mumbai', multi: 1.1 }, { name: 'Hyderabad', multi: 1.05 }, { name: 'Pune', multi: 0.95 }, { name: 'Delhi NCR', multi: 1.08 }, { name: 'Remote', multi: 1.0 }];

const COMPANIES = { sde: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Razorpay'], data: ['Google', 'Amazon', 'Walmart', 'Meesho', 'PhonePe'], ml: ['Google DeepMind', 'Microsoft', 'Swiggy AI', 'Flipkart', 'Myntra'], frontend: ['Razorpay', 'Groww', 'Zepto', 'Urban Company', 'Dunzo'], backend: ['Swiggy', 'Zomato', 'CRED', 'Navi', 'Polygon'] };

const SalaryPredictor = () => {
  const [form, setForm] = useState({ role: 'sde', exp: 'fresher', tier: 'tier2', city: 'Bangalore', skills: [] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const base = SALARY_DATA[form.role]?.[form.tier]?.[form.exp] || [5, 12];
    const cityMult = CITIES.find(c => c.name === form.city)?.multi || 1;
    const min = Math.round(base[0] * cityMult * 10) / 10;
    const max = Math.round(base[1] * cityMult * 10) / 10;
    const avg = Math.round(((min + max) / 2) * 10) / 10;
    const demand = max > 40 ? 'High' : max > 20 ? 'Medium' : 'Medium';
    const growth = max > 40 ? '25-35%' : max > 20 ? '18-25%' : '12-18%';
    const companies = COMPANIES[form.role] || COMPANIES.sde;
    const cityData = CITIES.map(c => ({ name: c.name, salary: Math.round((min + max) / 2 * c.multi * 10) / 10 }));
    setResult({ min, max, avg, demand, growth, companies, cityData });
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 900, fontFamily: 'Outfit', letterSpacing: '-0.03em', marginBottom: 4 }}>
          <span className="gradient-text">AI Salary Predictor</span>
        </h1>
        <p style={{ color: '#64748B', fontSize: 13 }}>Predict your expected salary based on skills, experience, and location</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '380px 1fr' : '450px', gap: 20, justifyContent: result ? 'stretch' : 'center' }}>
        {/* Form */}
        <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 20, padding: 26 }}>
          <h3 style={{ color: '#F1F5F9', fontWeight: 700, fontFamily: 'Outfit', marginBottom: 20 }}>Your Profile</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              {[['sde', '💻 SDE/Backend'], ['frontend', '🌐 Frontend'], ['data', '📊 Data Scientist'], ['ml', '🤖 ML Engineer'], ['backend', '⚙️ Backend Dev']].map(([v, l]) => (
                <button key={v} onClick={() => setForm(f => ({ ...f, role: v }))} style={{ padding: '9px', borderRadius: 9, border: `1.5px solid ${form.role === v ? '#7C3AED' : 'rgba(99,102,241,0.15)'}`, background: form.role === v ? 'rgba(124,58,237,0.15)' : 'transparent', color: form.role === v ? '#C4B5FD' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Experience</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {[['fresher', 'Fresher'], ['1yr', '1 Year'], ['2yr', '2 Years'], ['3-5yr', '3-5 Years'], ['5yr+', '5+ Years']].map(([v, l]) => (
                <button key={v} onClick={() => setForm(f => ({ ...f, exp: v }))} style={{ padding: '7px 13px', borderRadius: 20, border: `1.5px solid ${form.exp === v ? '#06B6D4' : 'rgba(99,102,241,0.15)'}`, background: form.exp === v ? 'rgba(6,182,212,0.12)' : 'transparent', color: form.exp === v ? '#67E8F9' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>College Tier</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
              {[['tier1', 'IIT/NIT'], ['tier2', 'Tier 2'], ['tier3', 'Tier 3']].map(([v, l]) => (
                <button key={v} onClick={() => setForm(f => ({ ...f, tier: v }))} style={{ padding: '8px', borderRadius: 9, border: `1.5px solid ${form.tier === v ? '#10B981' : 'rgba(99,102,241,0.15)'}`, background: form.tier === v ? 'rgba(16,185,129,0.12)' : 'transparent', color: form.tier === v ? '#6EE7B7' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#94A3B8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>City</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {CITIES.map(c => (
                <button key={c.name} onClick={() => setForm(f => ({ ...f, city: c.name }))} style={{ padding: '7px 13px', borderRadius: 20, border: `1.5px solid ${form.city === c.name ? '#F59E0B' : 'rgba(99,102,241,0.15)'}`, background: form.city === c.name ? 'rgba(245,158,11,0.12)' : 'transparent', color: form.city === c.name ? '#FCD34D' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>📍 {c.name}</button>
              ))}
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={predict} disabled={loading}
            className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}><Zap size={16} /></motion.div> Predicting...</> : <><IndianRupee size={16} /> Predict Salary</>}
          </motion.button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Main salary range */}
              <div style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(6,182,212,0.06))', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <p style={{ color: '#64748B', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Expected Salary Range ({form.city})</p>
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                  style={{ fontSize: 44, fontWeight: 900, color: '#10B981', fontFamily: 'Outfit', letterSpacing: '-0.03em' }}>
                  ₹{result.min} – ₹{result.max} <span style={{ fontSize: 18 }}>LPA</span>
                </motion.div>
                <p style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>Average: <strong style={{ color: '#6EE7B7' }}>₹{result.avg} LPA</strong></p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14 }}>
                  <span style={{ padding: '6px 14px', borderRadius: 20, background: result.demand === 'High' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', border: `1px solid ${result.demand === 'High' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, color: result.demand === 'High' ? '#10B981' : '#F59E0B', fontSize: 13, fontWeight: 700 }}>📈 Demand: {result.demand}</span>
                  <span style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#A78BFA', fontSize: 13, fontWeight: 700 }}>🚀 Growth: {result.growth}/yr</span>
                </div>
              </div>

              {/* Top companies + City chart */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 18 }}>
                  <p style={{ color: '#A78BFA', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>🏢 Top Paying Companies</p>
                  {result.companies.map((c, i) => (
                    <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '8px 10px', background: 'rgba(99,102,241,0.05)', borderRadius: 8 }}>
                      <span style={{ color: '#F1F5F9', fontSize: 13, fontWeight: 600 }}>#{i + 1} {c}</span>
                      <span style={{ color: '#10B981', fontSize: 12, fontWeight: 700 }}>₹{Math.round(result.avg * (1.1 - i * 0.05) * 10) / 10} LPA</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 18 }}>
                  <p style={{ color: '#67E8F9', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📍 Salary by City</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={result.cityData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 9 }} />
                      <YAxis tick={{ fill: '#475569', fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: '#0D1627', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#E2E8F0', fontSize: 11 }} formatter={v => [`₹${v} LPA`]} />
                      <Bar dataKey="salary" radius={4}>
                        {result.cityData.map((_, i) => <Cell key={i} fill={CITIES[i]?.name === form.city ? '#10B981' : '#7C3AED'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tips */}
              <div style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 16, padding: 18 }}>
                <p style={{ color: '#FCD34D', fontSize: 13, fontWeight: 700, marginBottom: 10 }}>💡 Tips to Increase Your Salary</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['Add system design to your skillset', 'Get AWS/GCP certified (+15-20% salary)', 'Contribute to open source projects', 'Switch companies every 2-3 years for 30-40% hike', 'Learn cloud + DevOps for a ₹5-10 LPA boost'].map(tip => (
                    <div key={tip} style={{ display: 'flex', gap: 7, padding: '9px 10px', background: 'rgba(245,158,11,0.05)', borderRadius: 9, border: '1px solid rgba(245,158,11,0.1)' }}>
                      <TrendingUp size={13} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
                      <span style={{ color: '#94A3B8', fontSize: 12 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default SalaryPredictor;
