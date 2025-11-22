import React from 'react';
import { ExternalLinkIcon } from './Icons';

const AboutUs: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-800">About AbroBot</h2>
        <p className="text-lg text-cyan-700 font-medium">
          India’s First AI-Powered Study Abroad Advisor
        </p>
        <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full"></div>
      </div>

      {/* Main Description */}
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-justify md:text-left">
        <p>
          <strong className="text-slate-800">AbroBot</strong> is an advanced AI-driven Study Abroad Advisor designed to assist students in making informed, efficient, and personalized decisions regarding their global education journeys.
        </p>
        <p>
          Developed by <strong className="text-slate-800">MNB Research</strong>, a premier strategy and technology consulting firm, AbroBot effectively connects ambition with opportunity. It integrates real student experiences, expert consultant insights, and sophisticated AI to provide clarity at every stage of the study abroad application process.
        </p>
        <p>
          From analyzing Statements of Purpose (SOPs) and identifying suitable scholarships to recommending optimal universities and preparing for language examinations, AbroBot serves as your reliable 24/7 virtual counselor, offering unbiased guidance tailored to your objectives.
        </p>
        <p>
          Our platform is supported by data from over <span className="font-semibold text-cyan-600">2.5 million verified student reviews</span> and enhanced by the expertise of more than <span className="font-semibold text-cyan-600">4,000 study abroad consultants globally</span>. This combination of human expertise and artificial intelligence guarantees that every recommendation is accurate, transparent, and focused on success.
        </p>
        <p>
            At AbroBot, we are committed to ensuring that every student has access to a personalized roadmap for global success—free from confusion, excessive costs, or misleading information. Whether you are a student seeking opportunities or a consultant aiming to leverage technology, AbroBot equips you with the necessary tools, insights, and support.
        </p>
      </div>

      {/* Vision, Mission, Powered By Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="text-3xl mb-3">🌍</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Our Vision</h3>
          <p className="text-sm text-slate-600 flex-grow">
            To democratize access to global education by providing AI-powered guidance to every student, regardless of their location.
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-xl border border-cyan-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Our Mission</h3>
          <p className="text-sm text-slate-600 flex-grow">
            To streamline and enhance the study abroad process through intelligent automation, authentic data, and human-centered design.
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
          <div className="text-3xl mb-3">💪</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Powered By</h3>
          <p className="text-sm text-slate-600 flex-grow">
            <strong>MNB Research</strong> — a reputable leader in strategic consulting, business intelligence, and digital innovation.
          </p>
           <a 
            href="https://www.mnbresearch.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-medium text-indigo-600 mt-3 hover:underline self-start"
          >
            Visit MNB Research <ExternalLinkIcon />
          </a>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-slate-800 text-white rounded-xl p-8 text-center shadow-lg">
        <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
          <div className="flex items-center gap-3 group">
            <span className="bg-slate-700 p-2.5 rounded-full group-hover:bg-cyan-600 transition-colors">📧</span>
            <a href="mailto:contact@mnbresearch.com" className="hover:text-cyan-300 transition-colors font-medium">contact@mnbresearch.com</a>
          </div>
          <div className="flex items-center gap-3 group">
            <span className="bg-slate-700 p-2.5 rounded-full group-hover:bg-cyan-600 transition-colors">📞</span>
            <a href="tel:+919711488481" className="hover:text-cyan-300 transition-colors font-medium">+91 9711488481</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;