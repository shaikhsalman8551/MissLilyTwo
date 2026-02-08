import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// User Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import ContactUs from './pages/ContactUs';
import WhereWeAre from './pages/WhereWeAre';
import Showcase from './pages/Showcase';
import ProductDetails from './ProductDetails.jsx';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProductsManagement from './admin/ProductsManagement';
import CategoriesManagement from './admin/CategoriesManagement';
import InstagramManagement from './admin/InstagramManagement';
import BusinessHoursManagement from './admin/BusinessHoursManagement';
import InquiryManagement from './admin/InquiryManagement';
import ReportsPage from './admin/ReportsPage';
import ContactSettings from './admin/ContactSettings';
import ContactMessagesPage from './admin/ContactMessagesPage';

function App() {
  if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Show header for non-admin routes */}
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/*"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/where-we-are" element={<WhereWeAre />} />
                    <Route path="/showcase" element={<Showcase />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                 
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<ProductsManagement />} />
                    <Route path="/admin/categories" element={<CategoriesManagement />} />
                    <Route path="/admin/inquiries" element={<InquiryManagement />} />
                    <Route path="/admin/contact-messages" element={<ContactMessagesPage />} />
                    <Route path="/admin/reports" element={<ReportsPage />} />
                    <Route path="/admin/contact-settings" element={<ContactSettings />} />
                    <Route path="/admin/business-hours" element={<BusinessHoursManagement />} />
                    <Route path="/admin/instagram" element={<InstagramManagement />} />

                    {/* 404 Page */}
                    <Route path="*" element={
                      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                        <a href="/" className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
                          Go Home
                        </a>
                      </div>
                    } />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
