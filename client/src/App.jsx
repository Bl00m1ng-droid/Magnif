import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import AddProduct from './pages/AddProduct';
import Register from './pages/Register';
import Login from './pages/Login';


function App(){
  return(
     <BrowserRouter>
     <Navbar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetails/>} />
        <Route path="/add-product" element={<AddProduct/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
