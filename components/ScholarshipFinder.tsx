import React, { useState } from 'react';
import { findScholarships } from '../services/geminiService';
import type { Scholarship, GroundingSource } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ScholarshipCard from './ScholarshipCard';
import { SearchIcon, UserCircleIcon, WarningIcon } from './Icons';
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a main search topic.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearched(true);
    setScholarships([]);
    setSources([]);

    try {
      const filters = { major, academicLevel, location, gpa };
      const result = await findScholarships(query, filters);
      setScholarships(result.scholarships);
      setSources(result.sources);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
        <div className="mb-6 p-4 bg-slate-100/80 rounded-lg border border-slate-200">
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

      <form onSubmit={handleSearch} className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter main topic, e.g., 'scholarships for women in STEM'"
          className="w-full pl-4 pr-12 py-3 border-2 border-slate-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
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
      
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-4" role="alert">
                <div className="flex items-center">
                    <WarningIcon />
                    <h3 className="font-bold ml-2">An Error Occurred</h3>
                </div>
                <p className="mt-2 text-sm">{error}</p>
                <div className="mt-3 text-sm">
                    <p className="font-semibold">Here are a few tips:</p>
                    <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
                        <li>Try using broader or different search terms.</li>
                        <li>Ensure there are no typos in your query.</li>
                        <li>Adjust or simplify the filters you've applied.</li>
                    </ul>
                </div>
            </div>
        )}
      
      <div className="space-y-4">
        {isLoading && (
            <div className="flex flex-col items-center justify-center text-slate-600 py-10">
                <LoadingSpinner />
                <p className="mt-2 text-sm">Searching for the best opportunities...</p>
            </div>
        )}

        {!isLoading && scholarships.length > 0 && (
          <>
            {sources.length > 0 && (
                <div className="p-3 bg-slate-100 rounded-lg">
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">Sources:</h3>
                    <div className="flex flex-wrap gap-2">
                        {sources.map((source, index) => <SourceLink key={index} source={source} />)}
                    </div>
                </div>
            )}
            {scholarships.map((scholarship, index) => (
              <ScholarshipCard key={index} scholarship={scholarship} />
            ))}
             <div className="mt-8 p-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-lg text-center flex flex-col items-center">
                    <UserCircleIcon />
                    <h3 className="text-2xl font-bold mt-2">Need Personalized Guidance?</h3>
                    <p className="mt-2 mb-4 max-w-2xl">Let our experts at Abrobot help you navigate your scholarship journey and maximize your chances of success.</p>
                    <a 
                        href="https://abrobot.com/contact-us" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-white text-cyan-600 font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:bg-slate-100"
                    >
                        Contact an Expert
                    </a>
                </div>
          </>
        )}

        {!isLoading && searched && scholarships.length === 0 && !error && (
            <div className="text-center py-10 px-4">
                <h3 className="text-lg font-semibold text-slate-700">No Scholarships Found</h3>
                <p className="text-slate-500 mt-2">Try refining your search terms or adjusting filters for better results.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipFinder;