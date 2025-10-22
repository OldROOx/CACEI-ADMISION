import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Organismo de Layout
import DashboardLayout from './components/organisms/DashboardLayout';

// Componentes para las rutas
import DashboardContent from './components/pages/DashboardContent';
import SidebarItem from './components/atoms/SidebarItem';
import RegistrarTutor from './components/pages/RegistrarTutor'; // Importar la nueva página
import Encuestas from './components/pages/Encuestas';
import EvidenciasCurso from './components/pages/EvidenciasCurso';
import RegistrosActividades from './components/pages/RegistrosActividades';
import Reportes from './components/pages/Reportes';
import ControlAsistencia from './components/pages/ControlAsistencia';
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
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardContent />} />
                    <Route path="promociones" element={<RegistrarActividadPromocion PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                    <Route path="prep-visitante-promociones" element={<RegistrarActividadPrepInvitada PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                    <Route path="promocion-digital" element={<RegistrarActividadPromocionDigital PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />

                    {/* --- RUTA ACTUALIZADA --- */}
                    <Route path="registrar-tutor" element={<RegistrarTutor PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />

                    <Route path="registrar-preparatoria" element={<RegistrarPreparatoria PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                    <Route path="registrar-actividad" element={<RegistrarActividadPromocion PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                    <Route path="registros" element={<RegistrosActividades />} />
                    <Route path="reportes" element={<Reportes />} />
                    <Route path="induccion" element={<PlaceholderPage title="Inducción General" />} />
                    <Route path="induccion/evidencias" element={<EvidenciasCurso />} />
                    <Route path="induccion/encuestas" element={<Encuestas />} />
                    <Route path="induccion/nivelacion" element={<ClasesNivelacion />} />
                    <Route path="induccion/asistencia" element={<ControlAsistencia />} />
                    <Route path="*" element={<div>404 | Página No Encontrada</div>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;