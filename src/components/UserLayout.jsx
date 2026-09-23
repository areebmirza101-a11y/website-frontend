import { Outlet } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import UserFooter from './UserFooter';
import CartSidebar from './CartSidebar';
import AIChatWidget from './AIChatWidget';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <UserNavbar />
      <CartSidebar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <UserFooter />
      <AIChatWidget />
    </div>
  );
};

export default UserLayout;
