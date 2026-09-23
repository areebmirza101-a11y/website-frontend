import { Routes, Route } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import UserHome from '../pages/UserHome';
import UserProducts from '../pages/UserProducts';
import UserProductDetails from '../pages/UserProductDetails';
import UserCheckout from '../pages/UserCheckout';
import CheckoutSuccess from '../pages/CheckoutSuccess';
import UserLogin from '../pages/UserLogin';
import UserAbout from '../pages/UserAbout';
import UserContact from '../pages/UserContact';
import UserOrders from '../pages/UserOrders';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';
import ShippingPolicy from '../pages/ShippingPolicy';
import ReturnRefund from '../pages/ReturnRefund';
import SizeGuide from '../pages/SizeGuide';
import UserProfile from '../pages/UserProfile';
import { NotFound, ServerError, Unauthorized, Forbidden, BadRequest } from '../pages/errors';

const mapStatusToError = (status) => {
  if (!status) return NotFound;
  if (status === 401) return Unauthorized;
  if (status === 403) return Forbidden;
  if (status === 400) return BadRequest;
  if (status >= 500) return ServerError;
  return NotFound;
};

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserHome />} />
        <Route path="products" element={<UserProducts />} />
        <Route path="products/:id" element={<UserProductDetails />} />
        <Route path="checkout" element={<UserCheckout />} />
        <Route path="checkout/success" element={<CheckoutSuccess />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsConditions />} />
        <Route path="shipping" element={<ShippingPolicy />} />
        <Route path="returns" element={<ReturnRefund />} />
        <Route path="size-guide" element={<SizeGuide />} />
        <Route path="login" element={<UserLogin />} />
        <Route path="about" element={<UserAbout />} />
        <Route path="contact" element={<UserContact />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="401" element={<Unauthorized />} />
        <Route path="403" element={<Forbidden />} />
        <Route path="400" element={<BadRequest />} />
        <Route path="500" element={<ServerError />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
