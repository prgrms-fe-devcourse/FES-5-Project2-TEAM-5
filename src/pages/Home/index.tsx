import { useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import Molly from './components/Molly';
import QuestSection from './components/QuestSection';
import { useChatMessages } from './hooks/useChatMessages';
import style from './style.module.css';

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const { messages, isAiTyping, isLoading, ref, userProfileUrl, isMessageExceeded, isReady } =
    useChatMessages();

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  return (
    <main className={style.container}>
      <div className={style.overlay}>
        {/* 퀘스트 */}
        <QuestSection />
        {isChatOpen ? (
          // 채팅창
          <ChatMessages
            onClose={handleChatClose}
            messages={messages}
            isLoading={isLoading}
            ref={ref}
            isAiTyping={isAiTyping}
            userProfileUrl={userProfileUrl ?? null}
          />
        ) : (
          // 몰리 AI 캐릭터
          <section className={style.cardSection}>
            <h2 className="sr-only">AI 케릭터 섹션</h2>
            <div className={style.cardImage}>
              <Molly />
            </div>
            <div className={style.letter}>
              <span>My little garden looking into my heart</span>
            </div>
          </section>
        )}
        {/* 채팅 input */}
        <ChatInput
          onOpenChat={handleOpenChat}
          disabled={isAiTyping}
          isMessageExceeded={isMessageExceeded}
          isReady={isReady}
        />
      </div>
    </main>
  );
};
export default Home;
