import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';

interface LoginScreenProps {
  onBack?: () => void;
  onLogin: (phone: string) => void;
}

export function LoginScreen({ onBack, onLogin }: LoginScreenProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete OTP');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(phone);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-default)] flex flex-col relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-72 h-72 rounded-full opacity-30 blur-3xl"
          style={{ background: 'var(--gradient-primary)' }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{ top: '-10%', left: '-10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--gradient-accent)' }}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{ bottom: '-20%', right: '-15%' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-25 blur-3xl"
          style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)' }}
          animate={{
            x: [0, -60, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          initial={{ top: '40%', right: '10%' }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="p-4 flex items-center gap-3 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {onBack && (
          <motion.button
            onClick={onBack}
            className="w-10 h-10 rounded-lg bg-[var(--bg-paper)] flex items-center justify-center hover:bg-[var(--surface)] transition-all hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-primary)]" />
          </motion.button>
        )}
        <h1 className="font-bold text-xl text-[var(--text-primary)]">
          {step === 'phone' ? 'Login' : 'Verify OTP'}
        </h1>
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8 relative z-10">
        {step === 'phone' ? (
          <motion.div
            className="space-y-6 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-bold text-2xl bg-gradient-primary bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-6 h-6 text-[var(--primary)]" />
                </motion.div>
              </div>
              <p className="text-[var(--text-secondary)]">
                Enter your phone number to continue
              </p>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  className="h-12 transition-all focus:ring-2 focus:ring-[var(--primary)] focus:scale-[1.02]"
                />
              </div>
              {error && (
                <motion.p
                  className="text-sm text-[var(--error)]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-primary text-white border-0 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p className="text-sm text-[var(--text-secondary)]">
                Don't have an account?{' '}
                <button className="text-[var(--primary)] font-medium hover:underline transition-all hover:text-[var(--primary-hover)]">
                  Sign up
                </button>
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h2 className="font-bold text-2xl bg-gradient-accent bg-clip-text text-transparent mb-2">
                Enter OTP
              </h2>
              <p className="text-[var(--text-secondary)]">
                We sent a code to {phone}
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setError('');
                  }}
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                      >
                        <InputOTPSlot index={index} className="transition-all focus:ring-2 focus:ring-[var(--accent)] focus:scale-110" />
                      </motion.div>
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && (
                <motion.p
                  className="text-sm text-[var(--error)] text-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12 bg-gradient-accent text-white border-0 relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button 
                onClick={() => setStep('phone')}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              >
                Change phone number
              </button>
              <span className="mx-2 text-[var(--text-secondary)]">•</span>
              <button className="text-sm text-[var(--primary)] font-medium hover:underline transition-all hover:text-[var(--primary-hover)]">
                Resend OTP
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
