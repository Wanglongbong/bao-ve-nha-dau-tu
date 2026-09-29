import React, { useState } from 'react';
import { RouterProvider, useRouter } from '@/router';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SelectionAssistant } from '@/components/selection-assistant';
import { InvestorAiAssistant } from '@/components/investor-ai-assistant';
import { TeamDetailModal } from '@/components/team-detail-modal';
import { HomePage } from '@/pages/HomePage';
import { TeamPage } from '@/pages/TeamPage';
import { AiPlatformPage } from '@/pages/AiPlatformPage';
import { NewsPage } from '@/pages/NewsPage';
import { ForumPage } from '@/pages/ForumPage';
import { WordDocumentPage } from '@/pages/WordDocumentPage';
import { BackgroundMusic } from '@/components/background-music';
import { soundFx } from '@/lib/audio-effects';

function AppContent() {
  const { pathname } = useRouter();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedMemberSlug, setSelectedMemberSlug] = useState<string | null>(null);

  const handleOpenAi = () => {
    soundFx.playChime();
    setIsAiOpen(true);
  };

  const handleOpenViewer = () => {
    soundFx.playTap();
    const el = document.getElementById('toan-van');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTeamModal = (slug?: string) => {
    soundFx.playTap();
    setSelectedMemberSlug(slug || null);
    setIsTeamModalOpen(true);
  };

  const renderPage = () => {
    if (pathname === '/doi-ngu' || pathname.startsWith('/doi-ngu')) {
      return <TeamPage />;
    }
    if (pathname === '/dien-dan' || pathname.startsWith('/dien-dan')) {
      return <ForumPage />;
    }
    if (pathname === '/nen-tang-ai' || pathname.startsWith('/nen-tang-ai')) {
      return <AiPlatformPage />;
    }
    if (pathname === '/tin-tuc' || pathname.startsWith('/tin-tuc')) {
      return <NewsPage />;
    }
    if (pathname === '/ban-word' || pathname.startsWith('/ban-word') || pathname === '/toan-van' || pathname.startsWith('/toan-van')) {
      return <WordDocumentPage />;
    }
    return (
      <HomePage
        onOpenAi={handleOpenAi}
        onOpenViewer={handleOpenViewer}
        onOpenTeamModal={handleOpenTeamModal}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF7] text-[#0A131E] relative">
      {/* Main Navigation Header */}
      <SiteHeader
        onOpenAi={handleOpenAi}
        onOpenViewer={handleOpenViewer}
      />

      {/* Dynamic Page Content */}
      <div id="main-content" className="flex-1">
        {renderPage()}
      </div>

      {/* Footer */}
      <SiteFooter />

      {/* Floating Selection Assistant */}
      <SelectionAssistant
        onAsk={() => handleOpenAi()}
      />

      {/* Interactive AI Legal Assistant Modal */}
      <InvestorAiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      {/* Interactive Team Detail Modal */}
      <TeamDetailModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        initialMemberSlug={selectedMemberSlug}
      />

      {/* Royal Background Music Player (Life in Motion) */}
      <BackgroundMusic />
    </div>
  );
}

export function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
