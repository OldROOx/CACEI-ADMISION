import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
// Eliminada: import { useAuth } from './context/AuthContext';

// Layout y Páginas
import DashboardLayout from './components/organisms/DashboardLayout';
import SidebarItem from './components/atoms/SidebarItem';
// Eliminada: import Login from './components/pages/Login';
import DashboardContent from './components/pages/DashboardContent';
import RegistrarTutor from './components/pages/RegistrarTutor';
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

// Eliminado: Componente para proteger rutas (ProtectedRoute)
/*
const ProtectedRoute = () => {
    const { userRole } = useAuth();
    return userRole ? <Outlet /> : <Navigate to="/login" replace />;
};
*/

function App() {
    return (
        <Routes>
            {/* La ruta base (/) lleva directamente al DashboardLayout sin protección */}
            <Route path="/" element={<DashboardLayout SidebarItemComponent={SidebarItem} />}>
                {/* La ruta de inicio (index) va al Dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />

                {/* Todas las páginas ahora son accesibles directamente */}
                <Route path="dashboard" element={<DashboardContent />} />
                <Route path="promociones" element={<RegistrarActividadPromocion PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                <Route path="prep-visitante-promociones" element={<RegistrarActividadPrepInvitada PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                <Route path="promocion-digital" element={<RegistrarActividadPromocionDigital PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                <Route path="registrar-tutor" element={<RegistrarTutor PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                <Route path="registrar-preparatoria" element={<RegistrarPreparatoria PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                <Route path="registrar-actividad" element={<RegistrarActividadPromocion PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />} />
                <Route path="registros" element={<RegistrosActividades />} />
                <Route path="reportes" element={<Reportes />} />
                <Route path="induccion/evidencias" element={<EvidenciasCurso />} />
                <Route path="induccion/encuestas" element={<Encuestas />} />
                <Route path="induccion/nivelacion" element={<ClasesNivelacion />} />
                <Route path="induccion/asistencia" element={<ControlAsistencia />} />

                {/* Redirección para cualquier otra ruta no encontrada */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Eliminada la ruta /login */}
            {/* Eliminada la ruta /ProtectedRoute */}
        </Routes>
    );
}

export default App;