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
function App() {
  const products = [
    {
      id: 1,
      name: "Soft Pink Tulip",
      description:
        "A delicate, handcrafted wool tulip in a soft pink hue, complemented by a sprig of lavender and wrapped in elegant paper. This beautiful, handmade flower is a timeless piece of art that will never wilt.",
      imageUrl: I1,
    },
    {
      id: 2,
      name: "Pastel Trio Bouquet",
      description:
        "A charming bouquet of three handcrafted wool flowers in soft, soothing pastel colors. This arrangement is a beautiful and thoughtful gift for any occasion, capturing a timeless and gentle beauty.",
      imageUrl: I2,
    },
    {
      id: 3,
      name: "Peach Petal Bouquet",
      description:
        "A beautiful, handcrafted wool rose in a soft peach hue, beautifully wrapped in an elegant dark paper. This piece captures a timeless and gentle beauty that will never wilt.",
      imageUrl: I3,
    },
    {
      id: 4,
      name: "Lavender Blossom Bouquet",
      description:
        "An elegant and minimalist bouquet, featuring a stunning handcrafted wool flower in classic white, paired with delicate sprigs of lavender. The arrangement is wrapped in sleek, dark paper for a striking contrast, making it a sophisticated and timeless piece of art.",
      imageUrl: I4,
    },
    {
      id: 5,
      name: "Blue Floral Melody",
      description:
        "A vibrant bouquet featuring bold blue blossoms and a pale pink tulip, complemented by small white filler flowers. Wrapped in classic black paper, this arrangement is a modern and artistic statement piece.",
      imageUrl: I5,
    },
    // {
    //   id: 6,
    //   name: "Moonlit Blossom Bouquet",
    //   description:
    //     "A magical bouquet of handcrafted woolen flowers in soft, celestial shades of blue and cream, illuminated by delicate fairy lights. This unique arrangement is a stunning and enchanting piece that brings warmth and wonder to any space.",
    //   imageUrl: I6,
    // },
    {
      id: 7,
      name: "Scarlet Bloom",
      description:
        "This striking bouquet showcases a single, vibrant scarlet rose, handcrafted from soft wool. The bold red stands out against the sleek black and gold-trimmed wrap, creating a dramatic and unforgettable gift.",
      imageUrl: I7,
    },
    {
      id: 8,
      name: "White Blossom",
      description: "This unique bouquet features a soft, white crocheted flower with a vibrant green stem, beautifully contrasted by the bold black and gold-trimmed wrap. It’s an artistic and lasting piece that makes a powerful statement.",
      imageUrl: I8,
    },
    {
      id: 9,
      name: "Fairy Glow Bouquet",
      description:
        "Our Fairy Glow Bouquet is a one-of-a-kind arrangement featuring a mix of wool blossoms and twinkling fairy lights. It’s perfect for adding a touch of magic and warmth to any room, serving as a beautiful and unique piece of art that lasts forever.",
      imageUrl: I9,
    },
    {
      id: 10,
      name: "Evil Eye Keychain",
      description: "A charming and protective evil eye charm, meticulously handcrafted from soft wool. Featuring a beautiful color combination of light blue, white, and a striking black center, this keychain is perfect for warding off negative energy while adding a unique touch to your belongings.",
      imageUrl: K1,
    },
    {
      id: 11,
      name: "The Straw Hat",
      description: "A collection of meticulously handcrafted woolen flowers, each one a unique character in a grand adventure. This bouquet represents the powerful and diverse bonds of friendship, just like the members of the Straw Hat Grand Fleet. Perfect for the ultimate One Piece fan.",
      imageUrl: K2,
    },
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
