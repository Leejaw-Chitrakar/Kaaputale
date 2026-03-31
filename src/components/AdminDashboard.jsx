import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LogOut,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Moon,
  Sun,
  LayoutGrid,
  Star,
  Package,
  Flower,
  Key,
  Bookmark,
  ChevronUp,
  ChevronDown,
  UploadCloud,
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import axios from "axios"; // Ensure axios is installed or use fetch
import { auth, db } from "../firebase";
import "../styles/AdminDashboard.css";

// ─── Constants ───────────────────────────────────────────────
const ADMIN_UIDS = (import.meta.env.VITE_ADMIN_UIDS || "")
  ?.split(",")
  .map((id) => id.trim())
  .filter(Boolean);
const APP_ID = "kaaputale-store";
const COLLECTION_PATH = `artifacts/${APP_ID}/public/data/products`;
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const PRODUCT_TYPES = ["flower", "keychain", "accessory", "bookmark"];

// ─── Utility Components ─────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`ad-toast ad-toast--${type}`}>
      <span className="ad-toast__icon">{type === "success" ? "✓" : "⚠"}</span>
      <span className="ad-toast__message">{message}</span>
      <button className="ad-toast__close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

// ─── Product Form Modal ───────────────────────────────────────
const ProductFormModal = ({ initial, onSave, onClose, loading, toast }) => {
  const isEdit = !!initial;
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
  const [uploading, setUploading] = useState(false);

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
    if (!form.price || isNaN(Number(form.price)))
      e.price = "Valid price required";
    if (!form.imageUrl.trim()) e.imageUrl = "Image URL is required";
    return e;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSave({
      ...form,
      price: Number(form.price),
      sortOrder: Number(form.sortOrder),
    });
  };

  return (
    <div className="ad-overlay" onClick={onClose}>
      <div
        className="ad-modal ad-modal--form"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ad-modal__header">
          <h2>{isEdit ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
          <button className="ad-icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="ad-modal__body ad-form-grid" onSubmit={handleSubmit}>
          {/* Left Column: Details */}
          <div className="ad-form-section">
            <h3 className="ad-section-title">Basic Info</h3>
            <div className="ad-form-group">
              <label className="ad-label">
                Product Name <span className="ad-required">*</span>
              </label>
              <input
                className={`ad-input ${errors.name ? "ad-input--error" : ""}`}
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
              {errors.name && (
                <span className="ad-field-error">{errors.name}</span>
              )}
            </div>

            <div className="ad-form-group">
              <label className="ad-label">Type</label>
              <select
                className="ad-input ad-select"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === "flower"
                      ? "🌸 flower"
                      : t === "keychain"
                        ? "🔑 keychain"
                        : t === "accessory"
                          ? "🎀 accessory"
                          : "📖 bookmark"}
                  </option>
                ))}
              </select>
            </div>

            <div className="ad-form-group">
              <label className="ad-label">
                Description <span className="ad-required">*</span>
              </label>
              <textarea
                className={`ad-input ad-textarea ${
                  errors.description ? "ad-input--error" : ""
                }`}
                placeholder="Describe your product..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
              {errors.description && (
                <span className="ad-field-error">{errors.description}</span>
              )}
            </div>

            <div className="ad-form-row">
              <div className="ad-form-group">
                <label className="ad-label">
                  Price (Rs.) <span className="ad-required">*</span>
                </label>
                <input
                  className={`ad-input ${errors.price ? "ad-input--error" : ""}`}
                  placeholder="250"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
                {errors.price && (
                  <span className="ad-field-error">{errors.price}</span>
                )}
              </div>
              <div className="ad-form-group">
                <label className="ad-label">Price Note</label>
                <input
                  className="ad-input"
                  placeholder="e.g. \per piece\"
                  value={form.priceNote}
                  onChange={(e) => set("priceNote", e.target.value)}
                />
              </div>
            </div>

            <div className="ad-form-row">
              <div className="ad-form-group">
                <label className="ad-label">Sort Order</label>
                <input
                  type="number"
                  className="ad-input"
                  value={form.sortOrder}
                  onChange={(e) => set("sortOrder", e.target.value)}
                />
              </div>
              <div className="ad-form-group">
                <label className="ad-label">Featured on Home?</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 40,
                  }}
                >
                  <label className="ad-toggle">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => set("featured", e.target.checked)}
                    />
                    <span className="ad-toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image Preview & Upload */}
          <div className="ad-form-section">
            <h3 className="ad-section-title">Product Image</h3>
            <div className="ad-form-group">
              <label className="ad-label">
                Image Source <span className="ad-required">*</span>
              </label>

              <div
                style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
              >
                <input
                  className={`ad-input ${errors.imageUrl ? "ad-input--error" : ""}`}
                  placeholder="Paste URL or click Upload →"
                  style={{ flex: 1 }}
                  value={form.imageUrl}
                  onChange={(e) => {
                    set("imageUrl", e.target.value);
                    setImgError(false);
                  }}
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
                  {uploading ? "..." : <UploadCloud size={20} />}
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                    disabled={uploading}
                    accept="image/*"
                  />
                </label>
              </div>

              {errors.imageUrl && (
                <span className="ad-field-error">{errors.imageUrl}</span>
              )}
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Using <strong>ImgBB API</strong> for auto-upload.
              </span>
            </div>

            <div className="ad-image-preview" style={{ height: "180px" }}>
              {form.imageUrl && !imgError ? (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="ad-image-placeholder">
                  {imgError
                    ? "❌ Invalid Image URL"
                    : "Image preview will appear here"}
                </div>
              )}
            </div>

            <div className="ad-preview-card">
              <span className="ad-section-title">Card Preview</span>
              <div className="ad-card-mock">
                <div
                  className="ad-card-mock-img"
                  style={{ backgroundImage: `url(${form.imageUrl})` }}
                />
                <div className="ad-card-mock-body">
                  <div className="ad-card-mock-type">{form.type}</div>
                  <div className="ad-card-mock-title">
                    {form.name || "Product Name"}
                  </div>
                  <div className="ad-card-mock-price">
                    Rs. {form.price || "000"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="ad-modal__footer">
          <button className="ad-btn ad-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ad-btn ad-btn--primary"
            onClick={handleSubmit}
            disabled={loading || uploading}
          >
            {loading ? "..." : isEdit ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Admin Dashboard ──────────────────────────────────
export default function AdminDashboard({ onExit }) {
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutLoading, setMutLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [addModal, setAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [theme, setTheme] = useState("dark");

  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && ADMIN_UIDS.includes(u.uid)) {
        setUser(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, COLLECTION_PATH),
      orderBy("updatedAt", "desc"),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const prodData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(prodData);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore Error:", err);
        toast("Access Denied: Check your Firestore rules!", "error");
        setLoading(false);
      },
    );
    return unsub;
  }, [user, toast]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
      if (!ADMIN_UIDS.includes(res.user.uid)) {
        await signOut(auth);
        setLoginError("You are not registered as an Admin.");
      }
    } catch (err) {
      setLoginError("Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdd = async (data) => {
    setMutLoading(true);
    try {
      await addDoc(collection(db, COLLECTION_PATH), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      toast("Product added successfully!");
      setAddModal(false);
    } catch (err) {
      toast("Failed to add product", "error");
    } finally {
      setMutLoading(false);
    }
  };

  const handleEdit = async (data) => {
    setMutLoading(true);
    try {
      const { id, ...rest } = data;
      await updateDoc(doc(db, COLLECTION_PATH, id), {
        ...rest,
        updatedAt: serverTimestamp(),
      });
      toast("Product updated!");
      setEditTarget(null);
    } catch (err) {
      toast("Error updating", "error");
    } finally {
      setMutLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setMutLoading(true);
    try {
      await deleteDoc(doc(db, COLLECTION_PATH, deleteTarget.id));
      toast("Product deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast("Delete failed", "error");
    } finally {
      setMutLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = p.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesType = filterType === "all" || p.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return b.updatedAt?.seconds - a.updatedAt?.seconds;
        if (sortBy === "oldest")
          return a.updatedAt?.seconds - b.updatedAt?.seconds;
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "sorted") return a.sortOrder - b.sortOrder;
        return 0;
      });
  }, [products, search, filterType, sortBy]);

  if (loading) {
    return (
      <div className="ad-root ad-root--loading">
        <div className="ad-loading-spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ad-login-screen ad-root" data-theme={theme}>
        <div className="ad-login-card">
          <div className="ad-login-logo">
            <span className="ad-login-icon">🗝️</span>
            <h1>Admin Panel</h1>
            <p>Enter your credentials to manage Kaaputale</p>
          </div>
          <form className="ad-login-form" onSubmit={handleLogin}>
            <div className="ad-form-group">
              <label className="ad-label">Email Address</label>
              <input
                type="email"
                className="ad-input"
                placeholder="admin@kaaputale.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Password</label>
              <input
                type="password"
                className="ad-input"
                placeholder="••••••••"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
              />
            </div>
            {loginError && (
              <div className="ad-login-error">⚠️ {loginError}</div>
            )}
            <button
              type="submit"
              className="ad-btn ad-btn--primary ad-btn--full"
              disabled={loginLoading}
            >
              {loginLoading ? "..." : "Sign In"}
            </button>
          </form>
          <div className="ad-login-footer">
            <br />
            <button
              className="ad-btn ad-btn--ghost ad-btn--sm ad-btn--full"
              onClick={() => (window.location.hash = "")}
            >
              ← Back to Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-root" data-theme={theme}>
      {/* Sidebar */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar__header">
          <div className="ad-sidebar__logo">
            <span>🎨</span>
            <span>Kaaputale</span>
          </div>
        </div>
        <nav className="ad-sidebar__nav">
          <div className="ad-nav-item ad-nav-item--active">
            <LayoutGrid size={18} />
            Products
          </div>
        </nav>
        <div className="ad-sidebar__footer">
          <div className="ad-user-chip">
            <div className="ad-user-avatar">L</div>
            <div className="ad-user-email">{user.email}</div>
          </div>
          <button
            className="ad-nav-item"
            style={{ width: "100%", border: "none", background: "none" }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
          <button
            className="ad-nav-item"
            style={{ width: "100%", border: "none", background: "none" }}
            onClick={() => signOut(auth)}
          >
            <LogOut size={18} />
            Sign Out
          </button>
          <button
            className="ad-nav-item"
            style={{ width: "100%", border: "none", background: "none" }}
            onClick={() => (window.location.hash = "")}
          >
            Back to Site
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ad-main">
        <header className="ad-header">
          <div>
            <h1 className="ad-header__title">Products</h1>
            <p className="ad-header__sub">
              {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <button
            className="ad-btn ad-btn--primary"
            onClick={() => setAddModal(true)}
          >
            <Plus size={18} /> Add Product
          </button>
        </header>

        {/* Stats Grid */}
        <section className="ad-stats-grid">
          <div className="ad-stat-card">
            <div className="ad-stat-icon">📦</div>
            <div>
              <div className="ad-stat-value">{products.length}</div>
              <div className="ad-stat-label">Total Products</div>
            </div>
          </div>
          <div
            className="ad-stat-card"
            style={{ borderLeftColor: "var(--warning)" }}
          >
            <div className="ad-stat-icon">⭐</div>
            <div>
              <div className="ad-stat-value">
                {products.filter((p) => p.featured).length}
              </div>
              <div className="ad-stat-label">Featured</div>
            </div>
          </div>
          <div className="ad-stat-card" style={{ borderLeftColor: "#ec4899" }}>
            <div className="ad-stat-icon">🌸</div>
            <div>
              <div className="ad-stat-value">
                {products.filter((p) => p.type === "flower").length}
              </div>
              <div className="ad-stat-label">Flowers</div>
            </div>
          </div>
          <div className="ad-stat-card" style={{ borderLeftColor: "#10b981" }}>
            <div className="ad-stat-icon">🔑</div>
            <div>
              <div className="ad-stat-value">
                {products.filter((p) => p.type === "keychain").length}
              </div>
              <div className="ad-stat-label">Keychains</div>
            </div>
          </div>
          <div className="ad-stat-card" style={{ borderLeftColor: "#f43f5e" }}>
            <div className="ad-stat-icon">🎀</div>
            <div>
              <div className="ad-stat-value">
                {products.filter((p) => p.type === "accessory").length}
              </div>
              <div className="ad-stat-label">Accessories</div>
            </div>
          </div>
          <div className="ad-stat-card" style={{ borderLeftColor: "#3b82f6" }}>
            <div className="ad-stat-icon">📖</div>
            <div>
              <div className="ad-stat-value">
                {products.filter((p) => p.type === "bookmark").length}
              </div>
              <div className="ad-stat-label">Bookmarks</div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="ad-filters">
          <div className="ad-search-wrapper">
            <Search className="ad-search-icon" size={16} />
            <input
              type="text"
              className="ad-input ad-search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="ad-input ad-filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}s
              </option>
            ))}
          </select>
          <select
            className="ad-input ad-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="sorted">Custom Sort Order</option>
          </select>
        </section>

        {/* Table */}
        <section className="ad-table-wrapper">
          <table className="ad-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Img</th>
                <th>Product Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Featured</th>
                <th>Sort</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="ad-tr">
                  <td>
                    <div
                      className="ad-table-thumb"
                      style={{ backgroundImage: `url(${p.imageUrl})` }}
                    />
                  </td>
                  <td>
                    <div className="ad-cell-primary">{p.name}</div>
                    <div className="ad-cell-secondary">
                      {p.description.substring(0, 40)}...
                    </div>
                  </td>
                  <td>
                    <span className="ad-status-badge">
                      {p.type === "flower"
                        ? "🌸"
                        : p.type === "keychain"
                          ? "🔑"
                          : p.type === "accessory"
                            ? "🎀"
                            : "📖"}{" "}
                      {p.type}
                    </span>
                  </td>
                  <td>
                    <div className="ad-price">Rs. {p.price}</div>
                    {p.priceNote && (
                      <div className="ad-cell-secondary">{p.priceNote}</div>
                    )}
                  </td>
                  <td>
                    {p.featured ? (
                      <span
                        className="ad-status-badge"
                        style={{
                          background: "var(--accent-glow)",
                          color: "var(--accent)",
                        }}
                      >
                        ⭐ YES
                      </span>
                    ) : (
                      <span className="ad-status-badge">No</span>
                    )}
                  </td>
                  <td>
                    <div
                      style={{ display: "flex", gap: 3, alignItems: "center" }}
                    >
                      <span>{p.sortOrder}</span>
                    </div>
                  </td>
                  <td>
                    <div className="ad-actions">
                      <button
                        className="ad-action-btn"
                        onClick={() => setEditTarget(p)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="ad-action-btn ad-action-btn--delete"
                        onClick={() => setDeleteTarget(p)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan="7">
                    <div className="ad-empty-state">
                      <span>📪</span>
                      No products in Firestore yet — click "+ Add Product" to
                      get started!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* Modals */}
      {addModal && (
        <ProductFormModal
          onSave={handleAdd}
          onClose={() => setAddModal(false)}
          loading={mutLoading}
          toast={toast}
        />
      )}
      {editTarget && (
        <ProductFormModal
          initial={editTarget}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
          loading={mutLoading}
          toast={toast}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="ad-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="ad-modal ad-modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ad-modal__header ad-modal__header--danger">
              <span className="ad-modal__danger-icon">🗑️</span>
              <h2>Delete Product?</h2>
            </div>
            <div className="ad-modal__body">
              <p className="ad-modal__danger-text">
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.name}</strong>? This action cannot be
                undone.
              </p>
            </div>
            <div className="ad-modal__footer">
              <button
                className="ad-btn ad-btn--ghost"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="ad-btn ad-btn--danger"
                onClick={handleDelete}
                disabled={mutLoading}
              >
                {mutLoading ? "..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="ad-toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() =>
              setToasts((prev) => prev.filter((toast) => toast.id !== t.id))
            }
          />
        ))}
      </div>
    </div>
  );
}
