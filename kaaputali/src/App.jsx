import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import MobileBottomNav from "./components/MobileBottomNav";

function App() {
    return (
        <Router>
            <NavBar cartCount={0} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/collection" element={<CollectionPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
            <Footer />
            <MobileBottomNav />
        </Router>
    );
}

export default App;
