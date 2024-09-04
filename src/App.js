
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import RegisterUser from './pages/RegisterUser';
import AssignTask from './pages/AssignTask';
import TrackTask from './pages/TrackTask';
import ScreenshotGallery from './pages/ScreenshotGallery';
 

function App() {
  return (

    <Router>
      <Header />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/add-user" element={<RegisterUser />} />
          <Route path="/shots" element={< ScreenshotGallery   />} />
          <Route path="/assign-task" element={<AssignTask />} />
          <Route path="/track-task" element={<TrackTask />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
