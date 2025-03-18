import React from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Link,
  Avatar
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle successful registration
  const handleRegistrationSuccess = () => {
    // Redirect to login page after successful registration
    setTimeout(() => {
      navigate('/login');
    }, 3000); // Redirect after 3 seconds to allow user to read success message
  };

  return (
    <Container component="main" maxWidth="sm">
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
            Create an Account
          </Typography>
          
          <RegisterForm onSuccess={handleRegistrationSuccess} />
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          By registering, you agree to our{' '}
          <Link component={RouterLink} to="/terms" variant="body2">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link component={RouterLink} to="/privacy" variant="body2">
            Privacy Policy
          </Link>
        </Typography>
      </Box>
      
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Didn't receive verification email?{' '}
          <Link component={RouterLink} to="/verify-email" variant="body2">
            Resend verification
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
