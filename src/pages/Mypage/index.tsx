import { useState } from 'react';
import DiarySection from './components/DiarySection';
import S from './style.module.css';
import type { TabType } from './utils/type';
import TabNav from './components/TabNav';
import ChangeUserInfo from './components/ChangeUserInfo';
import UserInfoSection from './components/UserInfoSection';

const Mypage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('diary');

  return (
    <main className={S.container}>
      <div className={S.banner}></div>
      <UserInfoSection />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'diary' && <DiarySection />}
      {activeTab === 'changeInfo' && <ChangeUserInfo />}
    </main>
  );
};
export default Mypage;
