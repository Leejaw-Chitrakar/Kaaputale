import React from 'react';
import '../styles/About.css';
import aboutImg from '../assets/about_boutique.png';
import { Heart, Sparkles, Coffee } from 'lucide-react';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="about-hero">
                <h2 className="about-title">About Kaapu Tales</h2>
                <div className="title-underline"></div>
            </div>

            <div className="about-container">
                <div className="about-story-grid">
                    <div className="about-image-container">
                        <img src={aboutImg} alt="Boutique Atmosphere" className="about-main-img" />
                        <div className="image-accent"></div>
                    </div>
                    
                    <div className="about-content">
                        <h3 className="section-subtitle">Our Story</h3>
                        <p className="about-text">
                            At <span className="about-highlight">Kaapu Tales</span>, we believe in the magic of handmade artistry.
                            Every petal, every stitch, and every knot is crafted with love and patience, transforming soft wool into timeless treasures.
                        </p>
                        <p className="about-text">
                            Our journey began with a simple passion: to create flowers that never fade and gifts that hold a piece of the heart.
                            From our vibrant bouquets to our cozy accessories, each item is unique, just like the stories they become a part of.
                        </p>
                    </div>
                </div>

                <div className="about-values">
                    <div className="value-card">
                        <div className="value-icon">
                            <Heart size={32} />
                        </div>
                        <h4>Crafted with Love</h4>
                        <p>Every piece is handmade with meticulous attention to detail and a lot of heart.</p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">
                            <Sparkles size={32} />
                        </div>
                        <h4>Timeless Beauty</h4>
                        <p>Our wool flowers never fade, preserving your special moments for years to come.</p>
                    </div>

                    <div className="value-card">
                        <div className="value-icon">
                            <Coffee size={32} />
                        </div>
                        <h4>Unique & Cozy</h4>
                        <p>We pride ourselves on creating unique, personalized gifts that bring warmth to any home.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
