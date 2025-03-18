import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Avatar, 
  Grid, 
  Divider, 
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { Person as PersonIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/user';
import UpdateProfileForm from '../components/forms/UpdateProfileForm';

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await UserService.getProfile();
        setUserData(data);
        setError('');
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle successful profile update
  const handleProfileUpdateSuccess = () => {
    setUpdateSuccess('Profile updated successfully!');
    
    // Refresh user data
    const refreshUserData = async () => {
      try {
        const data = await UserService.getProfile();
        setUserData(data);
      } catch (err) {
        console.error('Error refreshing user profile:', err);
      }
    };
    
    refreshUserData();
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setUpdateSuccess('');
    }, 3000);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: 'primary.main',
              mb: 2
            }}
          >
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            User Profile
          </Typography>
          
          {/* Success message */}
          {updateSuccess && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              {updateSuccess}
            </Alert>
          )}
          
          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* User Information Card */}
            <Grid item xs={12} md={5}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">
                      {userData?.full_name || 'Not provided'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {userData?.email || 'Not provided'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email Verified
                    </Typography>
                    <Typography variant="body1">
                      {userData?.is_active ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Account Created
                    </Typography>
                    <Typography variant="body1">
                      {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Unknown'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Button
                      component={RouterLink}
                      to="/settings"
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      fullWidth
                    >
                      Account Settings
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Update Profile Form */}
            <Grid item xs={12} md={7}>
              <UpdateProfileForm onSuccess={handleProfileUpdateSuccess} />
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;