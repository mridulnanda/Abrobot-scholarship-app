import React, { useState, useEffect, useMemo } from 'react';
import { findScholarships } from '../services/geminiService';
import type { Scholarship, GroundingSource } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ScholarshipCard from './ScholarshipCard';
import { SearchIcon, UserCircleIcon, WarningIcon, HistoryIcon, BookmarkIcon, BookmarkSolidIcon, ChevronLeftIcon, ChevronRightIcon, SortIcon } from './Icons';
import SourceLink from './SourceLink';
import AnimatedLogo from './AnimatedLogo';

const FilterInput: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    placeholder: string; 
    disabled?: boolean;
}> = ({ label, value, onChange, placeholder, disabled }) => (
    <div className={`group ${disabled ? 'opacity-60 pointer-events-none select-none' : ''}`}>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 transition-colors group-focus-within:text-cyan-600">{label}</label>
        <input 
            type="text" 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            disabled={disabled}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 transition-all duration-200 ease-in-out bg-white focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 hover:border-cyan-300 hover:shadow-sm disabled:bg-slate-50"
        />
    </div>
);

const ScholarshipFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [major, setMajor] = useState('');
  const [academicLevel, setAcademicLevel] = useState('Any');
  const [location, setLocation] = useState('');
  const [gpa, setGpa] = useState('');

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Features
  const [history, setHistory] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<Scholarship[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [sortOption, setSortOption] = useState<'relevance' | 'deadline' | 'name'>('relevance');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const savedHistory = localStorage.getItem('abrobot_search_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedBookmarks = localStorage.getItem('abrobot_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, []);

  const updateHistory = (newQuery: string) => {
      const updatedHistory = [newQuery, ...history.filter(q => q !== newQuery)].slice(10, 10);
      setHistory(updatedHistory);
      localStorage.setItem('abrobot_search_history', JSON.stringify(updatedHistory));
  };

  const toggleBookmark = (scholarship: Scholarship) => {
      const isBookmarked = bookmarks.some(b => b.link === scholarship.link && b.name === scholarship.name);
      
      if (!isBookmarked) {
          if (window.confirm(`Do you want to bookmark "${scholarship.name}"?`)) {
              const newBookmarks = [scholarship, ...bookmarks];
              setBookmarks(newBookmarks);
              localStorage.setItem('abrobot_bookmarks', JSON.stringify(newBookmarks));
          }
      } else {
          if (window.confirm(`Are you sure you want to remove "${scholarship.name}" from bookmarks?`)) {
              const newBookmarks = bookmarks.filter(b => !(b.link === scholarship.link && b.name === scholarship.name));
              setBookmarks(newBookmarks);
              localStorage.setItem('abrobot_bookmarks', JSON.stringify(newBookmarks));
          }
      }
  };

  const handleShare = async (scholarship: Scholarship) => {
      const shareData = {
          title: scholarship.name,
          text: `Check out this scholarship: ${scholarship.name} provided by ${scholarship.provider}. Deadline: ${scholarship.deadline}`,
          url: scholarship.link
      };

      if (navigator.share) {
          try {
              await navigator.share(shareData);
          } catch (err) {
              console.log('Error sharing:', err);
          }
      } else {
          navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
          alert('Scholarship link copied to clipboard!');
      }
  };

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = overrideQuery || query;
    
    if (!searchQuery.trim()) {
      setError('Please enter a main search topic.');
      return;
    }

    if (overrideQuery) setQuery(overrideQuery);

    setIsLoading(true);
    setError(null);
    setSearched(true);
    setShowBookmarks(false);
    setScholarships([]);
    setSources([]);
    setCurrentPage(1);

    // Update history
    if (!overrideQuery) updateHistory(searchQuery);

    try {
      const filters = { major, academicLevel, location, gpa };
      const result = await findScholarships(searchQuery, filters);
      if (result.scholarships.length === 0) {
          setError("No scholarships found matching your criteria. Try broadening your search.");
      } else {
          setScholarships(result.scholarships);
          setSources(result.sources);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sorting Logic
  const sortedScholarships = useMemo(() => {
      const list = showBookmarks ? bookmarks : scholarships;
      if (sortOption === 'relevance') return list;
      
      return [...list].sort((a, b) => {
          if (sortOption === 'name') {
              return a.name.localeCompare(b.name);
          }
          if (sortOption === 'deadline') {
               const getTimestamp = (dateStr: string) => {
                   const FAR_FUTURE = 8640000000000000; // Max date value
                   if (!dateStr) return FAR_FUTURE; 
                   
                   const str = dateStr.toLowerCase().trim();
                   // Enhanced keyword list for rolling/undefined deadlines
                   const rollingKeywords = [
                       'rolling', 'open', 'unknown', 'n/a', 'varies', 'ongoing', 
                       'year-round', 'anytime', 'tba', 'tbd', 'check website', 'soon'
                   ];
                   
                   if (rollingKeywords.some(keyword => str.includes(keyword))) {
                       return FAR_FUTURE; 
                   }
                   
                   // Try parsing standard formats
                   let timestamp = Date.parse(dateStr);

                   // If failed (NaN), try to handle common deviations or extracted text (e.g. "By 2024-12-01")
                   if (isNaN(timestamp)) {
                        // Regex to find YYYY-MM-DD or MM/DD/YYYY pattern
                        const isoMatch = dateStr.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
                        if (isoMatch) {
                             timestamp = Date.parse(`${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`);
                        }
                   }

                   // If still NaN, it's not a recognizable date -> put at end
                   return isNaN(timestamp) ? FAR_FUTURE : timestamp;
               };

               const dateA = getTimestamp(a.deadline);
               const dateB = getTimestamp(b.deadline);
               
               // If timestamps are equal (e.g. both Rolling), sort alphabetically by name for stability
               if (dateA === dateB) {
                   return a.name.localeCompare(b.name);
               }
               
               return dateA - dateB;
          }
          return 0;
      });
  }, [scholarships, bookmarks, showBookmarks, sortOption]);

  // Pagination Logic
  const totalItems = sortedScholarships.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentScholarships = sortedScholarships.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col">
        {/* Animated Logo at the top of the Finder */}
        <div className="flex justify-center mb-6">
            <AnimatedLogo />
        </div>

        {/* Filter Section with Loading Overlay */}
        <div className="mb-8 p-6 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center animate-fadeIn">
                    <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-lg border border-cyan-100">
                        <LoadingSpinner size={4} />
                        <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">Applying Filters...</span>
                    </div>
                </div>
            )}

            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Refine Your Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <FilterInput 
                    label="Major" 
                    value={major} 
                    onChange={(e) => setMajor(e.target.value)} 
                    placeholder="e.g., Computer Science"
                    disabled={isLoading}
                />
                <div className={`group ${isLoading ? 'opacity-60 pointer-events-none select-none' : ''}`}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 transition-colors group-focus-within:text-cyan-600">Degree Level</label>
                    <div className="relative">
                        <select 
                            value={academicLevel} 
                            onChange={(e) => setAcademicLevel(e.target.value)} 
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg text-sm text-slate-700 transition-all duration-200 ease-in-out bg-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 hover:border-cyan-300 hover:shadow-sm cursor-pointer disabled:bg-slate-50"
                        >
                            <option>Any</option>
                            <option>Undergraduate</option>
                            <option>Graduate</option>
                            <option>Postgraduate</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                             <ChevronDownIcon />
                        </div>
                    </div>
                </div>
                <FilterInput 
                    label="Location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="e.g., California, USA"
                    disabled={isLoading}
                />
                <FilterInput 
                    label="GPA (Optional)" 
                    value={gpa} 
                    onChange={(e) => setGpa(e.target.value)} 
                    placeholder="e.g., 3.5+"
                    disabled={isLoading}
                />
            </div>
        </div>

      <form onSubmit={(e) => handleSearch(e)} className="relative mb-3 group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter main topic, e.g., 'scholarships for women in STEM'"
          disabled={isLoading}
          className="w-full pl-5 pr-14 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300 shadow-sm text-lg placeholder-slate-400 group-hover:border-cyan-300 disabled:bg-slate-50 disabled:text-slate-400"
          aria-label="Scholarship search topic"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-14 text-slate-400 hover:text-cyan-600 disabled:text-slate-300 transition-colors duration-200"
          aria-label="Search for scholarships"
        >
          {isLoading ? <LoadingSpinner size={6}/> : <div className="transform transition-transform group-hover:scale-110"><SearchIcon /></div>}
        </button>
      </form>

      {/* History Chips */}
      {history.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center text-slate-400 text-xs mr-1">
                  <HistoryIcon />
              </div>
              {history.map((h, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSearch(undefined, h)}
                    disabled={isLoading}
                    className="text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {h}
                  </button>
              ))}
          </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 pt-2">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-center">
              <div className="text-slate-400">
                  <SortIcon />
              </div>
              <div className="relative">
                  <select 
                      value={sortOption} 
                      onChange={(e) => setSortOption(e.target.value as any)}
                      className="appearance-none text-sm font-medium border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 bg-white hover:border-cyan-300 transition-all cursor-pointer shadow-sm"
                  >
                      <option value="relevance">Sort by Relevance</option>
                      <option value="deadline">Sort by Deadline (Earliest)</option>
                      <option value="name">Sort by Name (A-Z)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
              </div>
          </div>

          {/* Bookmarks Toggle */}
          <button 
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border self-end sm:self-center ${showBookmarks ? 'bg-cyan-50 border-cyan-200 text-cyan-700 shadow-inner' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-cyan-600 hover:border-cyan-200 shadow-sm'}`}
          >
              {showBookmarks ? <BookmarkSolidIcon /> : <BookmarkIcon />}
              {showBookmarks ? 'Hide Bookmarks' : `Show Bookmarks (${bookmarks.length})`}
          </button>
      </div>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fadeIn" role="alert">
                <div className="flex items-start">
                    <div className="mt-0.5 text-red-500"><WarningIcon /></div>
                    <div className="ml-3">
                        <h3 className="font-bold">Search Error</h3>
                        <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleSearch()}
                    className="bg-white text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                >
                    Try Again
                </button>
            </div>
        )}
      
      <div className="space-y-5">
        {isLoading && (
            <div className="flex flex-col items-center justify-center text-slate-600 py-16 animate-fadeIn">
                <LoadingSpinner size={10} />
                <p className="mt-4 text-base font-medium text-slate-500">Analyzing thousands of opportunities...</p>
            </div>
        )}

        {!isLoading && (
            <>
                {sources.length > 0 && !showBookmarks && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            AI Information Sources
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {sources.map((source, index) => <SourceLink key={index} source={source} />)}
                        </div>
                    </div>
                )}

                {currentScholarships.length > 0 ? (
                    <>
                        {showBookmarks && <h3 className="font-bold text-xl text-slate-800 mb-2">Your Bookmarks</h3>}
                        <div className="grid grid-cols-1 gap-4">
                            {currentScholarships.map((scholarship, index) => (
                            <ScholarshipCard 
                                key={`${scholarship.name}-${index}`} 
                                scholarship={scholarship} 
                                isBookmarked={bookmarks.some(b => b.link === scholarship.link && b.name === scholarship.name)}
                                onToggleBookmark={toggleBookmark}
                                onShare={handleShare}
                            />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalItems > itemsPerPage && (
                            <div className="flex justify-center items-center gap-4 mt-8 pb-4">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                >
                                    <ChevronLeftIcon />
                                </button>
                                <span className="text-sm text-slate-600 font-semibold bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                >
                                    <ChevronRightIcon />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                     (searched || showBookmarks) && !error && (
                         <div className="text-center py-16 px-6 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-300">
                                {showBookmarks ? <BookmarkIcon /> : <SearchIcon />}
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">{showBookmarks ? "No Bookmarks Yet" : "No Scholarships Found"}</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">{showBookmarks ? "Save scholarships you like to view them here." : "Try refining your search terms or adjusting filters for better results."}</p>
                        </div>
                     )
                )}
            </>
        )}
        
        {!isLoading && !showBookmarks && currentScholarships.length > 0 && (
             <div className="mt-10 p-8 bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-2xl shadow-xl text-center flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="p-3 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                            <UserCircleIcon />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 tracking-tight">Need Personalized Guidance?</h3>
                        <p className="mb-6 max-w-xl text-cyan-50 leading-relaxed">Let our experts at Abrobot help you navigate your scholarship journey and maximize your chances of success.</p>
                        <a 
                            href="https://www.abrobot.ai/contactus" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-white text-cyan-700 font-bold py-3 px-8 rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl hover:bg-slate-50 flex items-center gap-2"
                        >
                            Contact an Expert <ChevronRightIcon />
                        </a>
                    </div>
                </div>
        )}
      </div>
    </div>
  );
};

// Helper for select arrow
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export default ScholarshipFinder;