import { React, useState } from 'react';
import { Routes, Route } from 'react-router-dom'; // No need to import Router here
import { UserProvider } from './pages/UserContext';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import './App.css';

function App() {
    // Functions used to buy and sell items
    const [cartItems, setCartItems] = useState([]);
    const [purchasedItems, setPurchasedItems] = useState({});
  
    const handleBuy = (item) => {
        setCartItems([...cartItems, item]);
        setPurchasedItems({ ...purchasedItems, [item.title]: true });
    };
  
    const handleRemove = (itemTitle) => {
        setCartItems(cartItems.filter(item => item.title !== itemTitle));
        setPurchasedItems({ ...purchasedItems, [itemTitle]: false });
    };

    // Function to clear the cart on checkout
    const handleCheckout = () => {
        setCartItems([]); // Clears all the items in the cart
        alert("You have successfully checked out!");
    };

    return (
        <UserProvider>
            <Routes>
                <Route path='/Cart' element={<Cart head="No Orders!" cartItems={cartItems} onRemove={handleRemove} onCheckout={handleCheckout}/>}/>
                <Route path='/Home' element={<Home headpara="Introducing Story Shelf, your go-to online store for storybooks. Discover a wide selection of captivating tales, delivered right to your doorstep. Have Fun Reading." headtwo="A better way to shop for books anywhere on Earth." headtwopara="This website offers you an elevated and more convenient shopping experience, allowing you to browse and make purchases with greater ease and satisfaction." btn="Shop" midscript="Up For Some Books?"/>}/>
                <Route path='/Shop' element={<Shop onBuy={handleBuy} purchasedItems={purchasedItems}/>}/>
                <Route path='/SignUp' element={<SignUp />} />
                <Route path='/Profile' element={<Profile />} />
                <Route path='/' element={<LogIn />} />
            </Routes>
        </UserProvider>
    );
}

export default App;