import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {

    // ✅ ALL STATES AT TOP (IMPORTANT)
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    const navigate = useNavigate();

    // ✅ GET USER
    const getUser = () => {
    try {
        const storedUser = localStorage.getItem("user");

        // ✅ ONLY parse if valid
        if (storedUser && storedUser !== "undefined") {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }

    } catch (err) {
        console.log("User parse error");
        setUser(null);
    }
};

    // ✅ FETCH CART COUNT (SAFE)
    const fetchCartCount = async () => {
        try {
            const res = await API.get('/cart');

            const total = (res.data || []).reduce((acc, item) => {
                return acc + item.quantity;
            }, 0);

            setCartCount(total);
        } catch (err) {
            console.log("Cart not loaded");
        }
    };

    // ✅ LOAD DATA
    useEffect(() => {
        getUser();

        API.get('/products')
            .then(res => {
                setProducts(res.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        fetchCartCount();
    }, []);

    // ✅ ADD TO CART
    const addToCart = async (productId) => {
        try {
            await API.post('/cart/add', {
                product_id: productId,
                quantity: 1
            });

            fetchCartCount();
            alert('Added to cart');

        } catch (err) {
            if (err.response?.data?.message === "No token, authorization denied") {
                alert("Please login first");
                navigate('/login');
            } else {
                alert("Error adding to cart");
            }
        }
    };

    // ✅ LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setCartCount(0);

        navigate('/login');
    };

    // ✅ SAFE PRODUCTS
    const featuredProducts = (products || []).slice(0, 6);

    return (
        <div className="home">

            {/* localStorage.getItem("token") */}

            {/* HERO */}
            <div className="hero">
                <h1>Latest Tech. Best Prices.</h1>
                <p>Shop smartphones, laptops, and accessories.</p>

                <button onClick={() => navigate('/products')}>
                    Shop Now
                </button>
            </div>

            {/* PRODUCTS */}
            <div className="container">
                <h2 className="section-title">Featured Products</h2>

                {loading ? (
                    <p className="loading">Loading...</p>
                ) : (
                    <div className="products-grid">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="product-card">

                                <img
                                    src={product.image_url || 'https://via.placeholder.com/200'}
                                    alt={product.name}
                                />

                                <h3>{product.name}</h3>

                                <p className="category">
                                    {product.category}
                                </p>

                                <p className="price">
                                    ${product.price}
                                </p>

                                <div className="card-buttons">
                                    <button onClick={() => addToCart(product.id)}>
                                        Add to Cart
                                    </button>

                                    <button onClick={() => navigate('/products')}>
                                        View
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

    

        </div>
    );
}

export default Home;