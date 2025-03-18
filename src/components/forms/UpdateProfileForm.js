import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Box, 
  Alert, 
  CircularProgress,
  Typography
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import UserService from '../../services/user';

const UpdateProfileForm = ({ onSuccess }) => {
  // Form fields state
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });

  // Form validation state
  const [errors, setErrors] = useState({});
  
  // Local form submission state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Get auth context
  const { currentUser, loading } = useAuth();

  // Load user data when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await UserService.getProfile();
        setFormData({
          fullName: userData.full_name || '',
          email: userData.email || ''
        });
      } catch (err) {
        setFormError('Failed to load user profile. Please try again later.');
        console.error('Error loading user profile:', err);
      }
    };

    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Full name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Email validation (read-only, but validate anyway)
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset form status
    setFormError('');
    setFormSuccess('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Call update profile service
      await UserService.updateProfile({
        full_name: formData.fullName
      });
      
      // Set success message
      setFormSuccess('Profile updated successfully!');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Set error message from API or a default one
      setFormError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Update Profile Information
      </Typography>
      
      {/* Form error alert */}
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      
      {/* Form success alert */}
      {formSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {formSuccess}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        {/* Full Name */}
        <Grid item xs={12}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            disabled={submitting || loading}
          />
        </Grid>
        
        {/* Email (read-only) */}
        <Grid item xs={12}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            disabled={true}
            helperText="Email cannot be changed"
          />
        </Grid>
      </Grid>
      
      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={submitting || loading}
      >
        {(submitting || loading) ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Update Profile'
        )}
      </Button>
    </Box>
  );
};

export default UpdateProfileForm;