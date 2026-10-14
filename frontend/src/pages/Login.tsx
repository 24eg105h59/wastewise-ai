import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, UtensilsCrossed, Sparkles, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Flame } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/staff/home', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
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
      
      {/* Left Column: Cinematic Culinary Hero Showcase */}
      <div className="relative lg:w-7/12 min-h-[420px] lg:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Background Image with Dark Vignette & Amber Glow */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/chef_hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,119,6,0.25),transparent_50%)]" />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-600/30 ring-1 ring-amber-400/40">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">WasteWise</span>
                <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">Chef OS</span>
              </div>
              <p className="text-xs text-amber-200/70 font-medium">Artisanal Kitchen & Waste Intelligence</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Kitchen Station Online
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            Zero-Waste Culinary Operations
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            From Prep Station to the Pass, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">Zero Waste.</span>
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Elevate your kitchen brigade with automated FEFO rotation, vision AI ingredient auditing, and real-time culinary yield tracking.
          </p>

          {/* Feature Highlights Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-amber-500/40 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ChefHat className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Executive Command</h3>
              <p className="text-xs text-slate-400 mt-1">Live walk-in coolers, FEFO alerts & HACCP food safety tracking.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-amber-500/40 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Vision AI Sous Chef</h3>
              <p className="text-xs text-slate-400 mt-1">Instant ingredient recognition & shelf-life estimation.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-amber-500/40 transition-all group">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Waste & Yield Ledger</h3>
              <p className="text-xs text-slate-400 mt-1">Log trimmings vs spoilage to protect culinary margins.</p>
            </div>
          </div>
        </div>

        {/* Bottom Quote Banner */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
          <UtensilsCrossed className="w-4 h-4 text-amber-400 shrink-0" />
          <span>&ldquo;A master chef's discipline is measured by what never reaches the waste bin.&rdquo;</span>
        </div>
      </div>

      {/* Right Column: Culinary Login Portal */}
      <div className="lg:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-900 border-l border-slate-800 relative z-20">
        <div className="w-full max-w-md space-y-7">
          
          {/* Header */}
          <div className="text-center sm:text-left">
            <div className="inline-flex lg:hidden mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ChefHat className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Log In
            </h2>
            <p className="text-sm text-slate-400 mt-1.5">
              Welcome back! Please enter your details to sign in.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-950/50 border border-red-500/50 text-red-300 p-3.5 rounded-xl text-sm flex items-start gap-2.5">
                <span className="text-red-400 mt-0.5 font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition-all shadow-inner"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-sm transition-all shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-amber-400 hover:text-amber-300 hover:underline">
                Register here
              </Link>
            </div>
          </form>

          {/* Footer Status */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>WasteWise Official Portal</span>
            <span>Food & Inventory Management</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
