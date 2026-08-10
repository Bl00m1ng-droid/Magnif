import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export function CartProvider({children}){
    const [cartItems,setCartItems] = useState([]);
    
    {/**the spread operator [...] - {..item} copies every 
        existing field from item into a new object and then quality:item.quality + 1
        overwrites just that one field
        this is how you update one field while keeping everything else without mutating the original*/}
    function addToCart(product){
        setCartItems((prevItems) =>{
            const existingItem = prevItems.find((item)=> item.id == product.id);

            if(existingItem){
                return prevItems.map((item) =>
                item.id === product.id
                ? {...item,quantity:item.quantity + 1}
                : item
            );
            }else{
                return [...prevItems, {...product,quantity:1}];
            }
        });
    }

    {/**filter() - returns a new array excluding the match
        always treat state as read only;replace it with a new copy instead of editing it */}
    function removeFromCart(productId){
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    }

    return(
        <CartContext.Provider value={{cartItems,addToCart,removeFromCart,clearCart,increaseQuantity,decreaseQuantity}}>
            {children}
        </CartContext.Provider>
    );

    function decreaseQuantity(productId){
        setCartItems((prevItems) =>
        prevItems.map((item) =>
        item.id === productId ? {...item,quantity:item.quantity - 1}: item)
    .filter((item) => item.quantity > 0)); 
    }

    function increaseQuantity(productId){
        setCartItems((prevItems) =>
        prevItems.map((item) =>
        item.id === productId ? {...item,quantity:item.quantity + 1}: item));

    }

    function clearCart(){
        setCartItems([]);
    }
}

export function useCart(){
    return useContext(CartContext);
}