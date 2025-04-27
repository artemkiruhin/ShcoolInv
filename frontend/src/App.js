import { useEffect } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import './styles/global.css';
import './styles/variables.css';
import './styles/animations.css';

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
        <div className="App">
            <Dashboard />
        </div>
    );
}

export default App;