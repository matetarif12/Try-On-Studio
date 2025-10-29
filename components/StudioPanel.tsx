import React, { ChangeEvent } from 'react';
import MannequinDisplay from './MannequinDisplay';

interface StudioPanelProps {
    mannequinImage: string | null;
    generatedImage: string | null;
    isLoading: boolean;
    onMannequinUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

const StudioPanel: React.FC<StudioPanelProps> = ({
    mannequinImage,
    generatedImage,
    isLoading,
    onMannequinUpload
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 border-b dark:border-gray-600 pb-2">Your Model</h2>
            <div className="flex-grow min-h-0 relative">
                {mannequinImage ? (
                    <>
                        <MannequinDisplay isLoading={isLoading} imageUrl={generatedImage || mannequinImage} />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                             <label htmlFor="mannequin-upload" className="cursor-pointer text-center py-2 px-5 bg-black/50 text-white rounded-lg hover:bg-black/70 backdrop-blur-sm transition-colors duration-300">
                                Change Model
                            </label>
                            <input id="mannequin-upload" type="file" className="hidden" onChange={onMannequinUpload} accept="image/png, image/jpeg, image/webp"/>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-inner">
                        <label htmlFor="mannequin-upload" className="cursor-pointer text-center p-8 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300">
                            <svg className="mx-auto h-12 w-12 text-gray-500 dark:text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="mt-4 block font-semibold text-gray-700 dark:text-gray-300">Upload Your Model</span>
                            <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">Click to select an image</span>
                        </label>
                        <input id="mannequin-upload" type="file" className="hidden" onChange={onMannequinUpload} accept="image/png, image/jpeg, image/webp" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudioPanel;
