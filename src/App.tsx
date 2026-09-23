import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Portfolio from '@/pages/Portfolio';
import WorkDetail from '@/pages/WorkDetail';
import Contact from '@/pages/Contact';
import AdminRoute from '@/admin/AdminRoute';
import AdminLogin from '@/admin/pages/AdminLogin';
import AdminDashboard from '@/admin/pages/AdminDashboard';
import NewMakeupPost from '@/admin/pages/NewMakeupPost';
import NewCrochetPost from '@/admin/pages/NewCrochetPost';
import EditSiteContent from '@/admin/pages/EditSiteContent';
import Submissions from '@/admin/pages/Submissions';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site — never links to /admin/* */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
        <Route path="/portfolio/:discipline/:id" element={<PublicLayout><WorkDetail /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin — unlinked entry point, gated by AdminRoute */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route path="makeup/new" element={<NewMakeupPost />} />
          <Route path="makeup/:id/edit" element={<NewMakeupPost />} />
          <Route path="crochet/new" element={<NewCrochetPost />} />
          <Route path="crochet/:id/edit" element={<NewCrochetPost />} />
          <Route path="content" element={<EditSiteContent />} />
          <Route path="submissions" element={<Submissions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
