import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SellerLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow-1 pt-5 mt-4">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
