import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Trophy, Flower2, MessageSquare, Users } from 'lucide-react';
import '../styles/MobileBottomNav.css';

const MobileBottomNav = () => {
    const location = useLocation();
    const [activeIndex, setActiveIndex] = useState(1); // Default to Home (second item now)

    const navItems = [
        { path: '/', icon: <Home size={26} />, label: 'Home' },
        { path: '/collection', icon: <Flower2 size={22} />, label: 'Projects' },
        { path: '/contact', icon: <MessageSquare size={22} />, label: 'Register' },
        { path: '/about', icon: <Users size={22} />, label: 'About' },
    ];

    useEffect(() => {
        const index = navItems.findIndex(item => item.path === location.pathname);
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [location.pathname]);

    return (
        <nav className="mobile-bottom-nav">
            <div className="bottom-nav-container">
                {/* Sliding Indicator Circle */}
                <div 
                    className="nav-indicator" 
                    style={{ transform: `translateX(calc(${activeIndex} * 100%))` }}
                >
                    <div className="indicator-circle"></div>
                </div>

                {navItems.map((item, index) => (
                    <NavLink 
                        key={index}
                        to={item.path} 
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <div className="icon-wrapper">
                            {item.icon}
                        </div>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
