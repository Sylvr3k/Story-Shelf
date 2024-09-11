import React from "react";

// The card used to make the book sales in the shop component
const Card = ({ pic, title, para, price, children }) => {
     return(
         <>
        <div className="card" style={{width: '18rem'}}>
             <img className="card-img-top" src={pic} alt="Card image cap"/>
             <div className="card-body">
               <h5 className="card-title">{title}</h5>
               <p className="card-text">{para}</p>
               <p className="card-mash">{price}</p>
               {children}
             </div>
        </div>
         </>
     )
}

export default Card;
