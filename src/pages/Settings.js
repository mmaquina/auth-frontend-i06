import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Divider,
  Button,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChangePasswordForm from '../components/forms/ChangePasswordForm';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Tab accessibility props
function a11yProps(index) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings = () => {
  const { currentUser, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [logoutSuccess, setLogoutSuccess] = useState('');
  const [logoutError, setLogoutError] = useState('');

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle password change success
  const handlePasswordChangeSuccess = () => {
    // You could add additional actions here if needed
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setLogoutSuccess('Logged out successfully. Redirecting...');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.error('Logout error:', err);
      setLogoutError('Failed to log out. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            component={RouterLink}
            to="/profile"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back to Profile
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Account Settings
          </Typography>
          
          {/* Success message */}
          {logoutSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {logoutSuccess}
            </Alert>
          )}
          
          {/* Error message */}
          {logoutError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {logoutError}
            </Alert>
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Security" {...a11yProps(0)} />
            <Tab label="Account" {...a11yProps(1)} />
            <Tab label="Notifications" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        {/* Security Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Security Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <ChangePasswordForm onSuccess={handlePasswordChangeSuccess} />
        </TabPanel>
        
        {/* Account Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Account Email
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {currentUser?.email || 'Not available'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your email address is used for login and notifications.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom color="error">
              Danger Zone
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleLogout}
            >
              Log Out of All Devices
            </Button>
          </Box>
        </TabPanel>
        
        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Notification Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body1" color="text.secondary">
            Notification settings will be available in a future update.
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Settings;