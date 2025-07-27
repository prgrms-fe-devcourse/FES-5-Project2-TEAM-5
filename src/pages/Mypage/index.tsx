import { useState } from 'react';
import ChangeUserInfo from './components/ChangeUserInfo';
import DiarySection from './components/DiarySection';
import TabNav from './components/TabNav';
import UserInfoSection from './components/UserInfoSection';
import S from './style.module.css';
import type { TabType } from './utils/type';
import DiaryWeather from '@/shared/components/DiaryWeather';

const Mypage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('diary');

  return (
    <main className={S.container}>
      <DiaryWeather title="My page" />
      <UserInfoSection />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'diary' && <DiarySection />}
      {activeTab === 'changeInfo' && <ChangeUserInfo />}
    </main>
  );
};
export default Mypage;
