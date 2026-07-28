import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
function App(){
  return(
     <BrowserRouter>
     <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetails/>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
