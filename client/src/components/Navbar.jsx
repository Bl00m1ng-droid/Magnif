import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar(){
    const {user,logout} = useAuth();

    return(
        <nav className="flex gap-4 p-4 bg-slate-900 ">
        
        <Link to="/" 
        className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">Home</Link>
        <Link to="/cart"
         className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">Cart</Link>
        {user ? (
            <>
            <span className="text-white">Hi, {user.name}</span>
            {user.role === 'admin' && (
                <Link to="/admin/dashboard" 
                className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">Admin Dashboard</Link>
            )}
            <Link to="/orders" className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">My Orders</Link>
            <button onClick={logout} className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">Logout</button>
            
            </>
        ):(
            <>
            <Link to="/login" className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200"> Login</Link>
            <Link to="/register" className="relative text-white pb-1 after:content-[''] after:block after:w-full after:h-[2px] after:bg-orange-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100 hover:text-orange-200">Register</Link>
            </>
        )}
        </nav>

    );
}

export default Navbar;