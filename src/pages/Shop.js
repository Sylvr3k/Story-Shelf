import React from "react";
import Footer from "./Footer";
import Card from "./card";
import Navbar from "./Navbar";

function Shop({ onBuy, purchasedItems }) {

        const items = [
          { pic: "./Jane Austen.jpg", title: "Jane Austin Books", para: "Jane Austen: The Complete Novels in One Sitting.", price: "$7.22 USD" },
          { pic: "./Mines.jpg", title: "What's Mine's Mine", para: "A Highland epic, (rated “the BEST of all MacDonald’s novels” by C S Lewis!) Complete and Unabridged.", price: "$31.21 USD" },
          { pic: "./Columbia.jpg", title: "The Curse of the Columbia River", para: "This story is from Jessie Ahuja’s series of novels taken from secret papers.", price: "$11.67 USD" },
          { pic: "./Johnny.jpg", title: "John Carter", para: "Barsoom Series (7 Novels) A Princess of Mars; Gods of Mars; Warlord of Mars; Thuvia, Maid of Mars; Chessmen of Mars; Master Mind of Mars; Fighting Man of Mars.", price: "$120.59 USD" },
          { pic: "./Cath.jpg", title: "Corkscrew You", para: "The most delicious small town, spicy, romcom novel of 2024 perfect for fans of grumpy sunshine romance novels.", price: "$21.24 USD" },
          { pic: "./Hidden.jpg", title: "The Hidden Storyteller", para: "The heart-wrenching new story from best-selling author of WWII historical fiction novels, perfect for fans of Heather Morris.", price: "$13.60 USD" },
          { pic: "./Salter.jpg", title: "100 Novels that Changed the World", para: " An inspiring journey through history’s most important literature, the perfect gift for book lovers and academics.", price: "$32.73 USD" },
          { pic: "./Scott.jpg", title: "The Novels of F. Scott Fitzgerald", para: "This Side of Paradise, The Beautiful and Damned, The Great Gatsby, Tender is the Night.", price: "$100.96 USD" },
          { pic: "./Yuri.jpg", title: "Three Novels", para: "Kingdom Cons, Signs Preceding the End of the World, The Transmigration of Bodies.", price: "$33.99 USD" },
          { pic: "./Wolv.jpg", title: "Wolverine", para: "Weapon X Omnibus: Marvel Classic Novels.", price: "$16.36 USD" },
          { pic: "./Stilly.jpg", title: "Still Life", para: "thrilling and page-turning crime fiction from the author of the bestselling Inspector Gamache novels.", price: "$15.04 USD" },
          { pic: "./Seas.jpg", title: "Harbors and High Seas", para: "Map Book and Geographical Guide to the Aubrey/Maturin Novels of Patrick O’Brian: An Atlas and Geographical Guide to the … Novels of Patrick O’Brian, Third Edition.", price: "$46.23 USD" },
          { pic: "./Measure.jpg", title: "Measure What Matters", para: "The Simple Idea that Drives 10x Growth.", price: "$18.05 USD" },
          { pic: "./Julia.jpg", title: "Phosphorescence", para: "The inspiring bestseller and multi award-winning book from the author of Bright Shining.", price: "$16.15 USD" },
          { pic: "./Dragon.jpg", title: "Dragon Age", para: "The First Five Graphic Novels.", price: "$30.91 USD" },
          { pic: "./Enola.jpg", title: "Enola Holmes", para: "The Graphic Novels: The Case of the Missing Marquess, The Case of the Left-Handed Lady, and The Case of the Bizarre Bouquets.", price: "$20.22 USD" }
        ];

    return(
        <>
        <Navbar/>
        <div className="Body">
      {items.map((item) => (
        <Card key={item.title} pic={item.pic} title={item.title} para={item.para} price={item.price}>
          <button onClick={() => onBuy(item)} disabled={!!purchasedItems[item.title]} style={{ backgroundColor: purchasedItems[item.title] ? 'grey' : 'rgba(13, 110, 264, 1)', color: '#fff', borderRadius: '5px', padding: '5px', fontWeight: '100', fontFamily: 'Century Gothic', width: '130px'}}>
            {purchasedItems[item.title] ? 'Sold' : 'Add to Cart'}
          </button>
        </Card>
      ))}
    </div>
        <Footer/>
        </>
    )
}

export default Shop;