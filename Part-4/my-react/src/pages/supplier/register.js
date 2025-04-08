import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Grid,
    Divider,
    Link
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({
        companyName: '',
        phone: '',
        email: '',
        password: '',
        contactPerson: '',
        products: []
    });

    const [product, setProduct] = useState({
        name: '',
        price: '',
        minQuantity: '',
    });

    const [products, setProducts] = useState([]);
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const handleAddProduct = () => {
        if (!product.name || !product.price || !product.minQuantity) return;

        setProducts([...products, product]);
        setProduct({ name: '', price: '', minQuantity: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        form.products = products;
        try {
            const response = await axios.post("http://localhost:4000/api/Suplier/register", form, {
                withCredentials: true
            });
            console.log('Registration success:', response.data);
            navigate('../');
        } catch (err) {
            setServerError(err.response?.data?.message || 'שגיאה ברישום');
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#e0f2f1"
            px={2}
            dir="rtl"
        >
            <Paper elevation={6} sx={{ p: 5, width: '100%', maxWidth: 600 }}>
                <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary">
                    רישום ספק חדש
                </Typography>

                <form onSubmit={handleSubmit} style={{ direction: 'rtl' }}>
                    <TextField
                        label="שם חברה"
                        fullWidth
                        required
                        margin="normal"
                        value={form.companyName}
                        onChange={e => setForm({ ...form, companyName: e.target.value })}
                        inputProps={{ style: { textAlign: 'right' } }}
                        InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }} />
                    <TextField
                        label="טלפון"
                        fullWidth
                        required
                        margin="normal"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        inputProps={{ style: { textAlign: 'right' } }}
                        InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }} />                    
                    <TextField
                        label="אימייל"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        inputProps={{ style: { textAlign: 'right' } }}
                        InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }} />                    
                    <TextField
                        label="סיסמה"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        inputProps={{ style: { textAlign: 'right' } }}
                        InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }} />                    
                    <TextField
                        label="שם נציג"
                        fullWidth
                        required
                        margin="normal"
                        value={form.contactPerson}
                        onChange={e => setForm({ ...form, contactPerson: e.target.value })}
                        inputProps={{ style: { textAlign: 'right' } }}
                        InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }} />                    

                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom color="secondary">
                        הוסף סחורה
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="שם מוצר"
                                fullWidth
                                value={product.name}
                                onChange={e => setProduct({ ...product, name: e.target.value })}
                                inputProps={{ style: { textAlign: 'right' } }}
                                InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }}                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="מחיר"
                                type="number"
                                fullWidth
                                value={product.price}
                                onChange={e => setProduct({ ...product, price: e.target.value })}
                                inputProps={{ style: { textAlign: 'right' } }}
                                InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }}                             />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="כמות מינימלית"
                                type="number"
                                fullWidth
                                value={product.minQuantity}
                                onChange={e => setProduct({ ...product, minQuantity: e.target.value })}
                                inputProps={{ style: { textAlign: 'right' } }}
                                InputLabelProps={{ style: { direction: 'rtl', right: 30, left: 'auto' } }}                             />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" color="primary" fullWidth onClick={handleAddProduct}>
                                הוסף מוצר
                            </Button>
                        </Grid>
                    </Grid>

                    {products.length > 0 && (
                        <Box mt={2}>
                            <Typography variant="subtitle2" fontWeight="bold">מוצרים שהוספת:</Typography>
                            {products.map((p, i) => (
                                <Typography key={i} sx={{ mr: 1 }}>
                                    • {p.name} | ₪{p.price} | מינימום: {p.minQuantity}
                                </Typography>
                            ))}
                        </Box>
                    )}

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
                        sx={{ mt: 3, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                        הירשם
                    </Button>

                    <Box mt={3} textAlign="center">
                        <Typography variant="body1">
                            כבר יש לך חשבון?{' '}
                            <Link href="/" underline="hover" color="secondary">
                                התחבר
                            </Link>
                        </Typography>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Register;
