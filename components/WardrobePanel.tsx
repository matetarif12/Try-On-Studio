import React, { ChangeEvent, useState } from 'react';
import { ClothingItem } from '../types';
import ClothingCard from './ClothingCard';

interface WardrobePanelProps {
    clothingItems: ClothingItem[];
    selectedItemIds: Set<number>;
    isLoading: boolean;
    isGeneratingItem: boolean;
    isTryOnDisabled: boolean;
    onSelectItem: (id: number) => void;
    onClothingUpload: (event: ChangeEvent<HTMLInputElement>) => void;
    onGenerateRandomItem: () => void;
    onGenerateDescribedItem: (description: string) => void;
    onTryOn: () => void;
    onClearSelection: () => void;
    onClearWardrobe: () => void;
}

const WardrobePanel: React.FC<WardrobePanelProps> = ({
    clothingItems,
    selectedItemIds,
    isLoading,
    isGeneratingItem,
    isTryOnDisabled,
    onSelectItem,
    onClothingUpload,
    onGenerateRandomItem,
    onGenerateDescribedItem,
    onTryOn,
    onClearSelection,
    onClearWardrobe
}) => {
    const [description, setDescription] = useState('');

    const handleDescriptionSubmit = () => {
        onGenerateDescribedItem(description);
        setDescription('');
    }

    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-600 pb-2">Your Wardrobe</h2>
            <div className="flex-grow overflow-y-auto pr-2 min-h-0">
                {clothingItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {clothingItems.map((item) => (
                            <ClothingCard
                                key={item.id}
                                item={item}
                                isSelected={selectedItemIds.has(item.id)}
                                onSelect={onSelectItem}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16L4 4H10L10 6H14L14 4H20L20 16H4Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16L4 20L20 20V16" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V12" /></svg>
                        <p className="font-semibold mt-4 text-lg">Your wardrobe is empty</p>
                        <p className="mt-1">Upload your own clothes or generate items with AI to get started.</p>
                    </div>
                )}
            </div>
            <div className="pt-6 border-t dark:border-gray-600 mt-6 flex flex-col gap-4">
                 <div className="flex flex-col sm:flex-row gap-4">
                    <label htmlFor="clothing-upload" className={`w-full sm:w-auto text-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${isLoading || isGeneratingItem ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        Upload Clothes
                    </label>
                    <input id="clothing-upload" type="file" multiple className="hidden" onChange={onClothingUpload} disabled={isLoading || isGeneratingItem} accept="image/png, image/jpeg, image/webp" />

                    <button onClick={onGenerateRandomItem} disabled={isGeneratingItem || isLoading} className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {isGeneratingItem ? (
                            <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Generating...</>
                        ) : '✨ Generate Random'}
                    </button>
                </div>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., a red silk dress" className="flex-grow w-full form-input px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 transition"/>
                    <button onClick={handleDescriptionSubmit} disabled={isGeneratingItem || isLoading} className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        Generate from Text
                    </button>
                 </div>
            </div>
            <div className="pt-4 border-t dark:border-gray-600 mt-4 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onTryOn}
                    disabled={isTryOnDisabled}
                    className={`w-full sm:w-auto flex-grow text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center ${isTryOnDisabled ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                    {isLoading ? 'Styling...' : 'Try On Selected Items'}
                </button>
                <button
                    onClick={onClearSelection}
                    disabled={isLoading || isGeneratingItem}
                    className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                    Clear Selection
                </button>
                 <button
                    onClick={onClearWardrobe}
                    disabled={isLoading || isGeneratingItem || clothingItems.length === 0}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                    Clear Wardrobe
                </button>
            </div>
        </div>
    );
};

export default WardrobePanel;