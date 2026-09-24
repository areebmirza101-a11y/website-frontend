import { Routes, Route } from 'react-router-dom';
import ProtectedAdminRoute from '../components/admin/ProtectedAdminRoute';
import AdminLayout from '../components/admin/AdminLayout';
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import ProductForm from '../pages/admin/ProductForm';
import AdminCategories from '../pages/admin/AdminCategories';
import CategoryForm from '../pages/admin/CategoryForm';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminHomeSettings from '../pages/admin/AdminHomeSettings';
import AdminSales from '../pages/admin/AdminSales';
import AdminBlogs from '../pages/admin/AdminBlogs';
import AdminMessages from '../pages/admin/AdminMessages';
import AdminSizeGuide from '../pages/admin/AdminSizeGuide';
import AdminTestimonials from '../pages/admin/AdminTestimonials';
import TestimonialForm from '../pages/admin/TestimonialForm';
import { NotFound, ServerError, Unauthorized, Forbidden, BadRequest } from '../pages/errors';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/:id/edit" element={<CategoryForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="size-guides" element={<AdminSizeGuide />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="home-settings" element={<AdminHomeSettings />} />
        <Route path="sales" element={<AdminSales />} />
        <Route path="blogs" element={<AdminBlogs />} />
         <Route path="messages" element={<AdminMessages />} />
         <Route path="testimonials" element={<AdminTestimonials />} />
         <Route path="testimonials/new" element={<TestimonialForm />} />
         <Route path="testimonials/:id/edit" element={<TestimonialForm />} />
         <Route path="401" element={<Unauthorized homePath="/admin" loginPath="/admin/login" />} />
         <Route path="403" element={<Forbidden homePath="/admin" />} />
         <Route path="400" element={<BadRequest homePath="/admin" />} />
         <Route path="500" element={<ServerError homePath="/admin" />} />
         <Route path="*" element={<NotFound homePath="/admin" browsePath="/admin/products" />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
