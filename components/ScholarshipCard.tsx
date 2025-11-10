import React from 'react';
import type { Scholarship } from '../types';
import { CalendarIcon, ExternalLinkIcon, BuildingLibraryIcon, UserCircleIcon } from './Icons';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-200 overflow-hidden">
        <div className="p-5">
            <h3 className="text-lg font-bold text-cyan-700">{scholarship.name}</h3>
            <div className="flex items-center text-sm text-slate-500 mt-1 mb-3">
                <BuildingLibraryIcon />
                <span className="ml-2">{scholarship.provider}</span>
            </div>
            <p className="text-slate-600 text-sm mb-4">{scholarship.description}</p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                 <div className="flex items-center text-sm font-medium bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
                     <CalendarIcon/>
                     <span className="ml-2">Deadline: {scholarship.deadline}</span>
                 </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <a 
                        href="https://abrobot.com/contact-us"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-white hover:bg-slate-100 text-cyan-600 font-semibold text-sm py-2 px-4 rounded-lg transition duration-300 border border-cyan-500"
                        title="Get help with your application from Abrobot"
                    >
                        <UserCircleIcon />
                        Get Help Applying
                    </a>
                    <a 
                        href={scholarship.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm py-2 px-4 rounded-lg transition duration-300"
                    >
                        Learn More
                        <ExternalLinkIcon />
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ScholarshipCard;