import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InputWithIcon from '@/components/InputWithIcon';
import { loginUser } from '../services/Login';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);

      // simpan token dan data user di localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }; 

  return (
    <Card className="w-full max-w-md bg-[#161B2C] border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">Login LMS</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Learning Management System
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="bg-red-900/50 border-red-800">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithIcon
            label="Email"
            placeholder="Masukkan email kamu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            isEmail
          />

          <InputWithIcon
            label="Password"
            placeholder="Masukkan password kamu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isPassword
            leftIcon={<Lock size={18} />}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-[#3B82F6] hover:bg-blue-900" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
        
        <div className="flex flex-row item-center justify-center text-blue-400">
            <p>Belum punya akun? {" "}</p>
            <a
              onClick={onSwitchToRegister}
              className="text-blue-400 hover:text-blue-600 hover:underline pl-1"
            >
              Daftar Akun
            </a>
        </div>
      </CardContent>
    </Card>
  );
};