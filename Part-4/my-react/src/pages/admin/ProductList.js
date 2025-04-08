import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Button, Grid, Box, IconButton, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/Products', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(response.data);
            } catch (e) {
                if (e.response?.status === 403 || e.response?.status === 401) navigate('../admin');
                console.log(e.response?.status);
            }
        };
        fetch();
    }, []);

    const handleQuantityChange = (productId, delta) => {
        setSelectedProducts(prev => {
            const current = prev[productId] || 0;
            const updated = Math.max(current + delta, 0);
            const newState = { ...prev, [productId]: updated };
            if (updated === 0) delete newState[productId];
            return newState;
        });
    };

    const handleOrder = async () => {
        // Check if any product has a quantity less than its minQuantity
        const invalidOrders = products.filter(product => {
            return selectedProducts[product._id] < product.minQuantity && selectedProducts[product._id] > 0;
        });

        if (invalidOrders.length > 0) {
            setErrorMessage('הכמות שהוזמנה קטנה מדי עבור חלק מהמוצרים');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Group products by supplierId
        const ordersBySupplier = products.reduce((acc, product) => {
            const { supplierId } = product;
            if (!acc[supplierId]) acc[supplierId] = [];
            if (selectedProducts[product._id] > 0) {
                acc[supplierId].push({
                    productId: product._id,
                    quantity: selectedProducts[product._id],
                });
            }
            return acc;
        }, {});

        // Send each order to the backend
        console.log("ordersBySupplier",ordersBySupplier)
        try {
            for (const supplierId in ordersBySupplier) {
                const orderItems = ordersBySupplier[supplierId];
                console.log("orderItems", orderItems, supplierId)
                if(orderItems.length==0)
                    continue
                try {
                    const response = await axios.post('http://localhost:4000/api/Orders', {
                        supplierId,
                        products: orderItems,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    alert(`הזמנה בוצעה בהצלחה לספק ${supplierId}:`);
                    setSelectedProducts({});
                } catch (e) {
                    if (e.response?.status === 403 || e.response?.status === 401) navigate('../admin');
                    setErrorMessage(e.response.data.message);
                    setTimeout(() => setErrorMessage(''), 3000);
                }
            }
            navigate('../admin/OrdersList')
        }
        catch (e) {
        }
    };

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
                    }}
                >
                    🛒 רשימת סחורות
                </Typography>
            </Box>

            <Grid container spacing={2} mt={4}>
                {products.map((product) => {
                    const orderedQuantity = selectedProducts[product._id] || 0;
                    const isQuantityValid = orderedQuantity >= product.minQuantity;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <Card sx={{ padding: 3, boxShadow: 3 }}>
                                <CardContent sx={{ textAlign: 'right' }}>
                                    {/* שם המוצר גדול יותר */}
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {product.name}
                                    </Typography>

                                    {/* פרטי המוצר */}
                                    <Box mt={2}>
                                        <Typography color="text.secondary" sx={{ fontSize: '16px' }}>
                                            מחיר: ₪{product.price}
                                        </Typography>
                                        <Typography color="text.secondary" sx={{ fontSize: '16px' }}>
                                            כמות מינימלית: {product.minQuantity}
                                        </Typography>
                                    </Box>
                                    {/* כפתורי הוספה והורדה */}
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        mt={2}
                                        justifyContent="flex-start"
                                        sx={{ width: '100%' }} // נותן לרוחב הכפתורים להיות 100%
                                    >
                                        <IconButton
                                            onClick={() => handleQuantityChange(product._id, -1)}
                                            sx={{ width: 40, height: 40 }} // רוחב וגובה קבועים לכפתור
                                        >
                                            <RemoveIcon />
                                        </IconButton>

                                        <Typography
                                            mx={1}
                                            sx={{
                                                fontWeight: '600',
                                                color: isQuantityValid ? 'green' : 'red',
                                                fontSize: '18px', // גודל טקסט בגודל בינוני
                                            }}
                                        >
                                            {orderedQuantity}
                                        </Typography>

                                        <IconButton
                                            onClick={() => handleQuantityChange(product._id, 1)}
                                            sx={{ width: 40, height: 40 }} // רוחב וגובה קבועים לכפתור
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                    );
                })}
            </Grid>
            {products.length == 0 && <h2>אין לך הזמנות  </h2>}
            {Object.keys(selectedProducts).length > 0 && (
                <Box mt={4} textAlign="center">
                    <Button variant="contained" color="primary" onClick={handleOrder}>
                        בצע הזמנה
                    </Button>
                </Box>
            )}
            <Button onClick={() => {
                navigate('../admin/OrdersList')
            }}>לצפיה בכל ההזמנות</Button>

            {errorMessage && (
                <Box mt={2} textAlign="center">
                    <Typography color="error">{errorMessage}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ProductList;
