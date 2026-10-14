import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Utensils, Mail, Lock, User, Building, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: 'HD Bakers & Kitchen',
    businessType: 'Bakery & Restaurant',
    role: 'STAFF'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      login(data.token, data.user);
      
      if (data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/staff/home');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Left Column: Visual Banner */}
      <div className="relative lg:w-5/12 min-h-[300px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/chef_hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,119,6,0.3),transparent_50%)]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-600/30 ring-1 ring-amber-400/40">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">WasteWise</span>
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">Brigade</span>
            </div>
            <p className="text-xs text-amber-200/70 font-medium">Culinary Onboarding</p>
          </div>
        </div>

        <div className="relative z-10 my-auto py-8">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Enlist in the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Culinary Brigade.
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Join the smart kitchen management platform designed to cut waste, monitor walk-ins, and elevate culinary standards.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          HD Bakers • Food Safety Protocol Compliant
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="lg:w-7/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-900 border-l border-slate-800">
        <div className="w-full max-w-lg space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create Culinary Profile</h2>
            <p className="text-xs text-slate-400 mt-1">Set up your kitchen station credentials</p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-950/50 border border-red-500/50 text-red-300 p-3 rounded-xl text-sm flex items-start gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name / Chef Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm"
                    placeholder="Chef Marco Pierre"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm"
                    placeholder="marco@kitchen.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Passcode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Kitchen / Establishment
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="businessName"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm"
                    placeholder="HD Bakers Main Kitchen"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Culinary Brigade Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'STAFF' })}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    formData.role === 'STAFF'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Utensils className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Sous Chef / Staff</div>
                    <div className="text-[11px] text-slate-400">Pantry & Prep Station</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    formData.role === 'ADMIN'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ChefHat className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Head Chef / Admin</div>
                    <div className="text-[11px] text-slate-400">Full Kitchen Command</div>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? 'Creating Profile...' : 'Enlist Station Profile'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-slate-400 pt-2">
              Already have a kitchen station?{' '}
              <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300">
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Register;
