import React from 'react';

// Importar todos los componentes necesarios para construir esta vista
import MetricDisplay from '../atoms/MetricDisplay';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import ActivityLogItem from '../atoms/ActivityLogItem';
import StatsOverview from '../molecules/StatsOverview';
import QuickActionCard from '../molecules/QuickActionCard';
import ActivityList from '../molecules/ActivityList';

// MOCKS DE DATOS
const ICONS = {
    DOCENTES: '👨‍🏫', PREP: '🏫', ACTIVIDAD: '🎉', ESTUDIANTES: '🧑‍🎓',
    USER: '👤', HOME: '🏡', DOC: '📄', GEAR: '⚙️', CLOCK: '⏱️'
};

const mockStats = [
    { value: "24", label: "Docentes Registrados", trend: "+2 desde el mes pasado", Icon: ICONS.DOCENTES },
    { value: "18", label: "Preparatorias Visitadas", trend: "+5 este mes", Icon: ICONS.PREP },
    { value: "42", label: "Actividades de Promoción", trend: "+12 esta semana", Icon: ICONS.ACTIVIDAD },
    { value: "156", label: "Estudiantes en Inducción", trend: "+23% vs mes anterior", Icon: ICONS.ESTUDIANTES },
];

const mockPromocionActions = [
    { label: "Registrar Nuevo Docente", type: 'primary', onClick: () => console.log('Docente'), Icon: ICONS.USER },
    { label: "Registrar Preparatoria", type: 'secondary', onClick: () => console.log('Prep'), Icon: ICONS.HOME },
    { label: "Nueva Actividad de Promoción", type: 'secondary', onClick: () => console.log('Act'), Icon: ICONS.ACTIVIDAD },
];

const mockInduccionActions = [
    { label: "Subir Evidencias", type: 'primary', onClick: () => console.log('Evidencias'), Icon: ICONS.DOC },
    { label: "Gestionar Nivelación", type: 'secondary', onClick: () => console.log('Nivelacion'), Icon: ICONS.GEAR },
    { label: "Control de Asistencia", type: 'secondary', onClick: () => console.log('Asistencia'), Icon: ICONS.CLOCK },
];

const mockActivity = [
    { activity: "Nuevo docente registrado", details: "Dr. Juan Pérez", time: "- Hace 4 horas", Icon: ICONS.USER },
    { activity: "Preparatoria visitada", details: "CBTIS No. 42 - Torreón", time: "- Hace 4 horas", Icon: ICONS.HOME },
    { activity: "Actividad de promoción registrada", details: "Presentación Ingeniería en Sistemas", time: "- Hace 6 horas", Icon: ICONS.DOC },
];


const DashboardContent = () => {
    return (
        <>
            <h2 className="text-lg font-medium text-gray-500 mb-6">
                Bienvenido al Sistema de Promoción e Inducción Educativa
            </h2>

            {/* 1. SECCIÓN DE MÉTRICAS */}
            <div className="mb-8">
                <StatsOverview
                    stats={mockStats}
                    MetricCardComponent={MetricDisplay}
                />
            </div>

            {/* 2. SECCIÓN DE ACCIONES RÁPIDAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                <QuickActionCard
                    title="Acciones Rápidas - Promoción"
                    subtitle="Gestiona las actividades de promoción en educación superior"
                    actions={mockPromocionActions}
                    ButtonPrimary={PrimaryButton}
                    ButtonSecondary={SecondaryButton}
                />

                <QuickActionCard
                    title="Acciones Rápidas - Inducción"
                    subtitle="Administra el proceso de inducción y nivelación"
                    actions={mockInduccionActions}
                    ButtonPrimary={PrimaryButton}
                    ButtonSecondary={SecondaryButton}
                />
            </div>

            {/* 3. SECCIÓN DE ACTIVIDAD RECIENTE */}
            <div className="p-6 bg-white rounded-xl shadow-md">
                <ActivityList
                    title="Actividad Reciente"
                    activities={mockActivity}
                    ActivityItemComponent={ActivityLogItem}
                />
            </div>
        </>
    );
};

export default DashboardContent;