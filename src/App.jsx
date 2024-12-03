import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './components/Admin/Admin';
import ProductsList from './components/Products/ProductsList';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/products" element={<ProductsList />} />
      </Routes>
    </Router>
  );
}

export default App;
