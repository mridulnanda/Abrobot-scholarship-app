import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ScholarshipFinder from './components/ScholarshipFinder';
import NewsFeed from './components/NewsFeed';
import { BookOpenIcon, NewspaperIcon } from './components/Icons';

type Tab = 'scholarships' | 'news';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('scholarships');

  const renderContent = () => {
    switch (activeTab) {
      case 'scholarships':
        return <ScholarshipFinder />;
      case 'news':
        return <NewsFeed />;
      default:
        return <ScholarshipFinder />;
    }
  };

  const TabButton: React.FC<{ tabName: Tab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
        activeTab === tabName
          ? 'bg-cyan-600 text-white shadow-md'
          : 'bg-white text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-2 md:gap-4 p-1 bg-slate-200 rounded-lg mb-6">
            <TabButton tabName="scholarships" label="Scholarship Finder" icon={<BookOpenIcon />} />
            <TabButton tabName="news" label="Latest News" icon={<NewspaperIcon />} />
          </div>
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
