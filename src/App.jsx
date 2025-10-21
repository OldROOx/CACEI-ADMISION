import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Organismo de Layout
import DashboardLayout from './components/organisms/DashboardLayout';

// Componentes para las rutas
import DashboardContent from './components/pages/DashboardContent';
import SidebarItem from './components/atoms/SidebarItem';

// --- NUEVOS IMPORTS ---
import ControlAsistencia from './components/pages/ControlAsistencia'; // Importar la nueva página
import ClasesNivelacion from './components/pages/ClasesNivelacion';
import RegistrarPreparatoria from './components/pages/RegistrarPreparatoria';
import RegistrarActividadPromocion from './components/pages/RegistrarActividadPromocion';
import RegistrarActividadPromocionDigital from './components/pages/RegistrarActividadPromocionDigital';
import RegistrarActividadPrepInvitada from './components/pages/RegistrarActividadPrepInvitada';
import PrimaryButton from './components/atoms/PrimaryButton';
import SecondaryButton from './components/atoms/SecondaryButton';

// PLACHOLDERS PARA EL RESTO DE LAS RUTAS
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

                    {/* Rutas de Promociones */}
                    <Route path="promociones" element={<RegistrarActividadPromocion PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                    <Route path="prep-visitante-promociones" element={<RegistrarActividadPrepInvitada PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                    <Route path="promocion-digital" element={<RegistrarActividadPromocionDigital PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                    <Route path="registrar-tutor" element={<PlaceholderPage title="Registrar tutor" />} />
                    <Route path="registrar-preparatoria" element={<RegistrarPreparatoria PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                    <Route path="registrar-actividad" element={<RegistrarActividadPromocion PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                    <Route path="registros" element={<PlaceholderPage title="Ver Registros" />} />

                    {/* Rutas de Inducción anidadas */}
                    <Route path="induccion" element={<PlaceholderPage title="Inducción General" />} />
                    <Route path="induccion/encuestas" element={<PlaceholderPage title="Encuestas" />} />
                    <Route path="induccion/nivelacion" element={<ClasesNivelacion />} />

                    {/* --- RUTA ACTUALIZADA --- */}
                    <Route path="induccion/asistencia" element={<ControlAsistencia />} />

                    {/* Manejo de rutas no encontradas */}
                    <Route path="*" element={<div>404 | Página No Encontrada</div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;