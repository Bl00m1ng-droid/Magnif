import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';

function App(){
  return(
     <BrowserRouter>
      <nav className="flex gap-4 p-4 bg-slate-900">
        <Link to="/" className="text-white">Home</Link>
        <Link to="/cart" className="text-white">Cart</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetails/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
