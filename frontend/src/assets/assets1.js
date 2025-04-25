// services/productService.js
import p1 from "../assets/img/products/f1.jpg";
import p2 from "../assets/img/products/f2.jpg";
import p3 from "../assets/img/products/f3.jpg";
import p4 from "../assets/img/products/f4.jpg";
import p5 from "../assets/img/products/f5.jpg";
import p6 from "../assets/img/products/f6.jpg";
import p7 from "../assets/img/products/f7.jpg";
import p8 from "../assets/img/products/f8.jpg";

export const products = [
  { id: 1, image: p1, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
  { id: 2, image: p2, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
  { id: 3, image: p3, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
  { id: 4, image: p4, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
  { id: 5, image: p5, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
  { id: 6, image: p6, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
  { id: 7, image: p7, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
  { id: 8, image: p8, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
  { id: 9, image: p7, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
  { id: 10, image: p8, name: "Cartoons Astronaut T-Shirts",description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.", sizes: ["S", "M", "L", "XL"], price: 78000 },
];

export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 1000); // Giả lập thời gian chờ lấy dữ liệu từ backend
  });
};
