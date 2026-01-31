import { useState } from "react";
import { motion } from "framer-motion";
import Hero3D from "@/components/Hero3D";
import Header from "@/components/Header";
import HeroContent from "@/components/HeroContent";
import CoursesModal from "@/components/CoursesModal";
import ShopModal from "@/components/ShopModal";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";

function IndexContent() {
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-background overflow-hidden"
    >
      {/* Background gradient layers */}
      <div className="fixed inset-0 bg-gradient-dark" />
      <div className="fixed inset-0 fog-overlay" />
      
      {/* 3D Hero */}
      <Hero3D />
      
      {/* Header */}
      <Header 
        onOpenCourses={() => setIsCoursesOpen(true)} 
        onOpenShop={() => setIsShopOpen(true)} 
      />
      
      {/* Hero Content */}
      <HeroContent />
      
      {/* Modals */}
      <CoursesModal isOpen={isCoursesOpen} onClose={() => setIsCoursesOpen(false)} />
      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
      
      {/* Cart Drawer */}
      <CartDrawer />
    </motion.div>
  );
}

const Index = () => {
  return (
    <CartProvider>
      <IndexContent />
    </CartProvider>
  );
};

export default Index;
