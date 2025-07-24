import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/global.css';

import { Toaster } from 'react-hot-toast';

// 감정분석 페이지
import SelectDiary from './pages/analysis/SelectDiary/index';
import EmotionAndQuest from './pages/analysis/EmotionAndQuest/index';
import SelectQuest from './pages/analysis/SelectQuest/index';

function App() {
  return (
    <BrowserRouter>
      <Toaster /> {/* react-hot-toast */}
      <Routes>
        {/* 테스트용: / 경로에서 세 가지 페이지 모두 렌더링 */}
        <Route
          path="/"
          element={
            <div>
              {/* <SelectDiary /> */}
              {/* <EmotionAndQuest /> */}
              {/* <QuestSelect /> */}
            </div>
          }
        />

        {/* 감정분석 플로우 */}
        <Route path="/analysis/select-diary" element={<SelectDiary />} />
        <Route path="/analysis/emotion-and-quest" element={<EmotionAndQuest />} />
        <Route path="/analysis/quest-select" element={<SelectQuest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;