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


// MOCKS DE DATOS ELIMINADOS
const ICONS = {
    DOCENTES: '👨‍🏫', PREP: '🏫', ACTIVIDAD: '🎉', ESTUDIANTES: '🧑‍🎓',
    USER: '👤', HOME: '🏡', DOC: '📄', GEAR: '⚙️', CLOCK: '⏱️'
};
const mockStats = []; // Aquí se cargarán las métricas principales de la API
const mockActivity = []; // Aquí se carga la actividad reciente del log de la API


const DashboardContent = () => {
    // --- NUEVO ESTADO PARA CONTROLAR EL MODAL ---
    const [modalContent, setModalContent] = useState(null);

    // Función para cerrar el modal
    const handleCloseModal = () => setModalContent(null);

    // Las acciones rápidas son UI fija (NO son datos simulados, son la estructura de botones)
    const mockPromocionActions = [
        { label: "Registrar Nuevo Tutor", type: 'primary', onClick: () => console.log('Docente'), Icon: ICONS.USER },
        { label: "Registrar Preparatoria", type: 'secondary', onClick: () => console.log('Prep'), Icon: ICONS.HOME },
        {
            label: "Nueva Actividad de Promoción",
            type: 'secondary',
            onClick: () => setModalContent('promocion'), // Identificador para el modal
            Icon: ICONS.ACTIVIDAD
        },
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

    const mockInduccionActions = [
        { label: "Subir Evidencias", type: 'primary', onClick: () => console.log('Evidencias'), Icon: ICONS.DOC },
        { label: "Gestionar Nivelación", type: 'secondary', onClick: () => console.log('Nivelacion'), Icon: ICONS.GEAR },
        { label: "Control de Asistencia", type: 'secondary', onClick: () => console.log('Asistencia'), Icon: ICONS.CLOCK },
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

            {/* 1. SECCIÓN DE MÉTRICAS */}
            <div className="mb-8">
                {mockStats.length === 0 ? (
                    <p className="text-center text-gray-500">Cargando métricas principales...</p>
                ) : (
                    <StatsOverview
                        stats={mockStats}
                        MetricCardComponent={MetricDisplay}
                    />
                )}
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
                {mockActivity.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No hay actividad reciente.</p>
                )}
            </div>

            {/* --- RENDERIZADO DEL MODAL --- */}
            <Modal isOpen={!!modalContent} onClose={handleCloseModal}>
                {renderModalContent()}
            </Modal>
        </>
    );
};

export default DashboardContent;