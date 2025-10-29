import React from 'react';
import { ClothingItem } from '../types';

interface ClothingCardProps {
  item: ClothingItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const ClothingCard: React.FC<ClothingCardProps> = ({ item, isSelected, onSelect }) => {
  const selectionClass = isSelected
    ? 'ring-4 ring-offset-2 ring-indigo-500'
    : 'ring-1 ring-gray-300 dark:ring-gray-600';

  return (
    <div
      onClick={() => onSelect(item.id)}
      className="relative cursor-pointer group rounded-lg overflow-hidden bg-white dark:bg-gray-700 shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className={`aspect-w-1 aspect-h-1 ${selectionClass} rounded-lg`}>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="object-contain w-full h-full p-4"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
        <p className="text-white text-center font-semibold px-2">{item.name.replace(/^a (pair of )?/, '').replace(/^\w/, c => c.toUpperCase())}</p>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ClothingCard;
