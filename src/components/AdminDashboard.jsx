/**
 * AdminDashboard.jsx — Kaaputale Admin Panel
 * ─────────────────────────────────────────────────────────────
 * SECURITY MODEL:
 *  • Hidden gateway: only accessible via URL hash "#admin-panel"
 *  • Firebase Auth: credentials never stored locally
 *  • RBAC: write ops gated behind VITE_ADMIN_UID check
 * ─────────────────────────────────────────────────────────────
 * FEATURES:
 *  • Full CRUD for Products in Firestore
 *  • Real-time sync via onSnapshot
 *  • Image URL preview
 *  • Featured toggle
 *  • Sort order control
 *  • Dark / Light theme
 *  • Toast notifications
 *  • Confirm-to-delete flow
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import {
    collection, onSnapshot, addDoc, updateDoc,
    deleteDoc, doc, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import axios from "axios";
import "../styles/AdminDashboard.css";

// ─── Constants ───────────────────────────────────────────────
const ADMIN_UIDS = (import.meta.env.VITE_ADMIN_UIDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
const APP_ID = "kaaputale-store";
const COLLECTION_PATH = `artifacts/${APP_ID}/public/data/products`;
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const PRODUCT_TYPES = ["flower", "keychain", "accessory", "bookmark"];

const TYPE_EMOJI = {
    flower: "🌸",
    keychain: "🔑",
    accessory: "🧣",
    bookmark: "📖",
};

// ─── Toast ────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
    <div className="ad-toast-container">
        {toasts.map((t) => (
            <div key={t.id} className={`ad-toast ad-toast--${t.type}`}>
                <span className="ad-toast__icon">
                    {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
                </span>
                <span>{t.message}</span>
            </div>
        ))}
    </div>
);

// ─── Spinner ──────────────────────────────────────────────────
const Spinner = ({ size = 20 }) => (
    <svg className="ad-spinner" width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

// ─── Confirm Delete Modal ─────────────────────────────────────
const ConfirmDeleteModal = ({ item, onConfirm, onCancel, loading }) => {
    const [txt, setTxt] = useState("");
    return (
        <div className="ad-overlay" onClick={onCancel}>
            <div className="ad-modal ad-modal--danger" onClick={(e) => e.stopPropagation()}>
                <div className="ad-modal__header ad-modal__header--danger">
                    <span className="ad-modal__danger-icon">⚠</span>
                    <h2>Delete Product</h2>
                </div>
                <div className="ad-modal__body">
                    <p className="ad-modal__danger-text">
                        You are about to permanently delete <strong>"{item?.name}"</strong>.
                        This cannot be undone.
                    </p>
                    <div className="ad-form-group">
                        <label className="ad-label">Type <code>DELETE</code> to confirm</label>
                        <input
                            autoFocus
                            className="ad-input"
                            value={txt}
                            onChange={(e) => setTxt(e.target.value)}
                            placeholder="DELETE"
                        />
                    </div>
                </div>
                <div className="ad-modal__footer">
                    <button className="ad-btn ad-btn--ghost" onClick={onCancel} disabled={loading}>Cancel</button>
                    <button
                        className="ad-btn ad-btn--danger"
                        onClick={onConfirm}
                        disabled={txt !== "DELETE" || loading}
                    >
                        {loading ? <Spinner size={16} /> : "Delete Permanently"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Product Form Modal ───────────────────────────────────────
const ProductFormModal = ({ initial, onSave, onClose, loading, toast }) => {
    const isEdit = !!initial;
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        name: initial?.name || "",
        type: initial?.type || "flower",
        description: initial?.description || "",
        price: initial?.price || "",
        priceNote: initial?.priceNote || "",
        imageUrl: initial?.imageUrl || "",
        featured: initial?.featured ?? false,
        sortOrder: initial?.sortOrder ?? 99,
    });
    const [errors, setErrors] = useState({});
    const [imgError, setImgError] = useState(false);

    const set = (key, val) => {
        setForm((f) => ({ ...f, [key]: val }));
        setErrors((e) => ({ ...e, [key]: "" }));
    };

    // ─── Custom API Image Upload ──────────────────────────────
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!IMGBB_API_KEY) {
            toast("Error: VITE_IMGBB_API_KEY is missing in your .env file!", "error");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                formData,
            );

            const directLink = response.data.data.url;
            set("imageUrl", directLink);
            setImgError(false);
            toast("Image uploaded successfully!");
        } catch (err) {
            console.error("Upload error:", err);
            toast("Upload failed. Verify your API Key.", "error");
        } finally {
            setUploading(false);
        }
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.description.trim()) e.description = "Description is required";
        if (!form.price || isNaN(Number(form.price))) e.price = "Valid price required";
        if (!form.imageUrl.trim()) e.imageUrl = "Image URL is required";
        return e;
    };

    const handleSubmit = (e) => {
        e?.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSave({
            ...form,
            price: Number(form.price),
            sortOrder: Number(form.sortOrder),
        });
    };

    return (
        <div className="ad-overlay" onClick={onClose}>
            <div className="ad-modal ad-modal--form" onClick={(e) => e.stopPropagation()}>
                <div className="ad-modal__header">
                    <h2>{isEdit ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
                    <button className="ad-icon-btn" onClick={onClose}>✕</button>
                </div>

                <div className="ad-modal__body ad-form-grid">
                    {/* LEFT COLUMN */}
                    <div className="ad-form-section">
                        <h3 className="ad-section-title">Basic Info</h3>

                        <div className="ad-form-group">
                            <label className="ad-label">Product Name <span className="ad-required">*</span></label>
                            <input className={`ad-input ${errors.name ? "ad-input--error" : ""}`}
                                value={form.name} onChange={(e) => set("name", e.target.value)} />
                            {errors.name && <span className="ad-field-error">{errors.name}</span>}
                        </div>

                        <div className="ad-form-group">
                            <label className="ad-label">Type</label>
                            <select className="ad-input ad-select"
                                value={form.type} onChange={(e) => set("type", e.target.value)}>
                                {PRODUCT_TYPES.map((t) => (
                                    <option key={t} value={t}>{TYPE_EMOJI[t]} {t}</option>
                                ))}
                            </select>
                        </div>

                        <div className="ad-form-group">
                            <label className="ad-label">Description <span className="ad-required">*</span></label>
                            <textarea
                                className={`ad-input ad-textarea ${errors.description ? "ad-input--error" : ""}`}
                                rows={5}
                                value={form.description}
                                onChange={(e) => set("description", e.target.value)}
                            />
                            {errors.description && <span className="ad-field-error">{errors.description}</span>}
                        </div>

                        <div className="ad-form-row">
                            <div className="ad-form-group">
                                <label className="ad-label">Price (Rs.) <span className="ad-required">*</span></label>
                                <input type="number" className={`ad-input ${errors.price ? "ad-input--error" : ""}`}
                                    value={form.price} onChange={(e) => set("price", e.target.value)} min="0" />
                                {errors.price && <span className="ad-field-error">{errors.price}</span>}
                            </div>
                            <div className="ad-form-group">
                                <label className="ad-label">Price Note</label>
                                <input className="ad-input" placeholder='e.g. "per piece"'
                                    value={form.priceNote} onChange={(e) => set("priceNote", e.target.value)} />
                            </div>
                        </div>

                        <div className="ad-form-row">
                            <div className="ad-form-group">
                                <label className="ad-label">Sort Order</label>
                                <input type="number" className="ad-input"
                                    value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} min="0" />
                                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Lower = appears first</span>
                            </div>
                            <div className="ad-form-group" style={{ justifyContent: "center" }}>
                                <label className="ad-label">Featured on Home?</label>
                                <label className="ad-toggle">
                                    <input type="checkbox" checked={form.featured}
                                        onChange={(e) => set("featured", e.target.checked)} />
                                    <span className="ad-toggle__slider" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="ad-form-section">
                        <h3 className="ad-section-title">Product Image</h3>
                        <div className="ad-form-group">
                            <label className="ad-label">Image URL <span className="ad-required">*</span></label>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    className={`ad-input ${errors.imageUrl ? "ad-input--error" : ""}`}
                                    placeholder="https://..."
                                    style={{ flex: 1 }}
                                    value={form.imageUrl}
                                    onChange={(e) => { set("imageUrl", e.target.value); setImgError(false); }}
                                />
                                <label
                                    className="ad-btn ad-btn--primary"
                                    style={{
                                        padding: "0 15px",
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        opacity: uploading ? 0.7 : 1,
                                    }}
                                >
                                    {uploading ? "..." : "📤"}
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                            {errors.imageUrl && <span className="ad-field-error">{errors.imageUrl}</span>}
                            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                Paste URL or use 📤 to upload via ImgBB.
                            </span>
                        </div>

                        {/* Image preview */}
                        <div className="ad-img-preview">
                            {form.imageUrl && !imgError ? (
                                <img
                                    src={form.imageUrl}
                                    alt="preview"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="ad-img-placeholder">
                                    {imgError ? "⚠ Invalid URL" : "Image preview will appear here"}
                                </div>
                            )}
                        </div>

                        <div className="ad-product-preview-card">
                            <h4 className="ad-section-title" style={{ marginBottom: 10 }}>Card Preview</h4>
                            <div className="ad-mini-card">
                                {form.imageUrl && !imgError && (
                                    <img src={form.imageUrl} alt={form.name} className="ad-mini-card__img" />
                                )}
                                <div className="ad-mini-card__info">
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>{form.name || "Product Name"}</div>
                                    <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: 13, marginTop: 4 }}>
                                        Rs. {form.price || "0"}
                                        {form.priceNote && (
                                            <span style={{ color: "var(--text-secondary)", fontWeight: 400, fontSize: 12 }}>
                                                {" "}({form.priceNote})
                                            </span>
                                        )}
                                    </div>
                                    {form.featured && (
                                        <span className="ad-featured-badge">⭐ Featured</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ad-modal__footer">
                    <button className="ad-btn ad-btn--ghost" onClick={onClose} disabled={loading || uploading}>Cancel</button>
                    <button className="ad-btn ad-btn--primary" onClick={handleSubmit} disabled={loading || uploading}>
                        {loading || uploading ? <Spinner size={16} /> : isEdit ? "Save Changes" : "Add Product"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Login Overlay ────────────────────────────────────────────
const LoginOverlay = ({ onLogin, loading, error }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="ad-login-screen">
            <div className="ad-login-card">
                <div className="ad-login-logo">
                    <span className="ad-login-icon">🔐</span>
                    <h1>Kaaputale Admin</h1>
                    <p>Restricted access — authorised personnel only</p>
                </div>
                <form className="ad-login-form"
                    onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}>
                    <div className="ad-form-group">
                        <label className="ad-label">Email</label>
                        <input type="email" className="ad-input" placeholder="admin@kaaputale.com"
                            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
                    </div>
                    <div className="ad-form-group">
                        <label className="ad-label">Password</label>
                        <div className="ad-input-wrapper">
                            <input type={showPass ? "text" : "password"} className="ad-input" placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password" required />
                            <button type="button" className="ad-input-toggle" onClick={() => setShowPass((s) => !s)}>
                                {showPass ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="ad-login-error"><span>⚠</span> {error}</div>
                    )}
                    <button type="submit" className="ad-btn ad-btn--primary ad-btn--full" disabled={loading}>
                        {loading ? <Spinner size={18} /> : "Sign In"}
                    </button>
                </form>
                <p className="ad-login-footer">Secured by Firebase Auth. No credentials stored locally.</p>
            </div>
        </div>
    );
};

// ─── Stats Card ───────────────────────────────────────────────
const StatsCard = ({ label, value, icon, color }) => (
    <div className="ad-stat-card" style={{ borderLeftColor: color }}>
        <div className="ad-stat-icon">{icon}</div>
        <div>
            <div className="ad-stat-value">{value}</div>
            <div className="ad-stat-label">{label}</div>
        </div>
    </div>
);

// ─── Main Admin Dashboard ─────────────────────────────────────
export default function AdminDashboard({ onExit }) {
    // Auth
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const isAdmin = user && ADMIN_UIDS.includes(user.uid);

    // Data
    const [products, setProducts] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);

    // UI
    const [theme, setTheme] = useState("dark");
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Modals
    const [addModal, setAddModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [mutLoading, setMutLoading] = useState(false);

    // Toasts
    const [toasts, setToasts] = useState([]);
    const toastRef = useRef(0);
    const toast = useCallback((message, type = "success") => {
        const id = ++toastRef.current;
        setToasts((t) => [...t, { id, message, type }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    }, []);

    // ── Auth listener ─────────────────────────────────────────
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setAuthLoading(false);
        });
        return unsub;
    }, []);

    // ── Firestore listener ────────────────────────────────────
    useEffect(() => {
        if (!user) return;
        setDataLoading(true);
        const q = query(collection(db, COLLECTION_PATH), orderBy("sortOrder", "asc"));
        const unsub = onSnapshot(
            q,
            (snap) => {
                setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
                setDataLoading(false);
            },
            (err) => {
                toast("Failed to load: " + err.message, "error");
                setDataLoading(false);
            }
        );
        return unsub;
    }, [user, toast]);

    // ── Login ─────────────────────────────────────────────────
    const handleLogin = async (email, password) => {
        setLoginLoading(true);
        setLoginError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast("Welcome back!");
        } catch (err) {
            setLoginError(
                err.code === "auth/invalid-credential" ? "Invalid email or password." :
                    err.code === "auth/too-many-requests" ? "Too many attempts. Try again later." :
                        err.message
            );
        } finally {
            setLoginLoading(false);
        }
    };

    // ── Sign out ──────────────────────────────────────────────
    const handleSignOut = async () => {
        await signOut(auth);
        toast("Signed out.", "info");
    };

    // ── Create ────────────────────────────────────────────────
    const handleAdd = async (data) => {
        if (!isAdmin) { toast("Unauthorised.", "error"); return; }
        setMutLoading(true);
        try {
            await addDoc(collection(db, COLLECTION_PATH), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            toast(`"${data.name}" added!`);
            setAddModal(false);
        } catch (err) {
            toast("Failed to add: " + err.message, "error");
        } finally {
            setMutLoading(false);
        }
    };

    // ── Update ────────────────────────────────────────────────
    const handleEdit = async (data) => {
        if (!isAdmin) { toast("Unauthorised.", "error"); return; }
        setMutLoading(true);
        try {
            await updateDoc(doc(db, COLLECTION_PATH, editTarget.id), {
                ...data,
                updatedAt: serverTimestamp(),
            });
            toast(`"${data.name}" updated!`);
            setEditTarget(null);
        } catch (err) {
            toast("Failed to update: " + err.message, "error");
        } finally {
            setMutLoading(false);
        }
    };

    // ── Delete ────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!isAdmin) { toast("Unauthorised.", "error"); return; }
        setMutLoading(true);
        try {
            await deleteDoc(doc(db, COLLECTION_PATH, deleteTarget.id));
            toast(`"${deleteTarget.name}" deleted.`, "info");
            setDeleteTarget(null);
        } catch (err) {
            toast("Failed to delete: " + err.message, "error");
        } finally {
            setMutLoading(false);
        }
    };

    // ── Toggle featured inline ────────────────────────────────
    const toggleFeatured = async (product) => {
        if (!isAdmin) return;
        try {
            await updateDoc(doc(db, COLLECTION_PATH, product.id), {
                featured: !product.featured,
                updatedAt: serverTimestamp(),
            });
            toast(`${product.featured ? "Removed from" : "Added to"} featured.`);
        } catch (err) {
            toast("Update failed.", "error");
        }
    };

    // ── Filter ────────────────────────────────────────────────
    const filtered = products.filter((p) => {
        if (filterType !== "all" && p.type !== filterType) return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                (p.name || "").toLowerCase().includes(q) ||
                (p.description || "").toLowerCase().includes(q)
            );
        }
        return true;
    });

    // ─── Stats ───────────────────────────────────────────────
    const featuredCount = products.filter((p) => p.featured).length;
    const typeCount = (t) => products.filter((p) => p.type === t).length;

    // ── Loading / Auth screens ────────────────────────────────
    if (authLoading) {
        return (
            <div className="ad-root ad-root--loading" data-theme="dark">
                <Spinner size={40} />
            </div>
        );
    }
    if (!user) {
        return (
            <div className="ad-root" data-theme="dark">
                <Toast toasts={toasts} />
                <LoginOverlay onLogin={handleLogin} loading={loginLoading} error={loginError} />
            </div>
        );
    }
    if (!isAdmin) {
        return (
            <div className="ad-root ad-root--denied" data-theme="dark">
                <div className="ad-denied-card">
                    <span style={{ fontSize: 64 }}>🚫</span>
                    <h2>Access Denied</h2>
                    <p>Your account does not have admin privileges.</p>
                    <button className="ad-btn ad-btn--ghost" onClick={handleSignOut}>Sign Out</button>
                </div>
            </div>
        );
    }

    return (
        <div className="ad-root" data-theme={theme}>
            <Toast toasts={toasts} />

            {/* ── Mobile Overlay ───────────────────────────────────── */}
            {mobileMenuOpen && (
                <div className="ad-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* ── Sidebar ──────────────────────────────────────── */}
            <aside className={`ad-sidebar ${mobileMenuOpen ? "ad-sidebar--open" : ""}`}>
                <div className="ad-sidebar__header">
                    <div className="ad-sidebar__logo">
                        <span>🪡</span>
                        <span>Kaaputale</span>
                    </div>
                    <button className="ad-sidebar-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
                </div>
                <nav className="ad-sidebar__nav">
                    <div className="ad-nav-item ad-nav-item--active" onClick={() => setMobileMenuOpen(false)}>
                        <span>🛍</span> Products
                    </div>
                </nav>
                <div className="ad-sidebar__footer">
                    <div className="ad-user-chip">
                        <span className="ad-user-avatar">{user.email?.[0]?.toUpperCase()}</span>
                        <span className="ad-user-email">{user.email}</span>
                    </div>
                    <button className="ad-btn ad-btn--ghost ad-btn--sm"
                        onClick={() => setTheme((t) => t === "dark" ? "light" : "dark")} title="Toggle theme">
                        {theme === "dark" ? "☀ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
                    </button>
                    <button className="ad-btn ad-btn--ghost ad-btn--sm" onClick={handleSignOut}>Sign Out</button>
                    {onExit && (
                        <button className="ad-btn ad-btn--ghost ad-btn--sm" onClick={onExit}>← Back to Site</button>
                    )}
                </div>
            </aside>

            {/* ── Main ─────────────────────────────────────────── */}
            <main className="ad-main">
                {/* Header */}
                <header className="ad-header">
                    <div className="ad-header__left">
                        <button className="ad-mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>☰</button>
                        <div>
                            <h1 className="ad-header__title">Products</h1>
                            <p className="ad-header__sub">{filtered.length} of {products.length} products</p>
                        </div>
                    </div>
                    <button className="ad-btn ad-btn--primary" onClick={() => setAddModal(true)}>
                        + Add Product
                    </button>
                </header>

                {/* Stats */}
                <div className="ad-stats-grid">
                    <StatsCard label="Total Products" value={products.length} icon="📦" color="#6366f1" />
                    <StatsCard label="Featured" value={featuredCount} icon="⭐" color="#f59e0b" />
                    <StatsCard label="Flowers" value={typeCount("flower")} icon="🌸" color="#ec4899" />
                    <StatsCard label="Keychains" value={typeCount("keychain")} icon="🔑" color="#10b981" />
                    <StatsCard label="Accessories" value={typeCount("accessory")} icon="🧣" color="#10b981" />
                    <StatsCard label="Bookmarks" value={typeCount("bookmark")} icon="📖" color="#10b981" />
                </div>

                {/* Filters */}
                <div className="ad-filters">
                    <select className="ad-input ad-select ad-filter-select"
                        value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">All Types</option>
                        {PRODUCT_TYPES.map((t) => (
                            <option key={t} value={t}>{TYPE_EMOJI[t]} {t}</option>
                        ))}
                    </select>
                </div>

                {/* Product Grid / Table */}
                <div className="ad-table-wrapper">
                    {dataLoading ? (
                        <div className="ad-loading-state">
                            <Spinner size={36} />
                            <p>Loading products…</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="ad-empty-state">
                            <span>📭</span>
                            <p>
                                {products.length === 0
                                    ? "No products in Firestore yet — click \"+ Add Product\" to get started!"
                                    : "No products match your search."}
                            </p>
                        </div>
                    ) : (
                        <table className="ad-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name &amp; Description</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Featured</th>
                                    <th>Sort</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => (
                                    <tr key={p.id} className="ad-tr">
                                        <td data-label="Image">
                                            <div className="ad-thumb-wrapper">
                                                {p.imageUrl ? (
                                                    <img src={p.imageUrl} alt={p.name} className="ad-thumb"
                                                        onError={(e) => { e.target.style.display = "none"; }} />
                                                ) : (
                                                    <div className="ad-thumb-placeholder">🖼</div>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: 300 }} data-label="Product">
                                            <div className="ad-cell-primary">{p.name}</div>
                                            <div className="ad-cell-secondary ad-clamp">{p.description}</div>
                                        </td>
                                        <td data-label="Type">
                                            <span className="ad-type-badge">
                                                {TYPE_EMOJI[p.type]} {p.type}
                                            </span>
                                        </td>
                                        <td data-label="Price">
                                            <div className="ad-price">Rs. {p.price?.toLocaleString()}</div>
                                            {p.priceNote && (
                                                <div className="ad-cell-secondary">({p.priceNote})</div>
                                            )}
                                        </td>
                                        <td data-label="Featured">
                                            <button
                                                className={`ad-featured-toggle ${p.featured ? "ad-featured-toggle--on" : ""}`}
                                                onClick={() => toggleFeatured(p)}
                                                title={p.featured ? "Remove from featured" : "Add to featured"}
                                            >
                                                {p.featured ? "⭐ Yes" : "☆ No"}
                                            </button>
                                        </td>
                                        <td data-label="Sort">
                                            <span className="ad-sort-badge">{p.sortOrder ?? "—"}</span>
                                        </td>
                                        <td data-label="Actions">
                                            <div className="ad-actions">
                                                <button className="ad-action-btn ad-action-btn--edit"
                                                    onClick={() => setEditTarget(p)} title="Edit">✏️</button>
                                                <button className="ad-action-btn ad-action-btn--delete"
                                                    onClick={() => setDeleteTarget(p)} title="Delete">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            {/* ── Modals ───────────────────────────────────────── */}
            {addModal && (
                <ProductFormModal onSave={handleAdd} onClose={() => setAddModal(false)} loading={mutLoading} toast={toast} />
            )}
            {editTarget && (
                <ProductFormModal initial={editTarget} onSave={handleEdit}
                    onClose={() => setEditTarget(null)} loading={mutLoading} toast={toast} />
            )}
            {deleteTarget && (
                <ConfirmDeleteModal item={deleteTarget} onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)} loading={mutLoading} />
            )}
        </div>
    );
}
