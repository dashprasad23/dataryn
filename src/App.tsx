import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/main.scss';
import Home from './components/Home/Home';
import MainWindow from './components/Main/MainWindow';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<MainWindow />} />
      </Routes>
    </Router>
  );
}

export default App;
