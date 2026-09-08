import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Bike, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export default function PartnerLoginPage() {
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
      await login(username, password, '/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid rider credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoRider = () => {
    setUsername('rider_rajesh');
    setPassword('Partner@123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md">
            <Bike className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Delivery Partner App</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to start your delivery shift</p>
        </div>

        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>Rider Sign In</CardTitle>
            <CardDescription>Enter your partner credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="e.g. rider_rajesh"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 mt-2"
              >
                {isLoading ? 'Signing In...' : 'Sign In as Delivery Partner'}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={fillDemoRider}
                className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors text-center"
              >
                Quick Demo: Fill Active Rider Credentials (rider_rajesh)
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  New rider?{' '}
                  <Link to="/onboard" className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-0.5">
                    Apply to Deliver <ArrowRight className="w-3 h-3" />
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back-Office Access Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/backoffice/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Fleet Operations Staff? <strong>Sign In Here</strong></span>
          </Link>
        </div>
      </div>
    </div>
  );
}
