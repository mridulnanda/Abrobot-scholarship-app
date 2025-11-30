import React, { useState, useEffect, useMemo } from 'react';
import { findScholarships } from '../services/geminiService';
import type { Scholarship, GroundingSource } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ScholarshipCard from './ScholarshipCard';
import { SearchIcon, UserCircleIcon, WarningIcon, HistoryIcon, BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, SortIcon } from './Icons';
import SourceLink from './SourceLink';

const FilterInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; }> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-cyan-500 focus:border-cyan-500"/>
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
      const updatedHistory = [newQuery, ...history.filter(q => q !== newQuery)].slice(0, 10);
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
                   const str = dateStr.toLowerCase().trim();
                   // Handle "Rolling", "Unknown", or non-date strings by putting them way in the future
                   if (str.includes('rolling') || str.includes('open') || str.includes('unknown')) {
                       return 8640000000000000; // Max date
                   }
                   const parsed = Date.parse(dateStr);
                   // If invalid date, also push to end
                   return isNaN(parsed) ? 8640000000000000 : parsed;
               };

               const dateA = getTimestamp(a.deadline);
               const dateB = getTimestamp(b.deadline);
               
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
        <div className="mb-6 p-4 bg-slate-100/80 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-md font-semibold text-slate-700 mb-3">Refine Your Search</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <FilterInput label="Major/Field of Study" value={major} onChange={(e) => setMajor(e.target.value)} placeholder="e.g., Computer Science" />
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Academic Level</label>
                    <select value={academicLevel} onChange={(e) => setAcademicLevel(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white">
                        <option>Any</option>
                        <option>Undergraduate</option>
                        <option>Graduate</option>
                        <option>Postgraduate</option>
                    </select>
                </div>
                <FilterInput label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., California, USA" />
                <FilterInput label="GPA (Optional)" value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="e.g., 3.5 or higher" />
            </div>
        </div>

      <form onSubmit={(e) => handleSearch(e)} className="relative mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter main topic, e.g., 'scholarships for women in STEM'"
          className="w-full pl-4 pr-12 py-3 border-2 border-slate-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 shadow-sm"
          aria-label="Scholarship search topic"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-slate-500 hover:text-cyan-600 disabled:text-slate-300 transition"
          aria-label="Search for scholarships"
        >
          {isLoading ? <LoadingSpinner size={5}/> : <SearchIcon />}
        </button>
      </form>

      {/* History Chips */}
      {history.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center text-slate-400 text-xs mr-1">
                  <HistoryIcon />
              </div>
              {history.map((h, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSearch(undefined, h)}
                    className="text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1 rounded-full transition"
                  >
                      {h}
                  </button>
              ))}
          </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-center">
              <div className="text-slate-500">
                  <SortIcon />
              </div>
              <select 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="text-sm border-slate-200 rounded-md py-1.5 pl-2 pr-8 text-slate-700 focus:ring-cyan-500 focus:border-cyan-500 bg-white shadow-sm cursor-pointer"
              >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="deadline">Sort by Deadline (Earliest)</option>
                  <option value="name">Sort by Name (A-Z)</option>
              </select>
          </div>

          {/* Bookmarks Toggle */}
          <button 
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition self-end sm:self-center ${showBookmarks ? 'bg-cyan-100 text-cyan-800' : 'text-slate-600 hover:bg-slate-100'}`}
          >
              <BookmarkIcon />
              {showBookmarks ? 'Hide Bookmarks' : `Show Bookmarks (${bookmarks.length})`}
          </button>
      </div>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" role="alert">
                <div className="flex items-start">
                    <div className="mt-0.5"><WarningIcon /></div>
                    <div className="ml-3">
                        <h3 className="font-bold">Search Error</h3>
                        <p className="mt-1 text-sm">{error}</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleSearch()}
                    className="bg-white text-red-700 border border-red-200 px-3 py-1 rounded text-sm hover:bg-red-50 transition"
                >
                    Try Again
                </button>
            </div>
        )}
      
      <div className="space-y-4">
        {isLoading && (
            <div className="flex flex-col items-center justify-center text-slate-600 py-10">
                <LoadingSpinner />
                <p className="mt-2 text-sm">Searching for the best opportunities...</p>
            </div>
        )}

        {!isLoading && (
            <>
                {sources.length > 0 && !showBookmarks && (
                    <div className="p-3 bg-slate-100 rounded-lg">
                        <h3 className="text-sm font-semibold text-slate-600 mb-2">Sources:</h3>
                        <div className="flex flex-wrap gap-2">
                            {sources.map((source, index) => <SourceLink key={index} source={source} />)}
                        </div>
                    </div>
                )}

                {currentScholarships.length > 0 ? (
                    <>
                        {showBookmarks && <h3 className="font-bold text-lg text-slate-700">Your Bookmarks</h3>}
                        {currentScholarships.map((scholarship, index) => (
                        <ScholarshipCard 
                            key={`${scholarship.name}-${index}`} 
                            scholarship={scholarship} 
                            isBookmarked={bookmarks.some(b => b.link === scholarship.link && b.name === scholarship.name)}
                            onToggleBookmark={toggleBookmark}
                            onShare={handleShare}
                        />
                        ))}

                        {/* Pagination Controls */}
                        {totalItems > itemsPerPage && (
                            <div className="flex justify-center items-center gap-4 mt-6 py-4">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <ChevronLeftIcon />
                                </button>
                                <span className="text-sm text-slate-600 font-medium">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <ChevronRightIcon />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                     (searched || showBookmarks) && !error && (
                         <div className="text-center py-10 px-4">
                            <h3 className="text-lg font-semibold text-slate-700">{showBookmarks ? "No Bookmarks Yet" : "No Scholarships Found"}</h3>
                            <p className="text-slate-500 mt-2">{showBookmarks ? "Save scholarships you like to view them here." : "Try refining your search terms or adjusting filters for better results."}</p>
                        </div>
                     )
                )}
            </>
        )}
        
        {!isLoading && !showBookmarks && currentScholarships.length > 0 && (
             <div className="mt-8 p-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-lg text-center flex flex-col items-center">
                    <UserCircleIcon />
                    <h3 className="text-2xl font-bold mt-2">Need Personalized Guidance?</h3>
                    <p className="mt-2 mb-4 max-w-2xl">Let our experts at Abrobot help you navigate your scholarship journey and maximize your chances of success.</p>
                    <a 
                        href="https://www.abrobot.ai/contactus" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-white text-cyan-600 font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:bg-slate-100"
                    >
                        Contact an Expert
                    </a>
                </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipFinder;