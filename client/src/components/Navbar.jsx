import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/magnif-logo.jpg";

const linkClass =
  "relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200";

function Navbar() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    clearCart();
    navigate("/");
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="bg-[#0B1B42] px-6 py-3 shadow-md relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src={logo} alt="Magnif" className="h-10 w-auto rounded" />
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/" className={linkClass}>Shop</Link>
            <Link to="/cart" className={linkClass}>Cart</Link>
            {user && <Link to="/orders" className={linkClass}>My Orders</Link>}
            {user?.role === "admin" && (
              <Link to="/admin/dashboard" className={linkClass}>Admin Dashboard</Link>
            )}
          </div>
        </div>

        {/* Desktop user area */}
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#4E9B02] text-white font-bold text-sm flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-white text-sm">Hi, {user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-white border border-white/30 rounded-full px-4 py-1.5 hover:border-[#F2601C] hover:text-[#F2601C] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Login</Link>
              <Link
                to="/register"
                className="bg-[#F2601C] text-white text-sm font-semibold rounded-full px-4 py-1.5 hover:bg-[#D9540F] transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden mt-4 pb-2 flex flex-col gap-4 border-t border-white/10 pt-4">
          <Link to="/" onClick={closeMenu} className="text-white text-sm font-medium">Shop</Link>
          <Link to="/cart" onClick={closeMenu} className="text-white text-sm font-medium">Cart</Link>
          {user && (
            <Link to="/orders" onClick={closeMenu} className="text-white text-sm font-medium">My Orders</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" onClick={closeMenu} className="text-white text-sm font-medium">Admin Dashboard</Link>
          )}

          <div className="border-t border-white/10 pt-4">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#4E9B02] text-white font-bold text-sm flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm">Hi, {user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-white border border-white/30 rounded-full px-4 py-1.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={closeMenu} className="text-white text-sm font-medium">Login</Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="bg-[#F2601C] text-white text-sm font-semibold rounded-full px-4 py-2 text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;