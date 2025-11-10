import React from 'react';
import type { NewsArticle } from '../types';
import { CalendarIcon, ExternalLinkIcon } from './Icons';

interface NewsArticleCardProps {
  article: NewsArticle;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-200 overflow-hidden">
        <div className="p-5">
            <p className="text-sm font-semibold text-cyan-600 mb-1">{article.source}</p>
            <h3 className="text-lg font-bold text-slate-800">{article.title}</h3>
            <p className="text-slate-600 text-sm my-3">{article.summary}</p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center text-xs text-slate-500">
                    <CalendarIcon/>
                    <span className="ml-2">{article.publishedDate}</span>
                </div>
                <a 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-slate-600 hover:bg-slate-700 text-white font-semibold text-sm py-2 px-4 rounded-lg transition duration-300"
                >
                    Read Full Article
                    <ExternalLinkIcon />
                </a>
            </div>
        </div>
    </div>
  );
};

export default NewsArticleCard;
