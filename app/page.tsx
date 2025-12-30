"use client"; // We need this because we use 'useEffect' for fetching on the client side

import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// --- CONFIGURATION ---
// PASTE YOUR GOOGLE SHEET CSV LINK HERE
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTiUD07fPcFA9zPES-HKKCs-BC8GZ223iKxzr2bJeLX_YX6cS5YpKD8Y97oPv-NZpCxZUrsXdo8pWyV/pubhtml';

type ArchiveImage = {
  id: string;
  image_url: string;
};

export default function Home() {
  const [pictures, setPictures] = useState<ArchiveImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the CSV data when the page loads
    fetch(GOOGLE_SHEET_CSV_URL)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setPictures(results.data as ArchiveImage[]);
            setLoading(false);
          },
        });
      })
      .catch(err => console.error("Error fetching sheet:", err));
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* HEADER */}
      <header className="mb-16 text-center pt-10">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 animate-gradient-x">
            ARCHIVES
          </span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base tracking-widest uppercase">
          Curated by Damian • {pictures.length} Moments
        </p>
      </header>

      {/* GRID */}
      {loading ? (
        <div className="text-center text-gray-500 animate-pulse">Loading Archives...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto max-w-[1800px]">
          {pictures.map((pic, index) => (
            pic.image_url ? (
              <div 
                key={index} 
                className="group relative aspect-square overflow-hidden bg-neutral-900 rounded-lg cursor-pointer transition-all duration-500 hover:z-10"
              >
                {/* Image */}
                <img 
                  src={pic.image_url} 
                  alt={`Archive ${pic.id}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <span className="font-mono text-xl font-bold text-white tracking-widest border border-white/30 px-4 py-2 rounded-full">
                    #{pic.id}
                  </span>
                </div>
              </div>
            ) : null
          ))}
        </div>
      )}
    </main>
  );
}