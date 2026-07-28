import { Link } from "react-router-dom";

function Navbar(){
    return(
        <nav className="flex gap-4 p-4 bg-slate-900">
        <Link to="/" className="text-white">Home</Link>
        <Link to="/cart" className="text-white">Cart</Link>
        <Link to="/login" className="text-white"> Login</Link>
        </nav>

    );
}

export default Navbar;