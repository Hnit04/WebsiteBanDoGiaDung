import AppRoutes from "./routes/AppRoutes";
import { CartProvider } from "./pages/customers/CartContext/CartContext";
import ShopContextProvider from "./context/ShopContext";
function App() {
  return (
    <ShopContextProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </ShopContextProvider>

  );
}

export default App;
