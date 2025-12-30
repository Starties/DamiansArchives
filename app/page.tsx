"use client";

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X } from 'lucide-react';

// --- CONFIGURATION ---

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTiUD07fPcFA9zPES-HKKCs-BC8GZ223iKxzr2bJeLX_YX6cS5YpKD8Y97oPv-NZpCxZUrsXdo8pWyV/pub?gid=0&single=true&output=csv';

type ArchiveImage = {
  id: string;
  image_url: string;
};

export default function Home() {
  const [pictures, setPictures] = useState<ArchiveImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ArchiveImage | null>(null);

  useEffect(() => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
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
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 md:px-8 py-6 backdrop-blur-xl bg-black/60 border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]" />
          <span className="font-bold tracking-[0.2em] text-xs md:text-sm uppercase">Damian's Archives</span>
        </div>
        <div className="text-[10px] md:text-xs text-gray-500 font-mono hidden sm:block">
          EST. 2024 • SYSTEM ONLINE
        </div>
      </motion.header>

      <main className="pt-28 md:pt-40 px-4 md:px-8 pb-20 max-w-1920px mx-auto">
        
        {/* Massive Title */}
        <div className="mb-16 md:mb-32 md:pl-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-white"
          >
            VISUAL <br />
            {/* UPDATED: Using v4 syntax 'bg-linear-to-r' */}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-600 via-gray-500 to-gray-800">
              DATABASE
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-gray-500 max-w-md text-sm md:text-base leading-relaxed"
          >
            A curated collection of moments, frozen in time and served via the cloud.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-gray-500">
            <Loader2 className="animate-spin w-8 h-8 text-orange-500" />
            <span className="font-mono text-xs uppercase tracking-widest"> decrypting stream...</span>
          </div>
        )}

        {/* The Grid */}
        {!loading && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-8 space-y-4 md:space-y-8">
            <AnimatePresence>
              {pictures.map((pic, i) => (
                pic.image_url ? (
                  <motion.div
                    layoutId={`card-${pic.id}`}
                    key={pic.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative break-inside-avoid mb-4 md:mb-8 cursor-zoom-in"
                    onClick={() => setSelectedImage(pic)}
                  >
                    <div className="relative overflow-hidden rounded-xl bg-[#111] border border-white/5 hover:border-orange-500/30 transition-colors duration-500">
                      
                      {/* Image */}
                      <motion.img 
                        layoutId={`img-${pic.id}`}
                        src={pic.image_url} 
                        alt={pic.id}
                        className="w-full h-auto object-cover grayscale-30 group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                      />

                      {/* Hover Overlay - UPDATED: 'bg-linear-to-t' */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <span className="text-orange-500 font-mono text-xs tracking-widest mb-1">ID_REF</span>
                        <span className="text-xl font-bold text-white">#{pic.id}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : null
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50">
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </button>

            <motion.div
              layoutId={`card-${selectedImage.id}`}
              className="relative max-w-7xl max-h-[90vh] w-full overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()} 
            >
              <motion.img
                layoutId={`img-${selectedImage.id}`}
                src={selectedImage.image_url}
                alt={selectedImage.id}
                className="w-full h-full max-h-[85vh] object-contain bg-black"
              />
              
              {/* Modal Footer Info - UPDATED: 'bg-linear-to-t' */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black to-transparent">
                <h3 className="text-2xl md:text-4xl font-bold text-white">#{selectedImage.id}</h3>
                <p className="text-orange-500 font-mono text-sm tracking-widest mt-1">ARCHIVE DATA</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}