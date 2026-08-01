import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar(){
    const {user,logout} = useAuth();

    return(
        <nav className="flex gap-4 p-4 bg-slate-900">
        <Link to="/" className="text-white">Home</Link>
        <Link to="/cart" className="text-white">Cart</Link>
        {user ? (
            <>
            <span className="text-white">Hi, {user.name}</span>
            <Link to="/orders" className="text-white">My Orders</Link>
            <button onClick={logout} className="text-white">Logout</button>
            
            </>
        ):(
            <>
            <Link to="/login" className="text-white"> Login</Link>
            <Link to="/register" className="text-white">Register</Link>
            </>
        )}
        </nav>

    );
}

export default Navbar;