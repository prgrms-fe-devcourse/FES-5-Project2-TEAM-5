import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/global.css';

import { Toaster } from 'react-hot-toast';
import DiaryPage from './pages/Diary/diaryMain';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/diary" element={<DiaryPage />} />
      </Routes>
      <Toaster /> {/* react-hot-toast */}
    </BrowserRouter>
  );
}

export default App;
