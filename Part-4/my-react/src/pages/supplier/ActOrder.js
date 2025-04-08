import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Chip,
    Button, Tooltip,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
function OrdersWithAction() {
    const [orders, setOrders] = useState([]);
    const [flag, setflag] = useState(false);
    const token = sessionStorage.getItem('token')
    const navigate = useNavigate()
    const id = sessionStorage.getItem('SupplierId')
    useEffect(() => {
        fetch();
    }, [flag]);

    const fetch = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/Orders/GetOrdersOnWaiting/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            console.log(response.data)
            setOrders(response.data)
            // setProducts(response.data)
        }
        catch (e) { if (e.response.status == 403 || e.response.status == 401) navigate('../'); console.log(e.response.status) }
    }

    const handleExecute = async (id) => {
        console.log(token)
        try {
            const response = await axios.put(`http://localhost:4000/api/Orders/Process/${id}`,
                {}, // אין body, אז שולחים ריק
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            // setProducts(response.data)
            alert("ההזמנה בתהליך")
            setflag(true)
        }
        catch (e) { if (e.response.status == 403 || e.response.status == 401) navigate('../'); console.log(e.response.status) }
    }


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
                    <ShoppingCartIcon sx={{ marginRight: 3 }} /> {/* אייקון סל קניות */}
                    ניהול הזמנות     </Typography>
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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleExecute(order._id)}
                                    >
                                        אשר הזמנה
                                    </Button>

                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {orders.length==0&&<h2>אין לך הזמנות מבעל החנות</h2>}
            </Grid>
        </Box>
    );
}

export default OrdersWithAction;
