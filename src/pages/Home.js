import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  CardMedia,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import { 
  Security, 
  PersonAdd, 
  LockReset, 
  AccountCircle, 
  Settings as SettingsIcon,
  Email
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();
  const authenticated = isAuthenticated();

  // Feature cards data
  const features = [
    {
      title: 'Secure Authentication',
      description: 'Industry-standard security protocols to keep your data safe and secure.',
      icon: <Security fontSize="large" color="primary" />,
      link: authenticated ? '/dashboard' : '/login',
      buttonText: authenticated ? 'Dashboard' : 'Sign In'
    },
    {
      title: 'Easy Registration',
      description: 'Quick and simple registration process to get you started in no time.',
      icon: <PersonAdd fontSize="large" color="primary" />,
      link: authenticated ? '/profile' : '/register',
      buttonText: authenticated ? 'Profile' : 'Register'
    },
    {
      title: 'Password Management',
      description: 'Easily reset your password if you forget it or want to update it.',
      icon: <LockReset fontSize="large" color="primary" />,
      link: '/forgot-password',
      buttonText: 'Reset Password'
    },
    {
      title: 'Email Verification',
      description: 'Verify your email to ensure the security of your account.',
      icon: <Email fontSize="large" color="primary" />,
      link: '/verify-email',
      buttonText: 'Verify Email'
    },
    {
      title: 'User Profile',
      description: 'Manage your personal information and account details.',
      icon: <AccountCircle fontSize="large" color="primary" />,
      link: '/profile',
      buttonText: 'My Profile',
      protected: true
    },
    {
      title: 'Account Settings',
      description: 'Configure your account settings and preferences.',
      icon: <SettingsIcon fontSize="large" color="primary" />,
      link: '/settings',
      buttonText: 'Settings',
      protected: true
    }
  ];

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Auth System
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {authenticated ? (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={RouterLink} to="/profile">
                  Profile
                </Button>
                <Button color="inherit" component={RouterLink} to="/settings">
                  Settings
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Secure Authentication System
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            A comprehensive solution for user authentication, registration, and profile management.
            Built with security and ease of use in mind.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {authenticated ? (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/dashboard"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to="/login"
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/register"
                >
                  Create Account
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          gutterBottom
          color="textPrimary"
          sx={{ mb: 4 }}
        >
          Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            // Skip protected features if user is not authenticated
            (!feature.protected || authenticated) && (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                  elevation={3}
                >
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3" align="center">
                      {feature.title}
                    </Typography>
                    <Typography align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button 
                      size="medium" 
                      color="primary" 
                      variant="contained"
                      component={RouterLink}
                      to={feature.link}
                    >
                      {feature.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Paper 
        component="footer" 
        square 
        variant="outlined" 
        sx={{ 
          mt: 'auto',
          py: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Auth System. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Secure, reliable, and user-friendly authentication solution.
          </Typography>
        </Container>
      </Paper>
    </>
  );
};

export default Home;