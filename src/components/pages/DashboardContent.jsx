// src/components/pages/DashboardContent.jsx

import React, { useState } from 'react';

// Importar el nuevo Modal y los formularios
import Modal from '../organisms/Modal';
import RegistrarActividadPromocion from './RegistrarActividadPromocion';
import RegistrarActividadPrepInvitada from './RegistrarActividadPrepInvitada';
import RegistrarActividadPromocionDigital from './RegistrarActividadPromocionDigital';

// Importar el resto de componentes necesarios
import MetricDisplay from '../atoms/MetricDisplay';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import ActivityLogItem from '../atoms/ActivityLogItem';
import StatsOverview from '../molecules/StatsOverview';
import QuickActionCard from '../molecules/QuickActionCard';
import ActivityList from '../molecules/ActivityList';


// MOCKS DE DATOS (sin cambios)
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
    // --- NUEVO ESTADO PARA CONTROLAR EL MODAL ---
    const [modalContent, setModalContent] = useState(null);

    // Función para cerrar el modal
    const handleCloseModal = () => setModalContent(null);

    // --- ACCIONES DE PROMOCIÓN ACTUALIZADAS ---
    // Ahora los botones abrirán un modal con el formulario correspondiente.
    const mockPromocionActions = [
        { label: "Registrar Nuevo Tutor", type: 'primary', onClick: () => console.log('Docente'), Icon: ICONS.USER },
        { label: "Registrar Preparatoria", type: 'secondary', onClick: () => console.log('Prep'), Icon: ICONS.HOME },
        {
            label: "Nueva Actividad de Promoción",
            type: 'secondary',
            onClick: () => setModalContent('promocion'), // Identificador para el modal
            Icon: ICONS.ACTIVIDAD
        },
        // Puedes añadir más botones para los otros formularios
        {
            label: "Actividad Prep. Invitada",
            type: 'secondary',
            onClick: () => setModalContent('prepInvitada'),
            Icon: ICONS.PREP
        },
        {
            label: "Actividad Promoción Digital",
            type: 'secondary',
            onClick: () => setModalContent('promocionDigital'),
            Icon: '💻'
        },
    ];

    // Función para renderizar el formulario correcto dentro del modal
    const renderModalContent = () => {
        switch (modalContent) {
            case 'promocion':
                return <RegistrarActividadPromocion PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />;
            case 'prepInvitada':
                return <RegistrarActividadPrepInvitada PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />;
            case 'promocionDigital':
                return <RegistrarActividadPromocionDigital PrimaryButtonComponent={PrimaryButton} SecondaryButtonComponent={SecondaryButton} />;
            default:
                return null;
        }
    };


    return (
        <>
            <h2 className="text-lg font-medium text-gray-500 mb-6">
                Bienvenido al Sistema de Promoción e Inducción Educativa
            </h2>

            {/* 1. SECCIÓN DE MÉTRICAS (sin cambios) */}
            <div className="mb-8">
                <StatsOverview
                    stats={mockStats}
                    MetricCardComponent={MetricDisplay}
                />
            </div>

            {/* 2. SECCIÓN DE ACCIONES RÁPIDAS (sin cambios, ya usa las acciones actualizadas) */}
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

            {/* 3. SECCIÓN DE ACTIVIDAD RECIENTE (sin cambios) */}
            <div className="p-6 bg-white rounded-xl shadow-md">
                <ActivityList
                    title="Actividad Reciente"
                    activities={mockActivity}
                    ActivityItemComponent={ActivityLogItem}
                />
            </div>

            {/* --- RENDERIZADO DEL MODAL --- */}
            <Modal isOpen={!!modalContent} onClose={handleCloseModal}>
                {renderModalContent()}
            </Modal>
        </>
    );
};

export default DashboardContent;