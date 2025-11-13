// src/components/pages/DashboardContent.jsx

import React, { useState, useEffect } from 'react';

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


const ICONS = {
    DOCENTES: '👨‍🏫', PREP: '🏫', ACTIVIDAD: '🎉', ESTUDIANTES: '🧑‍🎓',
    USER: '👤', HOME: '🏡', DOC: '📄', GEAR: '⚙️', CLOCK: '⏱️'
};

const API_BASE_URL = '/api'; // Usamos el proxy configurado en vite.config.js

/**
 * Función utilitaria para obtener el conteo de un endpoint de catálogo.
 * Asume que el endpoint devuelve una lista o un objeto con un campo 'count' o 'total'.
 */
const fetchCount = async (path, label, Icon) => {
    try {
        // La URL completa se resuelve gracias al proxy de Vite
        const response = await fetch(`${API_BASE_URL}${path}`);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Asume que la respuesta es un array (y toma su longitud) o un objeto con una propiedad 'count' o 'total'.
        const value = Array.isArray(data) ? data.length : (data.count || data.total || 0);

        return {
            label: label,
            value: value,
            // Valores fijos para la tendencia y el icono, para simplificar
            trend: 'up',
            Icon: Icon,
        };
    } catch (error) {
        console.error(`Error al obtener ${label}:`, error);
        return {
            label: label,
            value: 'N/A',
            trend: 'down',
            Icon: Icon,
        };
    }
};

/**
 * Función para obtener la actividad reciente.
 * Asume que el endpoint /actividades devuelve una lista.
 */
const fetchActivity = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/actividades`);
        if (!response.ok) {
            throw new Error(`Error en la petición de actividades: ${response.statusText}`);
        }
        const data = await response.json();

        // Mapea la data al formato que espera ActivityLogItem (se asume una estructura simple para el demo)
        // Se limita a 5 para mostrar solo la actividad reciente.
        return data.slice(0, 5).map(item => ({
            id: item.id || Date.now() + Math.random(),
            icon: ICONS.ACTIVIDAD,
            title: `Actividad registrada: ${item.nombre || 'Sin nombre'}`,
            description: `Tipo: ${item.tipo || 'General'} - Fecha: ${new Date(item.fecha || Date.now()).toLocaleDateString()}`,
        }));
    } catch (error) {
        console.error('Error al obtener actividad reciente:', error);
        return [];
    }
};


const DashboardContent = () => {
    // --- ESTADO PARA CONTROLAR EL MODAL ---
    const [modalContent, setModalContent] = useState(null);

    // --- ESTADO PARA LA DATA DE LA API (Reemplaza a los mocks) ---
    const [stats, setStats] = useState([]);
    const [activity, setActivity] = useState([]);

    // --- EFECTO PARA CARGAR LA DATA DE LA API ---
    useEffect(() => {
        const loadData = async () => {
            const fetchedStats = await Promise.all([
                // Rutas de catálogo (asumidas desde index.ts: /api/docentes, /api/preparatorias, /api/estudiantes)
                fetchCount('/docentes', 'Docentes Activos', ICONS.DOCENTES),
                fetchCount('/preparatorias', 'Preparatorias Registradas', ICONS.PREP),
                fetchCount('/estudiantes', 'Estudiantes Preinscritos', ICONS.ESTUDIANTES),
            ]);

            setStats(fetchedStats);

            const fetchedActivity = await fetchActivity();
            setActivity(fetchedActivity);
        };

        loadData();
    }, []);

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
                {stats.length === 0 ? (
                    <p className="text-center text-gray-500">Cargando métricas principales...</p>
                ) : (
                    <StatsOverview
                        stats={stats}
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
                    activities={activity}
                    ActivityItemComponent={ActivityLogItem}
                />
                {activity.length === 0 && stats.length > 0 && (
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