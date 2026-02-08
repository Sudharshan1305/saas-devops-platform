import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

function Navigation() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/dashboard" style={styles.logo}>
                    SaaS Platform
                </Link>

                <div style={styles.links}>
                    <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                    <Link to="/billing" style={styles.link}>Billing</Link>
                    <Link to="/usage" style={styles.link}>Usage</Link>
                    {user?.role === 'ADMIN' && (
                        <Link to="/admin" style={styles.adminLink}>Admin</Link>
                    )}
                </div>

                <div style={styles.userSection}>
                    <span style={styles.userName}>{user?.name}</span>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        backgroundColor: '#007bff',
        padding: '15px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
        textDecoration: 'none',
    },
    links: {
        display: 'flex',
        gap: '20px',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
    },
    adminLink: {
        color: '#ffc107',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    userName: {
        color: 'white',
    },
    logoutButton: {
        padding: '8px 15px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Navigation;