import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to home page
    if (!loading && user) {
      navigate('/device-farm/#/');
    }
  }, [navigate, user, loading]);

  // Show nothing while loading
  if (loading) {
    return null;
  }

  return <LoginForm />;
};

export default Login;
