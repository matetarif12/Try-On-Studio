import React, { useState, useCallback, ChangeEvent } from 'react';
import { ClothingItem } from './types';
import { generateStyledImage, generateRandomClothingItem, generateDescribedClothingItem } from './services/geminiService';
import { fileToBase64 } from './utils';
import { useTheme } from './hooks/useTheme';
import WardrobePanel from './components/WardrobePanel';
import StudioPanel from './components/StudioPanel';
import ThemeToggle from './components/ThemeToggle';


const App: React.FC = () => {
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingItem, setIsGeneratingItem] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [mannequinImage, setMannequinImage] = useState<string | null>(null);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  const [theme, toggleTheme] = useTheme();

  const handleMannequinUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setMannequinImage(base64);
        setGeneratedImage(null); // Reset generated image when mannequin changes
        setError(null);
      } catch (e) {
        setError("Failed to load mannequin image.");
      }
    }
  };
  
  const handleClothingUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setError(null);
      const newItems: ClothingItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const base64 = await fileToBase64(file);
          newItems.push({
            id: Date.now() + Math.random(),
            name: file.name.split('.').slice(0, -1).join('.') || 'Uploaded Item',
            imageUrl: base64,
          });
        } catch (e) {
          setError(prev => (prev ? prev + ` Failed to load ${file.name}.` : `Failed to load ${file.name}.`));
        }
      }
      setClothingItems(prev => [...prev, ...newItems]);
    }
  };
  
  const handleGenerateRandomItem = async () => {
    setIsGeneratingItem(true);
    setError(null);
    try {
      const newItemData = await generateRandomClothingItem();
      const newItem: ClothingItem = {
        id: Date.now(),
        ...newItemData,
      };
      setClothingItems(prev => [newItem, ...prev]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to generate item.");
      } else {
        setError("Failed to generate item.");
      }
    } finally {
      setIsGeneratingItem(false);
    }
  };
  
  const handleGenerateDescribedItem = async (description: string) => {
    if (!description.trim()) {
        setError("Please enter a description for the clothing item.");
        return;
    }
    setIsGeneratingItem(true);
    setError(null);
    try {
      const newItemData = await generateDescribedClothingItem(description);
      const newItem: ClothingItem = {
        id: Date.now(),
        ...newItemData,
      };
      setClothingItems(prev => [newItem, ...prev]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to generate item from description.");
      } else {
        setError("Failed to generate item from description.");
      }
    } finally {
      setIsGeneratingItem(false);
    }
  };

  const handleSelectItem = useCallback((id: number) => {
    setSelectedItemIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  }, []);

  const handleTryOn = async () => {
    if (!mannequinImage) {
      setError("Please upload a mannequin image first.");
      return;
    }
    if (selectedItemIds.size === 0) {
      setError("Please select at least one item to try on.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImage(null);

    const selectedItems = clothingItems.filter(item => selectedItemIds.has(item.id));

    try {
      const imageUrl = await generateStyledImage(mannequinImage, selectedItems);
      setGeneratedImage(imageUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "An unknown error occurred.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearSelection = () => {
    setSelectedItemIds(new Set());
    setGeneratedImage(mannequinImage);
    setError(null);
  };

  const handleClearWardrobe = () => {
    setClothingItems([]);
    handleClearSelection();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-md dark:border-b dark:border-gray-700 sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Virtual Try-On Studio</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Upload your model, add clothes, and see your new look with Gemini AI</p>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 p-4 mb-6 rounded-md" role="alert">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{height: 'calc(100vh - 160px)'}}>
          <WardrobePanel 
             clothingItems={clothingItems}
             selectedItemIds={selectedItemIds}
             isLoading={isLoading}
             isGeneratingItem={isGeneratingItem}
             onSelectItem={handleSelectItem}
             onClothingUpload={handleClothingUpload}
             onGenerateRandomItem={handleGenerateRandomItem}
             onGenerateDescribedItem={handleGenerateDescribedItem}
             onTryOn={handleTryOn}
             onClearSelection={handleClearSelection}
             onClearWardrobe={handleClearWardrobe}
             isTryOnDisabled={selectedItemIds.size === 0 || isLoading || !mannequinImage || isGeneratingItem}
          />
          <StudioPanel 
             mannequinImage={mannequinImage}
             generatedImage={generatedImage}
             isLoading={isLoading}
             onMannequinUpload={handleMannequinUpload}
          />
        </div>
      </main>
    </div>
  );
};

export default App;