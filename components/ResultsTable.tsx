import React from 'react';
import { PlaceResult } from '../types';

export const ResultsTable = ({ places }: { places: PlaceResult[] }) => {
  if (!places || places.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-md shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/80 text-gray-300 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold rounded-tl-2xl">Name</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Address</th>
              <th className="p-4 font-semibold">Rating</th>
              <th className="p-4 font-semibold rounded-tr-2xl">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50 text-gray-200">
            {places.map((place, idx) => (
              <tr 
                key={place.place_id || idx} 
                className="hover:bg-gray-800/30 transition-colors duration-150"
              >
                <td className="p-4 font-medium">{place.name}</td>
                <td className="p-4 text-sm text-gray-400 capitalize">{place.category?.replace(/_/g, ' ') || '-'}</td>
                <td className="p-4 text-sm text-gray-400 max-w-xs truncate" title={place.address || ''}>
                  {place.address || '-'}
                </td>
                <td className="p-4">
                  {place.rating ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400">★</span>
                      <span className="font-medium">{place.rating}</span>
                      <span className="text-xs text-gray-500">({place.review_count})</span>
                    </div>
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-400">
                  <div className="flex flex-col gap-1">
                    {place.phone ? <span>{place.phone}</span> : null}
                    {place.website ? (
                      <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[150px] inline-block">
                        Website ↗
                      </a>
                    ) : null}
                    {!place.phone && !place.website && <span className="text-gray-600">-</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
