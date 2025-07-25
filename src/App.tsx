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

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} /> {/* react-hot-toast */}
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/diary/form" element={<DiaryFormPage />} />
        <Route path="/diary/detail" element={<DiaryDetailPage />} />
        <Route path="/feed-diaries" element={<DiaryList />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/analysis/select-diary" element={<SelectDiary />} />
        <Route path="/analysis/emotion-and-quest" element={<EmotionAndQuest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
