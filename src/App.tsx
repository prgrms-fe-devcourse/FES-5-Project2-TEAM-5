import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <UserProvider>
      <WeatherProvider>
        <BrowserRouter>
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />{' '}
          {/* react-hot-toast */}
          <Header />
          <Routes>
            <Route path={PATHS.LOGIN} element={<Login />} />
            <Route path={PATHS.REGISTER} element={<Register />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/diary/form" element={<DiaryFormPage />} />
            <Route path="/diary/detail" element={<DiaryDetailPage />} />
            <Route path="/community" element={<DiaryList />} />
            <Route path="/users" element={<UserPage />} />
            <Route path={PATHS.MYPAGE} element={<Mypage />} />
            <Route path="/analysis/select-diary" element={<SelectDiary />} />
            <Route path="/analysis/emotion-and-quest" element={<EmotionAndQuest />} />
          </Routes>
        </BrowserRouter>
      </WeatherProvider>
    </UserProvider>
  );
}

export default App;
