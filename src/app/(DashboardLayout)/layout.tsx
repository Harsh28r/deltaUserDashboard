"use client";
import React, { useContext, useState } from "react";
// import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Header from "./layout/vertical/header/Header";
import { Customizer } from "./layout/shared/customizer/Customizer";
import { CustomizerContext } from "../context/CustomizerContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ModuleSidebar from "../components/auth/ModuleSidebar";
import MobileSidebar from "./layout/vertical/sidebar/MobileSidebar";
import { ModuleProvider } from "../context/ModuleContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeLayout, isLayout } = useContext(CustomizerContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  return (
    <ProtectedRoute>
      <ModuleProvider>
        <div className="flex w-full min-h-screen">
          {/* Desktop Sidebar */}
          {activeLayout == "vertical" ? <ModuleSidebar /> : null}
          
          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div 
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed left-0 top-0 h-full w-80 max-w-[90vw] z-50">
                <MobileSidebar onClose={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          )}
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen main-content w-full">
            {/* Top Header */}
            {activeLayout == "horizontal" ? (
              <Header layoutType="horizontal" />
            ) : (
              <Header 
                layoutType="vertical" 
                onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            )}

            {/* Body Content */}
            <main className="flex-1 bg-lightgray dark:bg-dark w-full overflow-x-hidden">
              <div
                className={`${
                  isLayout == "full"
                    ? "w-full py-4 sm:py-6 lg:py-[30px] px-3 sm:px-4 md:px-6 lg:px-[30px]"
                    : "container mx-auto py-4 sm:py-6 lg:py-[30px] px-3 sm:px-4 md:px-6"
                } ${activeLayout == "horizontal" ? "xl:mt-3" : ""} w-full max-w-full`}
              >
                {children}
              </div>
            </main>
            
            <Customizer />
          </div>
        </div>
      </ModuleProvider>
    </ProtectedRoute>
  );
}
