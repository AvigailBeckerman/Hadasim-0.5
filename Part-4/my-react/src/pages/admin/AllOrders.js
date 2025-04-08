import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Chip,
    CircularProgress,
    Button,
    Tooltip,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const [flag, setFlag] = useState(false);

    // Fetch orders on mount or when flag changes
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/Orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setOrders(response.data);
                setLoading(false); // Setting loading to false after data is fetched
            } catch (e) {
                if (e.response?.status === 403 || e.response?.status === 401) navigate('../admin');
                console.log(e.response?.status);
            }
        };
        fetch();
    }, [flag]);

    // Handle order confirmation
    const handleConfirmOrder = async (id) => {
        try {
            const response = await axios.put(
                `http://localhost:4000/api/Orders/Complete/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('ההזמנה אושרה');
            setFlag(true); // Trigger a re-fetch of orders
        } catch (e) {
            console.log(e);
        }
    };

    // Show loading spinner if data is being fetched
    if (loading) return <CircularProgress />;

    return (
        <Box p={5} dir="rtl" m={10}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: 'black',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        display: 'inline-block', // לא תופס את כל הרוחב
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <ShoppingCartIcon sx={{ marginRight: 1 }} /> {/* אייקון סל קניות */}
                    כל ההזמנות                 </Typography>
            </Box>
            <Grid container spacing={3}>
                {orders.map((order) => (
                    <Grid item xs={12} md={6} lg={4} key={order._id}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    הזמנה #{order._id}
                                </Typography>

                                {/* Centered status chip */}
                                <Box mt={2} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Chip
                                        label={order.status}
                                        color={
                                            order.status === 'pending'
                                                ? 'warning'
                                                : order.status === 'inProgress'
                                                    ? 'info'
                                                    : order.status === 'completed'
                                                        ? 'success'
                                                        : 'default'
                                        }
                                    />
                                </Box>

                                {/* Supplier details */}
                                <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            חברה:
                                        </Typography>
                                        <Typography variant="body2">
                                            {order.supplierId?.companyName}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            ספק:
                                        </Typography>
                                        <Typography variant="body2">
                                            {order.supplierId?.contactPerson}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            טלפון:
                                        </Typography>
                                        <Typography variant="body2">
                                            {order.supplierId?.phone}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            אימייל:
                                        </Typography>
                                        <Typography variant="body2">
                                            {order.supplierId?.email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box mt={2} sx={{ display: 'flex', gap: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        תאריך:
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(order.orderDate).toLocaleDateString('he-IL', {
                                            weekday: 'long', // לדוג' יום ראשון
                                            year: 'numeric', // השנה
                                            month: 'long', // החודש בשמו המלא
                                            day: 'numeric', // היום בחודש
                                        })}                                    </Typography>
                                </Box>

                                {/* Display products in the order */}
                                <Box mt={2}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        מוצרים:
                                    </Typography>
                                    {order.products.length > 0 &&
                                        order.products.slice(0, 4).map((product, index) => (
                                            <Typography key={index} variant="body2">
                                                {product.productId.name} - {product.quantity} יחידות
                                            </Typography>
                                        ))}
                                    {order.products.length > 4 && (
                                        <Tooltip
                                            title={
                                                order.products
                                                    .slice(4)
                                                    .map(
                                                        (product) =>
                                                            `${product.productId.name} - ${product.quantity} יחידות`
                                                    )
                                                    .join(', ')
                                            }
                                        >
                                            <Typography variant="body2" color="primary">
                                                ...לצפייה בשאר המוצרים
                                            </Typography>
                                        </Tooltip>
                                    )}
                                </Box>

                                {/* Button to confirm order only appears for 'inProgress' orders */}
                                <Box mt={2} display="flex" justifyContent="center">
                                    {order.status === 'inProgress' && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleConfirmOrder(order._id)}
                                        >
                                            אשר הזמנה
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                ))}
                {orders.length == 0 && <h2>אין לך הזמנות  </h2>}
            </Grid>
            <Button onClick={() => {
                navigate('../admin/ProductList')
            }}>הזמנה חדשה  </Button>
        </Box>

    );
}

export default OrdersList;
