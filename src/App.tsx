import React, { Suspense, lazy, useState } from 'react';
import { RouterProvider, useRouter } from '@/router';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SelectionAssistant } from '@/components/selection-assistant';
import { BackgroundMusic } from '@/components/background-music';
import { soundFx } from '@/lib/audio-effects';

const TeamPage = lazy(() => import('@/pages/TeamPage').then((module) => ({ default: module.TeamPage })));
const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })));
const AiPlatformPage = lazy(() => import('@/pages/AiPlatformPage').then((module) => ({ default: module.AiPlatformPage })));
const NewsPage = lazy(() => import('@/pages/NewsPage').then((module) => ({ default: module.NewsPage })));
const ForumPage = lazy(() => import('@/pages/ForumPage').then((module) => ({ default: module.ForumPage })));
const WordDocumentPage = lazy(() => import('@/pages/WordDocumentPage').then((module) => ({ default: module.WordDocumentPage })));
const InvestorAiAssistant = lazy(() => import('@/components/investor-ai-assistant').then((module) => ({ default: module.InvestorAiAssistant })));
const TeamDetailModal = lazy(() => import('@/components/team-detail-modal').then((module) => ({ default: module.TeamDetailModal })));

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
    <div className="min-h-screen flex flex-col bg-[#FFFBF7] text-[#2D211B] relative">
      {/* Main Navigation Header */}
      <SiteHeader
        onOpenAi={handleOpenAi}
        onOpenViewer={handleOpenViewer}
      />

      {/* Dynamic Page Content */}
      <div id="main-content" className="flex-1">
        <Suspense fallback={<div className="site-shell py-20 text-center text-orange-800">Đang mở nội dung…</div>}>
          {renderPage()}
        </Suspense>
      </div>

      {/* Footer */}
      <SiteFooter />

      {/* Floating Selection Assistant */}
      <SelectionAssistant
        onAsk={() => handleOpenAi()}
      />

      {/* Interactive AI Legal Assistant Modal */}
      {isAiOpen && (
        <Suspense fallback={null}>
          <InvestorAiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        </Suspense>
      )}

      {/* Interactive Team Detail Modal */}
      {isTeamModalOpen && (
        <Suspense fallback={null}>
          <TeamDetailModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} initialMemberSlug={selectedMemberSlug} />
        </Suspense>
      )}

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
