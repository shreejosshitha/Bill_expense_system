import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Building2, Eye, EyeOff, Shield, Zap, Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password, role);
    navigate("/dashboard");
    setTimeout(() => setIsLoading(false), 1e3);
  };
  const features = [
    { icon: Zap, title: "Instant Processing", desc: "AI analyzes bills in seconds" },
    { icon: Shield, title: "Bank-Grade Security", desc: "256-bit encryption" },
    { icon: Clock, title: "99.9% Uptime", desc: "Always available" }
  ];
  const benefits = [
    "Automated approval workflow",
    "Real-time fraud detection",
    "Multi-role access control",
    "Detailed analytics dashboard",
    "GST-compliant invoicing",
    "Mobile-friendly interface"
  ];
  return <div className="min-h-screen flex bg-slate-900 overflow-hidden">
      {
    /* Animated Background */
  }
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950" />
        
        {
    /* Animated orbs */
  }
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        
        {
    /* Grid pattern */
  }
        <div className="absolute inset-0 opacity-20" style={{
    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: "60px 60px"
  }} />
        
        {
    /* Floating shapes */
  }
        <div className="absolute top-20 right-20 w-20 h-20 border border-blue-500/20 rounded-lg rotate-12 animate-float" />
        <div className="absolute bottom-32 left-32 w-16 h-16 border border-indigo-500/20 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg rotate-45 animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {
    /* Left Side - Branding */
  }
      <div className="hidden lg:flex lg:w-[55%] relative z-10 p-12 xl:p-16">
        <div className="flex flex-col justify-between w-full">
          {
    /* Logo */
  }
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3.5 rounded-xl shadow-lg shadow-blue-500/30">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">SmartExpense</span>
              <p className="text-xs text-blue-400 -mt-1">AI-Powered</p>
            </div>
          </div>

          {
    /* Main Content */
  }
          <div className="my-auto">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Next-Gen Expense Management</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
              Intelligent<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Bill Processing
              </span>
            </h1>

            <p className="text-slate-400 text-lg mb-8 max-w-lg leading-relaxed">
              Transform your expense workflow with AI-powered approvals, intelligent routing, and automated data extraction.
            </p>

            {
    /* Benefits list */
  }
            <div className="grid grid-cols-2 gap-3 mb-10">
              {benefits.map((benefit, index) => <div key={index} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>)}
            </div>

            {
    /* Features */
  }
            <div className="flex gap-4">
              {features.map((feature, index) => <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex-1 hover:bg-white/10 transition-all duration-300 group">
                  <feature.icon className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white font-semibold text-sm">{feature.title}</p>
                  <p className="text-slate-400 text-xs">{feature.desc}</p>
                </div>)}
            </div>
          </div>

          {
    /* Footer */
  }
          <div className="flex items-center justify-between text-slate-500 text-sm">
            <p>© 2024 SmartExpense Inc.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>

      {
    /* Right Side - Login Form */
  }
      <div className="w-full lg:w-[45%] relative z-10 flex items-center justify-center p-6 lg:p-12">
        {
    /* Gradient overlay at edges */
  }
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900/50 to-slate-900 lg:hidden" />

        <Card className="w-full max-w-md relative bg-white/10 backdrop-blur-xl border-white/10 shadow-2xl">
          {
    /* Card glow effect */
  }
          <div className="absolute -inset-px bg-gradient-to-br from-white/10 to-transparent rounded-2xl -z-10" />
          
          <CardHeader className="space-y-1 pb-4">
            {
    /* Mobile logo */
  }
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SmartExpense</span>
            </div>
            
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Sign in to continue to your dashboard
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {
    /* Email */
  }
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email Address</Label>
                <Input
    id="email"
    type="email"
    placeholder="name@company.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 focus:bg-white/10"
    required
  />
              </div>

              {
    /* Password */
  }
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
    id="password"
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="h-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 focus:bg-white/10"
    required
  />
                  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {
    /* Role */
  }
              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-300 text-sm font-medium">Access Level</Label>
                <Select value={role} onValueChange={(value) => setRole(value)}>
                  <SelectTrigger id="role" className="h-12 bg-white/5 border-white/10 text-white focus:border-blue-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    <SelectItem value="employee" className="text-white focus:bg-white/10">Employee</SelectItem>
                    <SelectItem value="accounts" className="text-white focus:bg-white/10">Accounts Team</SelectItem>
                    <SelectItem value="manager" className="text-white focus:bg-white/10">Manager</SelectItem>
                    <SelectItem value="admin" className="text-white focus:bg-white/10">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {
    /* Remember me */
  }
              <div className="flex items-center">
                <input
    type="checkbox"
    id="remember"
    className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
  />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-400">
                  Keep me signed in
                </label>
              </div>

              <Button
    type="submit"
    className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 group"
    disabled={isLoading}
  >
                {isLoading ? <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div> : <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>}
              </Button>
            </form>

            {
    /* Demo credentials */
  }
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-sm text-blue-300 font-medium mb-1">🚀 Demo Mode</p>
              <p className="text-xs text-slate-400">Enter any credentials to explore. Select a role to see different dashboards.</p>
            </div>

            {
    /* Social login divider */
  }
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-slate-500">or continue with</span>
              </div>
            </div>

            {
    /* Social buttons */
  }
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="flex-1 h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            {
    /* Sign up link */
  }
            <p className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create one
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>;
}
export {
  Login as default
};
