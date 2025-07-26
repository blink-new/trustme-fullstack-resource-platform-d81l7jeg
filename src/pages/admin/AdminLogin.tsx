import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Shield, Lock, User, Sparkles, Zap, Star } from 'lucide-react'

const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
    // Check if already logged in
    const token = localStorage.getItem('adminToken')
    if (token) {
      navigate('/admin/dashboard')
    }
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminToken', 'demo-token')
        navigate('/admin/dashboard')
      } else {
        setError('Invalid credentials. Use admin/admin123')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const FloatingIcon = ({ icon: Icon, delay = 0, duration = 3 }: { icon: any, delay?: number, duration?: number }) => (
    <div 
      className={`absolute opacity-20 animate-pulse ${mounted ? 'animate-bounce' : ''}`}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      <Icon className="w-6 h-6 text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Icons */}
      <FloatingIcon icon={Shield} delay={0} />
      <FloatingIcon icon={Lock} delay={1} />
      <FloatingIcon icon={Sparkles} delay={2} />
      <FloatingIcon icon={Zap} delay={0.5} />
      <FloatingIcon icon={Star} delay={1.5} />

      <div className={`w-full max-w-md relative z-10 transform transition-all duration-1000 ${
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 transform transition-all duration-1000 ${
            mounted ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transform transition-all duration-1000 delay-300 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Admin Portal
          </h1>
          <p className={`text-muted-foreground mt-2 transform transition-all duration-1000 delay-500 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Secure access to Trustme dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className={`backdrop-blur-sm bg-card/80 border-2 shadow-2xl transform transition-all duration-1000 delay-700 ${
          mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
        }`}>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12 transition-all duration-300 focus:scale-105 focus:shadow-lg"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Access Dashboard
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground text-center mb-2">Demo Credentials:</p>
              <div className="text-sm font-mono text-center space-y-1">
                <div>Username: <span className="text-primary font-semibold">admin</span></div>
                <div>Password: <span className="text-primary font-semibold">admin123</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className={`text-center mt-8 transform transition-all duration-1000 delay-1000 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-primary">Trustme</span> Security
          </p>
        </div>
      </div>

      {/* Additional CSS for animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default AdminLogin