import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/magnif-logo.jpg";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";


function Navbar() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  function handleLogout(){
    logout();
    clearCart();
    navigate("/");
  }

  return (
    <nav className="bg-[#0B1B42] px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Magnif" className="h-10 w-auto rounded" />
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/" className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">
            Shop
          </Link>
          <Link to="/cart" className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">
            Cart
          </Link>
          {user && (
            <Link to="/orders" className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">
              My Orders
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-2">
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
            <Link to="/login" className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#F2601C] text-white text-sm font-semibold rounded-full px-4 py-1.5 hover:bg-[#D9540F] transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;