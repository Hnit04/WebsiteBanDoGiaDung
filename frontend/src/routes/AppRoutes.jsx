
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "../components/Login/Login";
import Dashboard from '../pages/admin/Dashboard/Dashboard';
import AllProducts from '../pages/admin/Product/AllProducts';
import InsertProduct from '../pages/admin/Product/InsertProduct';
import DiscountProducts from "../pages/admin/Product/DiscountProducts";
import DiscountProductsInfo from "../pages/admin/Product/DiscountProductsInfo";
import AllVouchers from '../pages/admin/Voucher/AllVouchers';
import EditVoucher from "../pages/admin/Voucher/EditVoucher";
import CreateVoucher from "../pages/admin/Voucher/CreateVoucher";
import Orders from "../pages/admin/Order/Orders";
import Customer from '../pages/admin/Customer/Customers';
import CustomerInfo from "../pages/admin/Customer/CustomerInfo";
import Setting from '../pages/admin/Setting';
import Register from "../components/Register/Register";
import HomeCustomer from "../pages/customers/HomeCustomer";
import CartCustomer from "../pages/customers/CartCustomer";
import ProductsCustomer from "../pages/customers/ProductsCustomer";
import Blog from "../pages/customers/Blog";
import About from "../pages/customers/About";
import Contact from "../pages/customers/Contact";
import ProductsDetails from "../pages/customers/ProductsDetails";
import ProfileCustomer from "../components/headerCustomer/ProfileCustomer";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products/allProducts" element={<AllProducts />} />
        <Route path="/products/insertProduct" element={<InsertProduct />} />
        <Route path="/products/discountProducts" element={<DiscountProducts />} />
        <Route path="/products/discountProducts/discountInfo" element={<DiscountProductsInfo />} />
        <Route path="/vouchers/allVouchers" element={<AllVouchers />} />
        <Route path="/vouchers/allVouchers/editVoucher/:id" element={<EditVoucher />} />
        <Route path="/vouchers/createVoucher" element={<CreateVoucher />} />
        <Route path="/customers" element={<Customer />} />
        <Route path="/customers/infoCustomer/:id" element={<CustomerInfo />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/" element={<Navigate to="/home" replace />} />       
        <Route path="/home" element={<HomeCustomer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:productId" element={<ProductsDetails />} />
        <Route path="/cart" element={<CartCustomer />} />
        <Route path="/shop" element={<ProductsCustomer />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profileCustomer" element={<ProfileCustomer />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
