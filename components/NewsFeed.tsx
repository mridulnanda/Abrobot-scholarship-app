import React, { useState, useEffect, useCallback } from 'react';
import { getLatestNews } from '../services/geminiService';
import type { NewsArticle, GroundingSource } from '../types';
import LoadingSpinner from './LoadingSpinner';
import NewsArticleCard from './NewsArticleCard';
import SourceLink from './SourceLink';
import { RefreshIcon, WarningIcon, NewspaperIcon, ChevronDownIcon } from './Icons';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Pagination / Load More state
  const [visibleCount, setVisibleCount] = useState(6);
  const BATCH_SIZE = 6;

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setVisibleCount(BATCH_SIZE); // Reset visible count on refresh
    try {
      const result = await getLatestNews();
      setArticles(result.articles);
      setSources(result.sources);
      setLastUpdated(new Date());
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

  const handleLoadMore = () => {
      setVisibleCount(prev => prev + BATCH_SIZE);
  };

  const visibleArticles = articles.slice(0, visibleCount);

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
             <div className="flex flex-col">
                 <h2 className="text-xl font-bold text-slate-800">Latest Student News</h2>
                 {lastUpdated && !isLoading && !error && (
                     <span className="text-xs text-slate-400 font-medium mt-1">
                         Updated: {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                 )}
             </div>
             <button 
                onClick={fetchNews} 
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                 <RefreshIcon />
                 Refresh
             </button>
        </div>
      
      {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center my-6 shadow-sm transition-all animate-fadeIn">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <WarningIcon />
              </div>
              <h3 className="text-red-900 font-bold text-lg mb-2">Oops! Something went wrong</h3>
              <p className="text-red-700 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                  We encountered an issue while fetching the latest news. {error !== 'An unknown error occurred.' ? "The server reported: " + error : "It might be a temporary connection glitch."}
              </p>
              <button 
                onClick={fetchNews}
                className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                  Retry Fetching News
              </button>
          </div>
      )}
      
      <div className="space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-slate-600 pt-8 pb-12">
            <LoadingSpinner />
            <p className="mt-4 text-sm font-medium text-slate-500">Fetching the latest updates for you...</p>
          </div>
        )}

        {!isLoading && articles.length > 0 && (
          <>
            {sources.length > 0 && (
                <div className="p-3 bg-slate-100 rounded-lg mb-4">
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">Sources:</h3>
                    <div className="flex flex-wrap gap-2">
                        {sources.map((source, index) => <SourceLink key={index} source={source} />)}
                    </div>
                </div>
            )}
            
            <div className="space-y-4">
                {visibleArticles.map((article, index) => (
                <NewsArticleCard key={index} article={article} />
                ))}
            </div>

            {visibleCount < articles.length && (
                <div className="flex justify-center mt-8 pt-2">
                    <button
                        onClick={handleLoadMore}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-cyan-700 font-semibold rounded-full hover:bg-cyan-50 hover:border-cyan-200 transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                        Load More News
                        <ChevronDownIcon />
                    </button>
                </div>
            )}
          </>
        )}
        
        {!isLoading && articles.length === 0 && !error && (
             <div className="text-center py-16 px-6 bg-slate-50 rounded-2xl border border-slate-100 dashed-border">
                <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                     <div className="transform scale-125">
                        <NewspaperIcon />
                     </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">All Caught Up!</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                    It seems the news desk is quiet at the moment. The world of education is always moving, so check back shortly for fresh updates and opportunities!
                </p>
                <button 
                    onClick={fetchNews}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                    <RefreshIcon />
                    Check Again
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;