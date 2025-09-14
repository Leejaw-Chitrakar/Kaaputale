import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import I1 from "./assets/image1.png";
import I2 from "./assets/image2.png";
import I3 from "./assets/image3.png";
import I4 from "./assets/image4.png";

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
