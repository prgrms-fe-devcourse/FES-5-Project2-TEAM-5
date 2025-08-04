import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/global.css';

import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DiaryPage from './pages/diary/DiaryMain';
import DiaryFormPage from './pages/diary/DiaryForm';
import DiaryList from './pages/feed-diaries/DiaryList';
import UserPage from './pages/users/UserList';
import Header from './shared/components/Header';
import Mypage from './pages/Mypage';
import DiaryDetailPage from './pages/diary/DiaryDetail';
import SelectDiary from './pages/analysis/SelectDiary';
import EmotionAndQuest from './pages/analysis/EmotionAndQuest';
import { UserProvider } from './shared/context/UserContext';
import { PATHS } from './shared/constants/path';
import { WeatherProvider } from './shared/context/WeatherContext';
import Home from './pages/Home';
import { ProtectedLayout } from './shared/components/ProtectedLayout';
import About from './pages/About';
import AuthCallback from './pages/auth/AuthCallback';
import UserDetail from './pages/users/UserDetail';
import NotFound from './pages/NotFound';
import { ScrollTopButton } from './shared/components/ScrollTopButton';

function App() {
  return (
    <UserProvider>
      <WeatherProvider>
        <BrowserRouter>
          <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
          <Header />
          <Routes>
            {/* 로그인 필요 없는 페이지 */}
            <Route path="/" element={<Navigate to={PATHS.ABOUT} replace />} />
            <Route path={PATHS.LOGIN} element={<Login />} />
            <Route path={PATHS.REGISTER} element={<Register />} />
            <Route path={PATHS.ABOUT} element={<About />} />
            <Route path={PATHS.AUTH_CALLBACK} element={<AuthCallback />} />

            {/* 로그인이 필요한 페이지는  ProtectedLayout 안에 위치 */}
            <Route element={<ProtectedLayout />}>
              <Route path={PATHS.HOME} element={<Home />} />
              <Route path={PATHS.MYPAGE} element={<Mypage />} />
              <Route path={PATHS.DIARY} element={<DiaryPage />} />
              <Route path={PATHS.DIARY_FORM} element={<DiaryFormPage />} />
              <Route path={PATHS.DIARY_DETAIL} element={<DiaryDetailPage />} />
              <Route path={PATHS.ANALYSIS_SELECT} element={<SelectDiary />} />
              <Route path={PATHS.ANALYSIS_QUEST} element={<EmotionAndQuest />} />
            </Route>

            <Route path={PATHS.COMMUNITY} element={<DiaryList />} />
            <Route path={PATHS.USER} element={<UserPage />} />
            <Route path={PATHS.USER_DETAIL} element={<UserDetail />} />
            <Route path={PATHS.NOT_FOUND} element={<NotFound />} />
          </Routes>
          <ScrollTopButton threshold={200} />
        </BrowserRouter>
      </WeatherProvider>
    </UserProvider>
  );
}

export default App;
