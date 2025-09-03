"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Create context for module selection
interface ModuleContextType {
  selectedModule: string | null;
  setSelectedModule: (module: string | null) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const useModuleSelection = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModuleSelection must be used within a ModuleProvider');
  }
  return context;
};

interface ModuleProviderProps {
  children: ReactNode;
}

export const ModuleProvider = ({ children }: ModuleProviderProps) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const handleSetSelectedModule = (module: string | null) => {
    setSelectedModule(module);
  };

  return (
    <ModuleContext.Provider value={{ selectedModule, setSelectedModule: handleSetSelectedModule }}>
      {children}
    </ModuleContext.Provider>
  );
};


