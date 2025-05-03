'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type CategoryMode = 'cameras' | 'recordings';

interface CategoryModeContextType {
  categoryMode: CategoryMode;
  setCategoryMode: (mode: CategoryMode) => void;
}

const CategoryModeContext = createContext<CategoryModeContextType | undefined>(undefined);

export const CategoryModeProvider = ({ children }: { children: ReactNode }) => {
  const [categoryMode, setCategoryMode] = useState<CategoryMode>('cameras');

  return (
    <CategoryModeContext.Provider value={{ categoryMode, setCategoryMode }}>
      {children}
    </CategoryModeContext.Provider>
  );
};

export const useCategoryMode = (): CategoryModeContextType => {
  const context = useContext(CategoryModeContext);
  if (!context) {
    throw new Error('useCategoryMode must be used within a CategoryModeProvider');
  }
  return context;
};
