import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import MobileBottomNav from "./components/MobileBottomNav";
import AdminDashboard from "./components/AdminDashboard";

/**
 * SECRET GATEWAY
 * The Admin Dashboard is only shown when the URL hash is exactly "#admin-panel".
 * It is completely invisible in the normal navigation — no link, no route, no hint.
 * Usage: navigate to yoursite.com/#admin-panel
 */
function useAdminGateway() {
    const [isAdmin, setIsAdmin] = useState(
        () => window.location.hash === "#admin-panel"
    );

    useEffect(() => {
        const handleHash = () => {
            setIsAdmin(window.location.hash === "#admin-panel");
        };
        window.addEventListener("hashchange", handleHash);
        return () => window.removeEventListener("hashchange", handleHash);
    }, []);

    return isAdmin;
}

function App() {
    const showAdmin = useAdminGateway();

    if (showAdmin) {
        return (
            <AdminDashboard
                onExit={() => {
                    window.location.hash = "";
                    window.location.reload();
                }}
            />
        );
    }

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
