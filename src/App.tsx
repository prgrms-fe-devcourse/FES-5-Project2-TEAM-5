import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/global.css';

import { Toaster } from 'react-hot-toast';
import UserList from './pages/users/UserList';
function App() {
  return (
    <BrowserRouter>
      <Toaster /> {/* react-hot-toast */}
      <Routes>
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
