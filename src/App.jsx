import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ParticleLayer from './components/UI/ParticleLayer';
import ThemeSwitcher from './components/UI/ThemeSwitcher';

import ToastContainer from './components/UI/ToastContainer';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const SellerProfile = lazy(() => import('./pages/SellerProfile'));
const HamperBuilder = lazy(() => import('./pages/HamperBuilder'));
const Community = lazy(() => import('./pages/Community'));
const Auth = lazy(() => import('./pages/Auth'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Credits = lazy(() => import('./pages/Credits'));
const Festivals = lazy(() => import('./pages/Festivals'));
const Collaborate = lazy(() => import('./pages/Collaborate'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-sm text-gray-500 font-body">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <Router>
                <ParticleLayer />
                <div className="flex flex-col min-h-screen relative" style={{ zIndex: 1 }}>
                  <Navbar />
                  <main className="flex-grow">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/seller/:id" element={<SellerProfile />} />
                        <Route path="/hamper" element={<HamperBuilder />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/login" element={<Auth />} />
                        <Route path="/register" element={<Auth mode="register" />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/credits" element={<Credits />} />
                        <Route path="/festivals" element={<Festivals />} />
                        <Route path="/collaborate" element={<Collaborate />} />
                        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
                        <Route path="/dashboard/seller" element={<SellerDashboard />} />
                        <Route path="/dashboard/admin" element={<AdminDashboard />} />
                        <Route path="*" element={
                          <div className="container py-20 text-center">
                            <div className="text-6xl mb-4">🎪</div>
                            <h1 className="text-3xl font-heading font-bold mb-2">Page Not Found</h1>
                            <p className="text-gray-500">This page doesn't exist yet!</p>
                          </div>
                        } />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>

                <ToastContainer />
                <ThemeSwitcher />
              </Router>
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
