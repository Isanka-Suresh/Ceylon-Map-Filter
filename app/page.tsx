'use client';

import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ResultsTable } from '../components/ResultsTable';
import { PlaceResult } from '../types';

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('5000');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<PlaceResult[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword || !location || !radius) return;

    setIsLoading(true);
    setError(null);
    setPlaces([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          location,
          radius: parseInt(radius, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results');
      }

      setPlaces(data.data.places);
      
      if (data.data.places.length === 0) {
        setError('No places found for this search criteria.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-blue-500/30">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Google Maps Extractor
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Places</span> Faster
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Search for businesses and extract their details instantly.
          </p>
        </div>

        {/* Search Form Card */}
        <div className="w-full max-w-4xl bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl mb-12 transition-all">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Input
                label="Keyword"
                placeholder="e.g., Hospital, Resort, Cafe"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 w-full">
              <Input
                label="Location"
                placeholder="e.g., Colombo, Kandy"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-32">
              <Input
                label="Radius (m)"
                type="number"
                min="100"
                max="50000"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                required
              />
            </div>
            <div className="w-full md:w-auto">
              <Button type="submit" isLoading={isLoading} className="w-full md:w-auto h-[50px] px-8">
                Search
              </Button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 transition-all">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="w-full max-w-6xl transition-all">
          <ResultsTable places={places} />
        </div>

      </main>
    </div>
  );
}
