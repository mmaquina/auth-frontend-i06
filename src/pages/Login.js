import React from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Avatar
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  // Handle successful login
  const handleLoginSuccess = () => {
    // Redirect to the page user was trying to access or dashboard
    navigate(from);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlined />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Sign In
          </Typography>
          
          <LoginForm onSuccess={handleLoginSuccess} />
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;