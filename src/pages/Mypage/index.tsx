import { useState } from 'react';
import ChangeUserInfo from './components/ChangeUserInfo';
import DiarySection from './components/DiarySection';
import TabNav from './components/TabNav';
import UserInfoSection from '../../shared/components/UserInfoSection';
import S from './style.module.css';
import type { TabType } from './utils/type';
import DiaryWeather from '@/shared/components/DiaryWeather';
import { useUserContext } from '@/shared/context/UserContext';

const Mypage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('diary');
  const { userInfo } = useUserContext();

  return (
    <main className={S.container}>
      <DiaryWeather title="My page" />
      <UserInfoSection userInfo={userInfo} />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'diary' && <DiarySection />}
      {activeTab === 'changeInfo' && <ChangeUserInfo />}
    </main>
  );
};
export default Mypage;
