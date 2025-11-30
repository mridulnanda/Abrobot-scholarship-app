import React from 'react';
import type { Scholarship } from '../types';
import { CalendarIcon, ExternalLinkIcon, BuildingLibraryIcon, UserCircleIcon, BookmarkIcon, BookmarkSolidIcon, ShareIcon } from './Icons';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isBookmarked?: boolean;
  onToggleBookmark?: (scholarship: Scholarship) => void;
  onShare?: (scholarship: Scholarship) => void;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship, isBookmarked = false, onToggleBookmark, onShare }) => {
  // Helper to format deadline for display
  const displayDeadline = React.useMemo(() => {
    const d = scholarship.deadline;
    if (!d) return "Rolling";
    const lower = d.toLowerCase();
    
    // Consistent list with ScholarshipFinder sorting logic
    const rollingKeywords = [
       'rolling', 'open', 'unknown', 'n/a', 'varies', 'ongoing', 
       'year-round', 'anytime', 'tba', 'tbd', 'check website', 'soon'
    ];
    
    if (rollingKeywords.some(k => lower.includes(k))) {
        return "Rolling";
    }
    
    // Try to parse as date for nicer format
    const date = new Date(d);
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return d;
  }, [scholarship.deadline]);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-cyan-200 overflow-hidden group flex flex-col h-full transform hover:-translate-y-1 relative">
         {/* Top Gradient Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="p-6 flex flex-col flex-grow">
            {/* Header: Provider & Actions */}
            <div className="flex justify-between items-start gap-4 mb-3">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <BuildingLibraryIcon />
                    <span className="line-clamp-1">{scholarship.provider}</span>
                </div>
                <div className="flex gap-1 shrink-0 -mr-2 -mt-1">
                    {onShare && (
                         <button 
                            onClick={() => onShare(scholarship)}
                            className="p-2 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                            title="Share this scholarship"
                        >
                            <ShareIcon />
                        </button>
                    )}
                    {onToggleBookmark && (
                        <button 
                            onClick={() => onToggleBookmark(scholarship)}
                            className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-cyan-600 bg-cyan-50' : 'text-slate-400 hover:text-cyan-600 hover:bg-cyan-50'}`}
                            title={isBookmarked ? "Remove bookmark" : "Bookmark this scholarship"}
                        >
                            {isBookmarked ? <BookmarkSolidIcon /> : <BookmarkIcon />}
                        </button>
                    )}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-cyan-700 transition-colors leading-tight">
                {scholarship.name}
            </h3>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                {scholarship.description}
            </p>
            
            {/* Footer: Divider, Deadline, Buttons */}
            <div className="pt-4 border-t border-slate-100 mt-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide ${displayDeadline === 'Rolling' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                         <CalendarIcon/>
                         <span className="ml-2">Due: {displayDeadline}</span>
                     </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <a 
                            href="https://www.abrobot.ai/contactus"
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50 transition-all duration-200"
                            title="Get help with your application from Abrobot"
                        >
                            <UserCircleIcon />
                            <span className="hidden sm:inline">Get Help</span>
                            <span className="sm:hidden">Get Help</span>
                        </a>
                        <a 
                            href={scholarship.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold py-2 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Apply
                            <ExternalLinkIcon />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ScholarshipCard;