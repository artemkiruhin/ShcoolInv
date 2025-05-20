import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/pages/Dashboard';
import InventoryList from './components/pages/Inventory/InventoryList';
import InventoryItemForm from './components/pages/Inventory/InventoryItemForm';
import InventoryView from './components/pages/Inventory/InventoryView';
import CategoriesList from './components/pages/Categories/CategoriesList';
import CategoryForm from './components/pages/Categories/CategoriesForm';
import ConsumablesList from './components/pages/Consumables/ConsumablesList';
import ConsumableForm from './components/pages/Consumables/ConsumablesForm';
import RoomsList from './components/pages/Rooms/RoomsList';
import RoomForm from './components/pages/Rooms/RoomsForm';
import UsersList from './components/pages/Users/UsersList';
import UserForm from './components/pages/Users/UsersForm';
import LogsList from './components/pages/Logs/LogsList';

import LoginPage from "./components/pages/LoginPage/LoginPage";
import AuthContext from "./context/AuthContext";
import AdminContext from "./context/AdminContext";
// import './index.css';
// import "../src/assets/styles/global.css";
import './App.css'
import "./assets/styles/QRCodeModal.css"

const ProtectedLayout = () => {
    return (
        <AuthContext>
            <Layout>
                <Outlet />
            </Layout>
        </AuthContext>
    );
};

const AdminRoutes = () => {
    return (
        <AdminContext>
            <Outlet />
        </AdminContext>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Публичный роут */}
                <Route path="/login" element={<LoginPage />} />

                {/* Все защищённые роуты */}
                <Route element={<ProtectedLayout />}>
                    {/* Общие роуты для всех авторизованных */}
                    <Route index element={<Dashboard />} />
                    <Route path="/inventory" element={<InventoryList />} />
                    <Route path="/inventory/new" element={<InventoryItemForm />} />
                    <Route path="/inventory/:id" element={<InventoryView />} />
                    <Route path="/inventory/:id/edit" element={<InventoryItemForm />} />

                    <Route path="/categories" element={<CategoriesList />} />
                    <Route path="/categories/new" element={<CategoryForm />} />
                    <Route path="/categories/:id/edit" element={<CategoryForm />} />

                    <Route path="/consumables" element={<ConsumablesList />} />
                    <Route path="/consumables/new" element={<ConsumableForm />} />
                    <Route path="/consumables/:id/edit" element={<ConsumableForm />} />

                    <Route path="/rooms" element={<RoomsList />} />
                    <Route path="/rooms/new" element={<RoomForm />} />
                    <Route path="/rooms/:id/edit" element={<RoomForm />} />

                    {/* Админские роуты */}
                    <Route element={<AdminRoutes />}>
                        <Route path="/users" element={<UsersList />} />
                        <Route path="/users/new" element={<UserForm />} />
                        <Route path="/users/:id/edit" element={<UserForm />} />
                        <Route path="/logs" element={<LogsList />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;