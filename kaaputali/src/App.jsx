import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import I1 from "./assets/flowers/flower1.png";
import I2 from "./assets/flowers/flower2.png";
import I3 from "./assets/flowers/flower3.png";
import I4 from "./assets/flowers/flower4.png";
import I5 from "./assets/flowers/flower5.png";
import I6 from "./assets/flowers/flower6.png";
import I7 from "./assets/flowers/flower7.png";
import I8 from "./assets/flowers/flower8.png";
import I9 from "./assets/flowers/flower9.png";
import K1 from "./assets/keyrings/keyring1.png";
import K2 from "./assets/keyrings/keyring2.png";
import W1 from "./assets/wearables/wearable1.png";
import W2 from "./assets/wearables/wearable2.png";
import W3 from "./assets/wearables/wearable3.png";
function App() {
  const products = [
    {
      id: 1,
      type: "flower",
      name: "Soft Pink Tulip",
      description:
        "A delicate, handcrafted wool tulip in a soft pink hue, complemented by a sprig of lavender and wrapped in elegant paper. This beautiful, handmade flower is a timeless piece of art that will never wilt.",
      imageUrl: I1,
      price: 0,
    },
    {
      id: 2,
      name: "Pastel Trio Bouquet",
      type: "flower",
      description:
        "A charming bouquet of three handcrafted wool flowers in soft, soothing pastel colors. This arrangement is a beautiful and thoughtful gift for any occasion, capturing a timeless and gentle beauty.",
      imageUrl: I2,
      price: 0,
    },
    {
      id: 3,
      name: "Peach Petal Bouquet",
      type: "flower",
      description:
        "A beautiful, handcrafted wool rose in a soft peach hue, beautifully wrapped in an elegant dark paper. This piece captures a timeless and gentle beauty that will never wilt.",
      imageUrl: I3,
      price: 0,
    },
    {
      id: 4,
      name: "Lavender Blossom Bouquet",
      type: "flower",
      description:
        "An elegant and minimalist bouquet, featuring a stunning handcrafted wool flower in classic white, paired with delicate sprigs of lavender. The arrangement is wrapped in sleek, dark paper for a striking contrast, making it a sophisticated and timeless piece of art.",
      imageUrl: I4,
      price: 0,
    },
    {
      id: 5,
      name: "Blue Floral Melody",
      type: "flower",
      description:
        "A vibrant bouquet featuring bold blue blossoms and a pale pink tulip, complemented by small white filler flowers. Wrapped in classic black paper, this arrangement is a modern and artistic statement piece.",
      imageUrl: I5,
      price: 0,
    },
    // {
    //   id: 6,
    //   name: "Moonlit Blossom Bouquet",
    //   type: "flower",
    //   description:
    //     "A magical bouquet of handcrafted woolen flowers in soft, celestial shades of blue and cream, illuminated by delicate fairy lights. This unique arrangement is a stunning and enchanting piece that brings warmth and wonder to any space.",
    //   imageUrl: I6,
    //   price: 0,
    // },
    {
      id: 7,
      name: "Scarlet Bloom",
      type: "flower",
      description:
        "This striking bouquet showcases a single, vibrant scarlet rose, handcrafted from soft wool. The bold red stands out against the sleek black and gold-trimmed wrap, creating a dramatic and unforgettable gift.",
      imageUrl: I7,
      price: 0,
    },
    {
      id: 8,
      name: "White Blossom",
      type: "flower",
      description: "This unique bouquet features a soft, white crocheted flower with a vibrant green stem, beautifully contrasted by the bold black and gold-trimmed wrap. It’s an artistic and lasting piece that makes a powerful statement.",
      imageUrl: I8,
      price: 0,
    },
    {
      id: 9,
      name: "Fairy Glow Bouquet",
      type: "flower",
      description:
        "Our Fairy Glow Bouquet is a one-of-a-kind arrangement featuring a mix of wool blossoms and twinkling fairy lights. It’s perfect for adding a touch of magic and warmth to any room, serving as a beautiful and unique piece of art that lasts forever.",
      imageUrl: I9,
      price: 0,
    },
    {
      id: 10,
      name: "Evil Eye Keychain",
      type: "keychain",
      description: "A charming and protective evil eye charm, meticulously handcrafted from soft wool. Featuring a beautiful color combination of light blue, white, and a striking black center, this keychain is perfect for warding off negative energy while adding a unique touch to your belongings.",
      imageUrl: K1,
      price: 0,
    },
    {
      id: 11,
      name: "The Straw Hat",
      type: "keychain",
      description: "A collection of meticulously handcrafted woolen flowers, each one a unique character in a grand adventure. This bouquet represents the powerful and diverse bonds of friendship, just like the members of the Straw Hat Grand Fleet. Perfect for the ultimate One Piece fan.",
      imageUrl: K2,
      price: 0,
    },
    {
    id: 12,
    name: "Yellow Earmuffs & Gloves Set",
    type: "accessory",
    description: "Adorable, plush pink and white fingerless gloves, tied with delicate white bows. These wrist warmers are perfect for keeping hands cozy and stylish while allowing full freedom of movement for your fingers.",
    imageUrl: W1,
    price: 0,
  },
  {
    id: 13,
    name: "Pink Fingerless Gloves",
    type: "accessory",
    description: "A matching set of ultra-soft, chenille-style earmuffs and fingerless gloves in cheerful white and pastel yellow. This cozy set includes a matching hair scrunchie, making it the perfect gift for staying warm and bright.",
    imageUrl: W2,
    price: 0,
  },
  {id: 14,
    name: "Midnight Rose Wrist Warmers",
    type: "accessory",
    description: "Elegant, hand-crocheted black fingerless gloves featuring bold magenta accents and matching magenta bows. Made from a soft, plush yarn for warmth and a dramatic, stylish look.",
    imageUrl: W3,
    price: 0, 
    }
  ];
  const [modalProduct, setModalProduct] = useState(null);

  const showProductDetails = (product) => {
    setModalProduct(product);
  };

  const closeModal = () => {
    setModalProduct(null);
  };

  return (
    <HomePage
      products={products}
      modalProduct={modalProduct}
      showProductDetails={showProductDetails}
      closeModal={closeModal}
    />
  );
}

export default App;
