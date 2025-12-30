"use client";

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ExternalLink, Image as ImageIcon } from 'lucide-react';

// --- CONFIGURATION ---
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTiUD07fPcFA9zPES-HKKCs-BC8GZ223iKxzr2bJeLX_YX6cS5YpKD8Y97oPv-NZpCxZUrsXdo8pWyV/pub?gid=0&single=true&output=csv';

type ArchiveImage = {
  id: string;
  image_url: string;
};

export default function Home() {
  const [pictures, setPictures] = useState<ArchiveImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            console.log("Data Found:", results.data); // check console if still empty
            setPictures(results.data as ArchiveImage[]);
            setLoading(false);
          },
        });
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e1e1e1] font-sans selection:bg-orange-500/30">
      
      {/* Floating Glass Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 backdrop-blur-md bg-black/50 border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
          <span className="font-bold tracking-[0.2em] text-sm uppercase">Damian's Archives</span>
        </div>
        <div className="text-xs text-gray-500 font-mono hidden md:block">
          EST. 2024 • SYSTEM ONLINE
        </div>
      </motion.header>

      <main className="pt-32 px-4 md:px-8 pb-20 max-w-[1920px] mx-auto">
        
        {/* Title Section */}
        <div className="mb-24 mt-10 md:pl-10">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] text-white"
          >
            VISUAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800">
              DATABASE
            </span>
          </motion.h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-4 text-gray-500">
            <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
            <span className="font-mono text-xs uppercase tracking-widest"> fetching data stream...</span>
          </div>
        )}

        {/* Empty State Debugger */}
        {!loading && pictures.length === 0 && (
          <div className="border border-red-900 bg-red-900/10 p-8 rounded-xl max-w-xl mx-auto text-center">
            <h3 className="text-red-400 font-bold mb-2">No Images Found</h3>
            <p className="text-gray-400 text-sm mb-4">Check your Google Sheet headers. They must be exactly <code>id</code> and <code>image_url</code>.</p>
          </div>
        )}

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8">
          <AnimatePresence>
            {pictures.map((pic, i) => (
              pic.image_url ? (
                <motion.div
                  layoutId={pic.id}
                  key={pic.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }} // Stagger effect
                  className="group relative mb-8 break-inside-avoid"
                  onClick={() => setSelectedId(pic.id === selectedId ? null : pic.id)}
                >
                  <div className="relative overflow-hidden rounded-lg bg-[#111] border border-white/5 transition-all duration-500 group-hover:border-orange-500/50">
                    
                    {/* The Image */}
                    <motion.img 
                      src={pic.image_url} 
                      alt={pic.id}
                      className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                    />

                    {/* Hover Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-orange-500 font-mono text-xs tracking-widest block mb-1">ID_REF</span>
                        <span className="text-2xl font-bold text-white tracking-tight">#{pic.id}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}