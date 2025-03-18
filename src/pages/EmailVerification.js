import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Avatar,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Link
} from '@mui/material';
import { MarkEmailRead, Email } from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import AuthService from '../services/auth';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [verificationComplete, setVerificationComplete] = useState(false);

  // Check for token in URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const verificationToken = queryParams.get('token');
    
    if (verificationToken) {
      verifyEmail(verificationToken);
    }
  }, [location]);

  // Verify email with token
  const verifyEmail = async (token) => {
    setVerifying(true);
    setError('');
    setSuccess('');
    
    try {
      await AuthService.verifyEmail(token);
      setSuccess('Your email has been successfully verified. You can now log in.');
      setVerificationComplete(true);
      
      // Redirect to login page after successful verification
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Email verification failed. The link may be expired or invalid.');
    } finally {
      setVerifying(false);
    }
  };

  // Validate email
  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Handle resend verification email
  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess('');
    
    // Validate email
    if (!validateEmail()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // This is a placeholder - the actual endpoint might be different
      // You may need to implement this endpoint in your backend
      await AuthService.requestEmailVerification(email);
      setSuccess('Verification email has been sent to your email address.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
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
            {verificationComplete ? <MarkEmailRead /> : <Email />}
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Email Verification
          </Typography>
          
          {/* Error and success messages */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}
          
          {/* Verification in progress */}
          {verifying && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="body1">
                Verifying your email address...
              </Typography>
            </Box>
          )}
          
          {/* Verification complete */}
          {verificationComplete && !verifying && (
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your email has been verified successfully. You will be redirected to the login page shortly.
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </Box>
          )}
          
          {/* No token provided - show resend form */}
          {!verifying && !verificationComplete && !location.search.includes('token') && (
            <>
              <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                If you haven't received a verification email or your link has expired, you can request a new verification link.
              </Typography>
              
              <Box component="form" onSubmit={handleResendVerification} noValidate sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  disabled={loading}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
              </Box>
            </>
          )}
          
          {/* Navigation links */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Already verified?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" variant="body2">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmailVerification;