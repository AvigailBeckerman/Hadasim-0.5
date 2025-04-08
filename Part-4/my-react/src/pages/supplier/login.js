import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/Suplier/login", { email, password }, { withCredentials: true });
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('SupplierId', response.data.supplier);
      console.log('Login success:', response.data);
      navigate('../OrdersWithAction');
    } catch (err) {
      setServerError(err.response?.data?.message || 'שגיאה בשרת');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#e0f7fa"
      px={2}
      dir="rtl"
    >
      <Paper elevation={6} sx={{ p: 6, width: '100%', maxWidth: 500, textAlign: 'right' }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary">
          התחברות ספק
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="אימייל"
            type="email"
            fullWidth
            required
            margin="normal"
            size="medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputProps={{ style: { textAlign: 'right' } }}
            InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }}          />
          <TextField
            label="סיסמה"
            type="password"
            fullWidth
            required
            margin="normal"
            size="medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{ style: { textAlign: 'right' } }}
            InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }}          />

          {serverError && (
            <Typography color="error" mt={2} textAlign="center">
              {serverError}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{
              mt: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
            }}
          >
            התחבר
          </Button>

          <Box mt={3} textAlign="center">
            <Typography variant="body1">
              אין לך חשבון?{' '}
              <Link href="/register" underline="hover" color="secondary">
                הירשם
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
