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
        <Route path="/feed-diaries" element={<DiaryList />} />
        <Route path="/users" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
