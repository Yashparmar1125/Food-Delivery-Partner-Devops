import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Shield, AlertCircle, ArrowLeft, Lock } from 'lucide-react';

export default function BackofficeLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await login(username, password, '/backoffice/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid administrator or operations credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const fillAdmin = () => {
    setUsername('admin');
    setPassword('Admin@123');
  };

  const fillOps = () => {
    setUsername('ops_manager');
    setPassword('Ops@123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/30">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">PartnerOps Back-Office</h1>
          <p className="text-xs text-slate-400 mt-1">Fleet Operations & Verification Management System</p>
        </div>

        <Card className="border-slate-800 bg-slate-800/80 shadow-2xl backdrop-blur-sm text-slate-100">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Operator Sign In</span>
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Restricted to authorized fleet administrators and operations managers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-lg flex items-start gap-2.5 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-slate-200 text-xs font-semibold">Operator Username</Label>
                <Input
                  id="username"
                  placeholder="admin or ops_manager"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-200 text-xs font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm h-12 mt-2 rounded-xl shadow-md shadow-blue-600/30 active:scale-95"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Back-Office'}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-700/60 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={fillAdmin}
                  className="py-2.5 px-2 bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all active:scale-95 text-center"
                >
                  ⚡ Admin
                </button>
                <button
                  type="button"
                  onClick={fillOps}
                  className="py-2.5 px-2 bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all active:scale-95 text-center"
                >
                  ⚡ Ops Manager
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Are you a Delivery Partner? <strong>Switch to Rider App</strong></span>
          </Link>
        </div>
      </div>
    </div>
  );
}
