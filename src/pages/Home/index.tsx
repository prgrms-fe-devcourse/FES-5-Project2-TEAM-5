import { useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import Molly from './components/Molly';
import S from './style.module.css';
import QuestSection from './components/QuestSection';

const Home = () => {
  const [isChatActive, setIsChatActive] = useState<boolean>(false);

  const handleOpenChat = () => {
    setIsChatActive(true);
  };

  const handleChatClose = () => {
    setIsChatActive(false);
  };

  return (
    <main className={S.container}>
      <div className={S.overlay}>
        {/* 퀘스트 */}
        <QuestSection />
        {isChatActive ? (
          <ChatMessages onClose={handleChatClose} />
        ) : (
          <section className={S.cardSection}>
            <h2 className="sr-only">AI 케릭터 섹션</h2>
            <div className={S.cardImage}>
              <Molly />
            </div>
            <div className={S.letter}>
              <span>My little garden looking into my heart</span>
            </div>
          </section>
        )}
        <ChatInput onOpenChat={handleOpenChat} />
      </div>
    </main>
  );
};
export default Home;
