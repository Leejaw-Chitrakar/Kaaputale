import React from 'react';
import { Link } from 'react-router-dom'; // Assuming we will use this
import '../styles/Hero.css';
import bgMobile from '../assets/BG/mob.png';
import bgDesktop from '../assets/BG/desk.png';

const Hero = () => {
    return (
        <section
            className="hero-container"
            style={{
                '--bg-mobile': `url(${bgMobile})`,
                '--bg-desktop': `url(${bgDesktop})`
            }}
        >
            <div className="hero-background"></div>
            <div className="hero-content">
                <h1 className="hero-title">
                    Handcrafted <span>Elegance</span>
                </h1>
                <p className="hero-subtitle">
                    Discover our exclusive collection of handmade wool flowers, accessories, and gifts.
                    Timeless beauty that never fades.
                </p>
                {/* Using standard anchor tag for now if Routing isn't fully set up, or Link if it is. 
            Will use Link assuming Router context will be there. */}
                <a href="#collection" className="hero-cta-btn">
                    View Collection
                </a>
            </div>
        </section>
    );
};

export default Hero;
