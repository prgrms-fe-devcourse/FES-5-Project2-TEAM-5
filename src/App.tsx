import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/global.css';

import { Toaster } from 'react-hot-toast';

// 감정분석 페이지
import SelectDiary from './pages/analysis/SelectDiary';
import EmotionAndQuest from './pages/analysis/EmotionAndQuest';

function App() {
  return (
    <BrowserRouter>
      <Toaster /> {/* react-hot-toast */}
      <Routes>
        <Route path="/analysis/select-diary" element={<SelectDiary />} />
        <Route path="/analysis/emotion-and-quest" element={<EmotionAndQuest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;