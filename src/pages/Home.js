import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import Footer from "./Footer";
import Navbar from './Navbar';

function Home(props) {
    const { user } = useContext(UserContext);

    return (
        <>
            <Navbar />
            <div className="HeadOne">
                <h1>Welcome, {user ? user.firstname : 'Guest'}.</h1>
                <p>{props.headpara}</p>
            </div>
            <div className="MiddleOne">
                <div className="Guard">
                    <img src="./spheres.png" height="270px" width="270px" alt="Spheres" />
                    <h1>{props.headtwo}</h1>
                    <p>{props.headtwopara}</p>
                    <div className="grace">
                        <button><Link to="/shop"><font color="white">{props.btn}</font></Link></button>
                        <p id="btnext">{props.midscript}</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Home;