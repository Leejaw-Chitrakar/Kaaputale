import React from 'react';
import '../styles/About.css';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="about-container">
                <h2 className="about-title">About Kaapu Tales</h2>
                <p className="about-text">
                    At <span className="about-highlight">Kaapu Tales</span>, we believe in the magic of handmade artistry.
                    Every petal, every stitch, and every knot is crafted with love and patience, transforming soft wool into timeless treasures.
                </p>
                <p className="about-text">
                    Our journey began with a simple passion: to create flowers that never fade and gifts that hold a piece of the heart.
                    From our vibrant bouquets to our cozy accessories, each item is unique, just like the stories they become a part of.
                </p>
            </div>
        </section>
    );
};

export default About;
