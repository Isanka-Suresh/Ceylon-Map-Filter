'use client';

import React, { useState, useMemo } from 'react';
import { PlaceResult } from '../types';
import { Button } from './ui/Button';

interface SearchMetadata {
  category?: string;
  keyword?: string;
  city?: string;
  radius?: number;
  mode?: 'dropdown' | 'map';
}

interface ResultsTableProps {
  places: PlaceResult[];
  searchMetadata?: SearchMetadata | null;
  selectedPlaceId?: string | null;
  onPlaceSelect?: (place: PlaceResult) => void;
}

type SortField = 'name' | 'category' | 'rating' | 'review_count' | null;
type SortDirection = 'asc' | 'desc';

export const ResultsTable = ({ places, searchMetadata, selectedPlaceId, onPlaceSelect }: ResultsTableProps) => {
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showRating, setShowRating] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showWebsite, setShowWebsite] = useState(false);

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const response = await fetch('/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ places, metadata: searchMetadata }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition') ?? '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] ?? 'places_data.xlsx';
      triggerDownload(blob, filename);
    } catch (err) {
      console.error('Excel export error:', err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPdf(true);
    try {
      const { generateAndDownloadPdf } = await import('../lib/utils/pdf');
      generateAndDownloadPdf(places, searchMetadata);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const sortedPlaces = useMemo(() => {
    if (!places) return [];
    if (!sortField) return places;
    return [...places].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (sortField === 'name' || sortField === 'category') {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [places, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="text-gray-600 ml-1 inline-block text-xs">↕</span>;
    return <span className="text-blue-400 ml-1 inline-block text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (!places || places.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-gray-300 font-medium bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800 backdrop-blur-md">
            Found <span className="text-blue-400 font-bold">{places.length}</span> result{places.length === 1 ? '' : 's'}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-300 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-800 backdrop-blur-md">
            <span className="font-medium text-gray-400 border-r border-gray-700 pr-4">Columns:</span>
            <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
              <input type="checkbox" checked={showRating} onChange={e => setShowRating(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900" />
              Rating
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
              <input type="checkbox" checked={showReviews} onChange={e => setShowReviews(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900" />
              Reviews
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors">
              <input type="checkbox" checked={showWebsite} onChange={e => setShowWebsite(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900" />
              Website
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleExportExcel}
            isLoading={isExportingExcel}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 h-auto text-sm border-none"
          >
            Export as Excel
          </Button>
          <Button
            onClick={handleExportPDF}
            isLoading={isExportingPdf}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 h-auto text-sm border-none"
          >
            Export as PDF
          </Button>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/80 text-gray-300 text-sm uppercase tracking-wider">
                <th 
                  className="p-4 font-semibold rounded-tl-2xl cursor-pointer hover:bg-gray-700/50 transition-colors select-none"
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </th>
                <th 
                  className="p-4 font-semibold cursor-pointer hover:bg-gray-700/50 transition-colors select-none"
                  onClick={() => handleSort('category')}
                >
                  Category {getSortIcon('category')}
                </th>
                <th className="p-4 font-semibold">Address</th>
                {showRating && (
                  <th 
                    className="p-4 font-semibold cursor-pointer hover:bg-gray-700/50 transition-colors select-none"
                    onClick={() => handleSort('rating')}
                  >
                    Rating {getSortIcon('rating')}
                  </th>
                )}
                {showReviews && (
                  <th 
                    className="p-4 font-semibold cursor-pointer hover:bg-gray-700/50 transition-colors select-none"
                    onClick={() => handleSort('review_count')}
                  >
                    Reviews {getSortIcon('review_count')}
                  </th>
                )}
                {showWebsite && (
                  <th className="p-4 font-semibold">Website</th>
                )}
                <th className="p-4 font-semibold rounded-tr-2xl">Contact No.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-gray-200">
              {sortedPlaces.map((place, idx) => (
                <tr
                  key={place.place_id || idx}
                  onClick={() => onPlaceSelect?.(place)}
                  className={`transition-colors duration-150 cursor-pointer ${
                    selectedPlaceId === place.place_id 
                      ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border-l-2 border-yellow-500' 
                      : 'hover:bg-gray-800/30'
                  }`}
                >
                  <td className="p-4 font-medium">{place.name}</td>
                  <td className="p-4 text-sm text-gray-400 capitalize">
                    {place.category?.replace(/_/g, ' ') || '-'}
                  </td>
                  <td
                    className="p-4 text-sm text-gray-400 max-w-xs truncate"
                    title={place.address || ''}
                  >
                    {place.address || '-'}
                  </td>
                  {showRating && (
                    <td className="p-4">
                      {place.rating ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-400">★</span>
                          <span className="font-medium">{place.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  )}
                  {showReviews && (
                    <td className="p-4">
                      {place.review_count !== null ? (
                        <span className="text-gray-300">{place.review_count}</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  )}
                  {showWebsite && (
                    <td className="p-4 text-sm">
                      {place.website ? (
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[150px] inline-block"
                        >
                          Visit ↗
                        </a>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  )}
                  <td className="p-4 text-sm text-gray-400">
                    {place.phone ? <span>{place.phone}</span> : <span className="text-gray-600">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

