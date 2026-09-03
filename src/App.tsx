import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import EmailGenerator from '@/pages/EmailGenerator';
import MeetingSummarizer from '@/pages/MeetingSummarizer';
import TaskPlanner from '@/pages/TaskPlanner';
import ResearchAssistant from '@/pages/ResearchAssistant';
import Chatbot from '@/pages/Chatbot';
import type { PageKey } from '@/lib/types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'email':
        return <EmailGenerator />;
      case 'meeting':
        return <MeetingSummarizer />;
      case 'tasks':
        return <TaskPlanner />;
      case 'research':
        return <ResearchAssistant />;
      case 'chatbot':
        return <Chatbot />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="lg:ml-72 pt-14 lg:pt-0 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
