import { useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import Molly from './components/Molly';
import QuestSection from './components/QuestSection';
import { useChatMessages } from './hooks/useChatMessages';
import style from './style.module.css';

const Home = () => {
  const [isChatActive, setIsChatActive] = useState<boolean>(false);
  const { messages, isAiTyping, isLoading, ref, userProfileUrl, isMessageLimitExceeded } =
    useChatMessages();

  const handleOpenChat = () => {
    setIsChatActive(true);
  };

  const handleChatClose = () => {
    setIsChatActive(false);
  };

  return (
    <main className={style.container}>
      <div className={style.overlay}>
        {/* 퀘스트 */}
        <QuestSection />
        {isChatActive ? (
          <ChatMessages
            onClose={handleChatClose}
            messages={messages}
            isLoading={isLoading}
            ref={ref}
            isAiTyping={isAiTyping}
            userProfileUrl={userProfileUrl ?? null}
          />
        ) : (
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
        <ChatInput
          onOpenChat={handleOpenChat}
          disabled={isAiTyping}
          isMessageLimitExceeded={isMessageLimitExceeded}
        />
      </div>
    </main>
  );
};
export default Home;
