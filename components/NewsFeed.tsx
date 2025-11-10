import React, { useState, useEffect, useCallback } from 'react';
import { getLatestNews } from '../services/geminiService';
import type { NewsArticle, GroundingSource } from '../types';
import LoadingSpinner from './LoadingSpinner';
import NewsArticleCard from './NewsArticleCard';
import SourceLink from './SourceLink';
import { RefreshIcon } from './Icons';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getLatestNews();
      setArticles(result.articles);
      setSources(result.sources);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-slate-800">Latest Student News</h2>
             <button 
                onClick={fetchNews} 
                disabled={isLoading}
                className="p-2 rounded-full hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
                 <RefreshIcon />
             </button>
        </div>
      
      {error && <p className="text-red-500 text-center p-4">{error}</p>}
      
      <div className="space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-slate-600 pt-8">
            <LoadingSpinner />
            <p className="mt-2 text-sm">Fetching the latest updates...</p>
          </div>
        )}

        {!isLoading && articles.length > 0 && (
          <>
            {sources.length > 0 && (
                <div className="p-3 bg-slate-100 rounded-lg">
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">Sources:</h3>
                    <div className="flex flex-wrap gap-2">
                        {sources.map((source, index) => <SourceLink key={index} source={source} />)}
                    </div>
                </div>
            )}
            {articles.map((article, index) => (
              <NewsArticleCard key={index} article={article} />
            ))}
          </>
        )}
        
        {!isLoading && articles.length === 0 && !error && (
            <div className="text-center py-10 px-4">
                <h3 className="text-lg font-semibold text-slate-700">No News Found</h3>
                <p className="text-slate-500 mt-2">Could not fetch news at this time. Please try again later.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
