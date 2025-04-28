import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Inventory from './pages/Inventory/Inventory';
import Footer from './components/Footer/Footer';
import './styles/global.css';
import './styles/variables.css';
import './styles/animations.css';
import InventoryItemPage from "./pages/InventoryItemPage/InventoryItemPage";

function App() {
    useEffect(() => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';

        const timer = setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Router>
            <div className="App">
                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/items/:itemId" element={<InventoryItemPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;