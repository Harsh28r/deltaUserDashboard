"use client";
import React, { useContext } from "react";
// import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Header from "./layout/vertical/header/Header";
import { Customizer } from "./layout/shared/customizer/Customizer";
import { CustomizerContext } from "../context/CustomizerContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ModuleSidebar from "../components/auth/ModuleSidebar";
import { ModuleProvider } from "../context/ModuleContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeLayout, isLayout } = useContext(CustomizerContext);
  return (
    <ProtectedRoute>
      <ModuleProvider>
        <div className="flex w-full min-h-screen">
          {/* Sidebar */}
          {activeLayout == "vertical" ? <ModuleSidebar /> : null}
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen main-content">
            {/* Top Header */}
            {activeLayout == "horizontal" ? (
              <Header layoutType="horizontal" />
            ) : (
              <Header layoutType="vertical" />
            )}

            {/* Body Content */}
            <main className="flex-1 bg-lightgray dark:bg-dark">
              <div
                className={`${
                  isLayout == "full"
                    ? "w-full py-[30px] md:px-[30px] px-4 sm:px-5"
                    : "container mx-auto py-[30px] px-4 sm:px-6"
                } ${activeLayout == "horizontal" ? "xl:mt-3" : ""}`}
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
