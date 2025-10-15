import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Organismo de Layout
import DashboardLayout from './components/organisms/DashboardLayout';

// Componentes para las rutas
import DashboardContent from './components/pages/DashboardContent';
import SidebarItem from './components/atoms/SidebarItem';

// PLACHOLDERS PARA EL RESTO DE LAS RUTAS SEGÚN LA NUEVA ESTRUCTURA
const PlaceholderPage = ({ title }) => <div className="p-8 bg-white rounded-xl shadow-md"><h1>{title}</h1><p>Esta es la página de {title}.</p></div>;

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<DashboardLayout SidebarItemComponent={SidebarItem} />}
                >
                    {/* Redirige la ruta raíz (/) a /dashboard */}
                    <Route index element={<Navigate to="/dashboard" replace />} />

                    {/* Ruta del Dashboard (Contenido principal) */}
                    <Route path="dashboard" element={<DashboardContent />} />

                    {/* Rutas anidadas y específicas de la nueva Sidebar */}
                    <Route path="promociones" element={<PlaceholderPage title="Promociones - Lista" />} />
                    <Route path="prep-visitante-promociones" element={<PlaceholderPage title="Prep. Visitante Promociones" />} />
                    <Route path="promocion-digital" element={<PlaceholderPage title="Promocion Digital" />} />
                    <Route path="registrar-tutor" element={<PlaceholderPage title="Registrar tutor" />} />
                    <Route path="registrar-preparatoria" element={<PlaceholderPage title="Registrar Preparatoria" />} />
                    <Route path="registrar-actividad" element={<PlaceholderPage title="Registrar Actividad" />} />
                    <Route path="registros" element={<PlaceholderPage title="Ver Registros" />} />

                    {/* Rutas de Inducción anidadas */}
                    <Route path="induccion" element={<PlaceholderPage title="Inducción General" />} />
                    <Route path="induccion/encuestas" element={<PlaceholderPage title="Encuestas" />} />
                    <Route path="induccion/nivelacion" element={<PlaceholderPage title="Clases Nivelación" />} />
                    <Route path="induccion/asistencia" element={<PlaceholderPage title="Control Asistencia" />} />

                    {/* Manejo de rutas no encontradas */}
                    <Route path="*" element={<div>404 | Página No Encontrada</div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;