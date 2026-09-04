import { React, useState } from 'react';
import { Routes, Route } from 'react-router-dom'; // No need to import Router here
import { UserProvider } from './pages/UserContext';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import AdminHub from './pages/AdminHub';
import DashboardBooks from './pages/DashboardBooks';
import DashboardSales from './pages/DashboardSales';
import DashboardPurchases from './pages/DashboardPurchases';
import DashboardBooksList from './pages/DashboardBooksList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function App() {
    // Functions used to buy and sell items
    const [cartItems, setCartItems] = useState([]);
    const [purchasedItems, setPurchasedItems] = useState({});
  
    const handleBuy = (item) => {
        setCartItems(prev => [...prev, item]);
        setPurchasedItems({ ...purchasedItems, [item._id]: true});
    };
  
    const handleRemove = (id) => {
        setCartItems(prev =>
            prev.filter(item => item._id !== id)
        );
    
        setPurchasedItems(prev => {
            const updated = { ...prev };
            delete updated[id]; // remove from purchased
            return updated;
        });
    };

    // Function to clear the cart on checkout
    const handleCheckout = () => {
        setCartItems([]); // Clears all the items in the cart
        alert("You have successfully checked out!");
    };

    const handleAddBook = (book) => {
        const newBook = { ...book, id: Date.now() }; // simple unique id
        setItems([...items, newBook]);
      };    

    return (
        <UserProvider>
            <Routes>
                <Route path='/Cart' element={<Cart head="No Orders!" cartItems={cartItems} onRemove={handleRemove} onCheckout={handleCheckout}/>}/>
                <Route path='/Home' element={<Home headpara="Introducing Story Shelf, your go-to online store for storybooks. Discover a wide selection of captivating tales, delivered right to your doorstep. Have Fun Reading." headtwo="A better way to shop for books anywhere on Earth." headtwopara="This website offers you an elevated and more convenient shopping experience, allowing you to browse and make purchases with greater ease and satisfaction." btn="Shop" midscript="Up For Some Books?"/>}/>
                <Route path='/Shop' element={<Shop onBuy={handleBuy} purchasedItems={purchasedItems}/>}/>
                <Route path='/AdminHub' element={<AdminHub onAddBook={handleAddBook}/>} />
                <Route path='/DashboardBooks' element={<DashboardBooks onAddBook={handleAddBook}/>} />
                <Route path='/DashboardBooksList' element={<DashboardBooksList onAddBook={handleAddBook}/>} />
                <Route path='/DashboardSales' element={<DashboardSales/>} />
                <Route path='/DashboardPurchases' element={<DashboardPurchases/>} />
                <Route path='/ForgotPassword' element={<ForgotPassword/>} />
                <Route path='/reset-password/:token' element={<ResetPassword/>} />
                <Route path='/SignUp' element={<SignUp />} />
                <Route path='/Profile' element={<Profile />} />
                <Route path='/' element={<LogIn />} />
            </Routes>
        </UserProvider>
    );
}

export default App;