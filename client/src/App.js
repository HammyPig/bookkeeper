import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Dashboard from "./Dashboard";
import NavigationBar from "./components/NavigationBar";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import ItemsPage from "./pages/ItemsPage";
import "./App.css";

export default function App() {
    return (
        <div className="bg-background min-h-screen">
            <NavigationBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/invoices/create" element={<CreateInvoicePage />} />
                <Route path="/items" element={<ItemsPage />} />
            </Routes>
        </div>
    );
}
