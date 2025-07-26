import { useId, useState } from 'react';
import Molly from './components/Molly';
import { IoArrowUpCircleOutline } from 'react-icons/io5';
import { IoIosClose } from 'react-icons/io';

import S from './style.module.css';

const Home = () => {
  const chatId = useId();
  const [isChatActive, setIsChatActive] = useState<boolean>(false);

  const handleOpenChat = () => {
    setIsChatActive(true);
  };

  const handleChatClose = () => {
    setIsChatActive(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault;
  };

  return (
    <main className={S.container}>
      <div className={S.overlay}>
        {isChatActive ? (
          <section className={S.chatSection}>
            <h2 className="sr-only">채팅창</h2>
            <button
              className={S.chatCloseButton}
              type="button"
              aria-label="채팅창 닫기"
              onClick={handleChatClose}
            >
              <IoIosClose size={24} />
            </button>
          </section>
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

        <form className={S.form} onSubmit={handleSubmit}>
          <label htmlFor={chatId} className="sr-only">
            AI와 채팅
          </label>
          <input
            className={S.chat}
            type="text"
            name="chat"
            id={chatId}
            placeholder="몰리에게 말을 걸어주세요."
            onClick={handleOpenChat}
          />
          <button type="submit" className={S.submitButton}>
            <IoArrowUpCircleOutline size={24} />
          </button>
        </form>
      </div>
    </main>
  );
};
export default Home;
