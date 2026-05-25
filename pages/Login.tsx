/**
 * Login / Sign-Up Page
 * Enterprise auth surface with real account checks and password reset flow.
 */

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store';
import { cn } from '@/utils/cn';
import { toastSuccess } from '@/components/ui/toast';

const demoCreds = [
  { username: 'agent.smith', password: 'Aegis@123', role: 'Security Analyst — IT Security (L4)' },
  { username: 'sarah.chen', password: 'Sentinel#1', role: 'SOC Lead — IT Security (L5)' },
  { username: 'maria.martinez', password: 'Executive!5', role: 'CTO — Executive (L5)' },
  { username: 'alex.morgan', password: 'Builder@42', role: 'Developer — Engineering (L3)' },
];

export function Login() {
  const { signIn, signUp, resetPassword, isAuthenticated } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showReset, setShowReset] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Sign-up extras
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('IT Security');
  const [role, setRole] = useState('Security Analyst');

  // Reset flow
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetPasswordValue, setResetPasswordValue] = useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetError, setResetError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const clearMainError = () => setError('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    if (mode === 'signup' && !email.trim()) {
      setError('Email is required.');
      return;
    }

    try {
      if (mode === 'login') {
        signIn(username, password);
        toastSuccess({ title: 'Authentication Complete', description: 'Secure enterprise session established.' });
      } else {
        signUp({ username, email, password, department, role });
        toastSuccess({ title: 'Account Created', description: 'Enterprise account provisioned and authenticated.' });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'UNKNOWN_ERROR';

      if (message === 'ACCOUNT_NOT_FOUND') {
        setMode('signup');
        setError('No account found for that username/email. Please create an account to continue.');
        return;
      }
      if (message === 'INVALID_PASSWORD') {
        setError('Incorrect password. Use the correct password or reset it below.');
        return;
      }
      if (message === 'ACCOUNT_EXISTS') {
        setMode('login');
        setError('An account with that username or email already exists. Please sign in instead.');
        return;
      }

      setError('Authentication failed. Verify your details and retry.');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!resetIdentifier.trim()) {
      setResetError('Username or email is required.');
      return;
    }
    if (!resetEmail.trim()) {
      setResetError('Registered email is required.');
      return;
    }
    if (!resetPasswordValue.trim() || resetPasswordValue.length < 8) {
      setResetError('New password must be at least 8 characters long.');
      return;
    }
    if (resetPasswordValue !== resetPasswordConfirm) {
      setResetError('Password confirmation does not match.');
      return;
    }

    try {
      resetPassword({
        identifier: resetIdentifier,
        email: resetEmail,
        newPassword: resetPasswordValue,
      });

      setShowReset(false);
      setMode('login');
      setUsername(resetIdentifier);
      setPassword('');
      setResetIdentifier('');
      setResetEmail('');
      setResetPasswordValue('');
      setResetPasswordConfirm('');
      toastSuccess({ title: 'Password Reset Complete', description: 'Your account password has been updated. Please sign in with the new password.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'RESET_ERROR';
      if (message === 'RESET_ACCOUNT_NOT_FOUND') {
        setResetError('No matching account was found. Check username/email or create an account first.');
        return;
      }
      setResetError('Password reset failed. Please retry.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_85%_60%,rgba(168,85,247,0.1),transparent_25%)]" />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">AEGIS</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Autonomous Threat Intelligence</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showReset ? (
            <motion.div key="auth-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode('login'); clearMainError(); }}
                  className={cn('flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all', mode === 'login' ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' : 'border-slate-800 bg-slate-900/40 text-gray-400 hover:border-slate-700')}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode('signup'); clearMainError(); }}
                  className={cn('flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all', mode === 'signup' ? 'border-purple-500/40 bg-purple-500/10 text-purple-300' : 'border-slate-800 bg-slate-900/40 text-gray-400 hover:border-slate-700')}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300 font-mono">
                    {error}
                  </div>
                )}

                <Input
                  label="Username or Email"
                  placeholder="e.g. agent.smith or agent.smith@aegis-corp.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                {mode === 'signup' && (
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@enterprise.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                )}

                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'login' ? 'Enter account password' : 'Create a strong passphrase'}
                      className="w-full rounded-lg px-4 py-2.5 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 text-white placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-sm text-white"
                      >
                        <option value="IT Security">IT Security</option>
                        <option value="IT Infrastructure">IT Infrastructure</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1 block">Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-sm text-white"
                      >
                        <option value="Security Analyst">Security Analyst</option>
                        <option value="SOC Lead">SOC Lead</option>
                        <option value="System Admin">System Admin</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="CTO">CTO / Executive</option>
                        <option value="Analyst">Analyst</option>
                      </select>
                    </div>
                  </div>
                )}

                <Button
                  variant={mode === 'login' ? 'primary' : 'secondary'}
                  type="submit"
                  className="w-full"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {mode === 'login' ? 'Authenticate' : 'Create Enterprise Account'}
                </Button>
              </form>

              <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReset(true);
                    setResetError('');
                  }}
                  className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  Forgot password?
                </button>
                <span className="text-[10px] text-gray-600 font-mono">Only registered accounts can sign in.</span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-2 font-mono text-xs">
                <span className="text-gray-500 uppercase tracking-wider text-[10px]">Demo Accounts</span>
                {demoCreds.map((c) => (
                  <div key={c.username} className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-white font-bold block">{c.username}</span>
                      <span className="text-gray-500">{c.role}</span>
                    </div>
                    <span className="text-cyan-300 font-bold">{c.password}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="reset-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowReset(false)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </button>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">Reset Password</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Enter your registered username/email and email address to securely reset the account password.
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-5">
                {resetError && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300 font-mono">
                    {resetError}
                  </div>
                )}

                <Input
                  label="Username or Email"
                  placeholder="Registered username or email"
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  required
                />
                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="you@enterprise.net"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
                <Input
                  label="New Password"
                  type={showResetPassword ? 'text' : 'password'}
                  value={resetPasswordValue}
                  onChange={(e) => setResetPasswordValue(e.target.value)}
                  placeholder="Create a new password"
                  required
                />
                <Input
                  label="Confirm New Password"
                  type={showResetPassword ? 'text' : 'password'}
                  value={resetPasswordConfirm}
                  onChange={(e) => setResetPasswordConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  {showResetPassword ? 'Hide passwords' : 'Show passwords'}
                </button>

                <Button variant="primary" type="submit" className="w-full">
                  <KeyRound className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
