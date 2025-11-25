// src/utils/exportUtils.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// ==========================================================
// HELPER: CALCULAR PERÍODO ESCOLAR
// ==========================================================
const obtenerPeriodoEscolar = () => {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1; // getMonth() devuelve 0-11
    const año = hoy.getFullYear();

    if (mes >= 9 && mes <= 12) {
        return `Septiembre - Diciembre ${año}`;
    } else if (mes >= 1 && mes <= 4) {
        return `Enero - Abril ${año}`;
    } else {
        // Mayo - Agosto (período vacacional/extraordinario)
        return `Mayo - Agosto ${año}`;
    }
};

// ==========================================================
// HELPER: AGREGAR HEADER CON LOGO Y DATOS
// ==========================================================
const agregarHeaderConLogo = (doc, titulo) => {
    const periodoEscolar = obtenerPeriodoEscolar();

    // Logo (asume que tienes el logo en public o como base64)
    // Opción 1: Si tienes el logo como archivo en public
    // doc.addImage('/logo-escuela.png', 'PNG', 14, 10, 30, 30);

    // Opción 2: Logo como base64 (recomendado para portabilidad)
    // Puedes convertir tu logo a base64 en https://www.base64-image.de/
    // y pegarlo aquí:
    const logoBase64 = 'public/logo1.png';

    try {
        doc.addImage(logoBase64, 'PNG', 14, 10, 25, 25);
    } catch (error) {
        console.warn('No se pudo cargar el logo:', error);
    }

    // Información de la institución y carrera
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 45, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Ingeniería en Software', 45, 27);
    doc.text(`Período Escolar: ${periodoEscolar}`, 45, 33);

    // Fecha del reporte (derecha)
    doc.setFontSize(9);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-MX')}`,
        doc.internal.pageSize.width - 14, 20, { align: 'right' });

    return 40; // Retorna la posición Y donde termina el header
};

// ==========================================================
// EXPORTAR A PDF
// ==========================================================

export const exportarActividadesPDF = (actividades) => {
    try {
        const doc = new jsPDF();

        // Header con logo
        const startY = agregarHeaderConLogo(doc, 'Reporte de Actividades de Promoción');

        // Preparar datos para la tabla
        const tableData = actividades.map((act, index) => [
            index + 1,
            new Date(act.Fecha).toLocaleDateString('es-MX'),
            act.Tipo || 'N/A',
            act.DocenteNombre || 'N/A',
            act.PreparatoriaNombre || 'Digital/N/A',
            act.EstudiantesAlcanzados || 0,
            act.EvidenciasURL ? 'Sí' : 'No'
        ]);

        // Crear tabla
        autoTable(doc, {
            startY: startY,
            head: [['#', 'Fecha', 'Tipo', 'Docente', 'Preparatoria', 'Estudiantes', 'Evidencias']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 2 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Página ${i} de ${pageCount} - Universidad Politécnica de Chiapas`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Guardar PDF
        doc.save(`Reporte_Actividades_${new Date().toISOString().split('T')[0]}.pdf`);
        console.log('PDF de actividades generado exitosamente');
    } catch (error) {
        console.error('Error al generar PDF de actividades:', error);
        alert('Error al generar el PDF. Revise la consola para más detalles.');
    }
};

export const exportarEstudiantesPDF = (estudiantes) => {
    try {
        const doc = new jsPDF();

        const startY = agregarHeaderConLogo(doc, 'Reporte de Estudiantes');

        doc.setFontSize(10);
        doc.text(`Total de estudiantes: ${estudiantes.length}`, 14, startY - 5);

        const tableData = estudiantes.map((est, index) => [
            index + 1,
            est.Matricula || 'N/A',
            `${est.Nombre} ${est.Apellidos}`,
            est.Correo || 'N/A',
            est.PreparatoriaNombre || 'N/A',
            est.Municipio || 'N/A',
            est.CarreraInteres || 'N/A',
            est.EsAceptado ? 'Aceptado' : 'Prospecto'
        ]);

        autoTable(doc, {
            startY: startY + 2,
            head: [['#', 'Matrícula', 'Nombre', 'Correo', 'Preparatoria', 'Municipio', 'Carrera', 'Estado']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 7, cellPadding: 1.5 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Página ${i} de ${pageCount} - Universidad Politécnica de Chiapas`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save(`Reporte_Estudiantes_${new Date().toISOString().split('T')[0]}.pdf`);
        console.log('PDF de estudiantes generado exitosamente');
    } catch (error) {
        console.error('Error al generar PDF de estudiantes:', error);
        alert('Error al generar el PDF. Revise la consola para más detalles.');
    }
};

export const exportarAsistenciaPDF = (clases, asistencias) => {
    try {
        const doc = new jsPDF();

        const startY = agregarHeaderConLogo(doc, 'Reporte de Asistencias');

        const tableData = clases.map((clase, index) => {
            const asistenciasClase = asistencias.filter(a => a.ClaseID === clase.ClaseID);
            const presentes = asistenciasClase.filter(a => a.Presente).length;
            const total = asistenciasClase.length;
            const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;

            return [
                index + 1,
                clase.Materia || 'N/A',
                new Date(clase.Fecha).toLocaleDateString('es-MX'),
                clase.DocenteNombre || 'N/A',
                `${presentes}/${total}`,
                `${porcentaje}%`
            ];
        });

        autoTable(doc, {
            startY: startY,
            head: [['#', 'Materia', 'Fecha', 'Docente', 'Asistencia', 'Porcentaje']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 2 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Página ${i} de ${pageCount} - Universidad Politécnica de Chiapas`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save(`Reporte_Asistencias_${new Date().toISOString().split('T')[0]}.pdf`);
        console.log('PDF de asistencias generado exitosamente');
    } catch (error) {
        console.error('Error al generar PDF de asistencias:', error);
        alert('Error al generar el PDF. Revise la consola para más detalles.');
    }
};

export const exportarClasesPDF = (clases) => {
    try {
        const doc = new jsPDF();

        const startY = agregarHeaderConLogo(doc, 'Reporte de Clases de Nivelación');

        doc.setFontSize(10);
        doc.text(`Total de clases: ${clases.length}`, 14, startY - 5);

        const tableData = clases.map((clase, index) => [
            index + 1,
            clase.Materia || 'N/A',
            new Date(clase.Fecha).toLocaleDateString('es-MX'),
            clase.Horario || 'N/A',
            clase.DocenteNombre || 'N/A',
            clase.Tema || 'N/A',
            clase.Salon || 'N/A'
        ]);

        autoTable(doc, {
            startY: startY + 2,
            head: [['#', 'Materia', 'Fecha', 'Horario', 'Docente', 'Tema', 'Salón']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 2 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Página ${i} de ${pageCount} - Universidad Politécnica de Chiapas`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save(`Reporte_Clases_${new Date().toISOString().split('T')[0]}.pdf`);
        console.log('PDF de clases generado exitosamente');
    } catch (error) {
        console.error('Error al generar PDF de clases:', error);
        alert('Error al generar el PDF. Revise la consola para más detalles.');
    }
};

export const exportarReporteGeneralPDF = (statsData, activityChartData) => {
    try {
        const doc = new jsPDF();

        const startY = agregarHeaderConLogo(doc, 'Reporte General del Sistema');

        // Estadísticas generales
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Estadísticas Generales', 14, startY + 5);

        let yPosition = startY + 15;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        statsData.forEach(stat => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${stat.label}:`, 20, yPosition);
            doc.setFont('helvetica', 'normal');
            doc.text(`${stat.value}`, 120, yPosition);
            yPosition += 8;
        });

        // Distribución de actividades
        if (activityChartData && activityChartData.length > 0) {
            yPosition += 10;
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Distribución de Actividades por Tipo', 14, yPosition);

            yPosition += 10;
            const total = activityChartData.reduce((sum, i) => sum + i.value, 0);
            const tableData = activityChartData.map(item => [
                item.name || 'N/A',
                item.value || 0,
                total > 0 ? `${((item.value / total) * 100).toFixed(1)}%` : '0%'
            ]);

            autoTable(doc, {
                startY: yPosition,
                head: [['Tipo de Actividad', 'Cantidad', 'Porcentaje']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
                styles: { fontSize: 10 },
            });
        }

        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Página ${i} de ${pageCount} - Universidad Politécnica de Chiapas`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save(`Reporte_General_${new Date().toISOString().split('T')[0]}.pdf`);
        console.log('PDF general generado exitosamente');
    } catch (error) {
        console.error('Error al generar PDF general:', error);
        alert('Error al generar el PDF. Revise la consola para más detalles.');
    }
};

// ==========================================================
// EXPORTAR A EXCEL (sin cambios en esta sección)
// ==========================================================

export const exportarActividadesExcel = (actividades) => {
    try {
        const datos = actividades.map((act, index) => ({
            '#': index + 1,
            'Fecha': new Date(act.Fecha).toLocaleDateString('es-MX'),
            'Tipo': act.Tipo || 'N/A',
            'Docente': act.DocenteNombre || 'N/A',
            'Preparatoria': act.PreparatoriaNombre || 'Digital/N/A',
            'Estudiantes Alcanzados': act.EstudiantesAlcanzados || 0,
            'Carreras Promovidas': act.CarrerasPromovidas || '',
            'Observaciones': act.Observaciones || '',
            'Tiene Evidencias': act.EvidenciasURL ? 'Sí' : 'No'
        }));

        const worksheet = XLSX.utils.json_to_sheet(datos);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Actividades');

        const maxWidth = 50;
        const columnWidths = Object.keys(datos[0] || {}).map(key => ({
            wch: Math.min(
                maxWidth,
                Math.max(
                    key.length,
                    ...datos.map(row => String(row[key] || '').length)
                ) + 2
            )
        }));
        worksheet['!cols'] = columnWidths;

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Reporte_Actividades_${new Date().toISOString().split('T')[0]}.xlsx`);
        console.log('Excel de actividades generado exitosamente');
    } catch (error) {
        console.error('Error al generar Excel de actividades:', error);
        alert('Error al generar el Excel. Revise la consola para más detalles.');
    }
};

export const exportarEstudiantesExcel = (estudiantes) => {
    try {
        const datos = estudiantes.map((est, index) => ({
            '#': index + 1,
            'Matrícula': est.Matricula || 'N/A',
            'Nombre': est.Nombre || '',
            'Apellidos': est.Apellidos || '',
            'Correo': est.Correo || '',
            'Teléfono': est.Telefono || '',
            'Preparatoria': est.PreparatoriaNombre || 'N/A',
            'Municipio': est.Municipio || 'N/A',
            'Carrera de Interés': est.CarreraInteres || 'N/A',
            'Estado': est.EsAceptado ? 'Aceptado' : 'Prospecto',
            'Notas': est.Notas || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(datos);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');

        const maxWidth = 50;
        const columnWidths = Object.keys(datos[0] || {}).map(key => ({
            wch: Math.min(
                maxWidth,
                Math.max(
                    key.length,
                    ...datos.map(row => String(row[key] || '').length)
                ) + 2
            )
        }));
        worksheet['!cols'] = columnWidths;

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Reporte_Estudiantes_${new Date().toISOString().split('T')[0]}.xlsx`);
        console.log('Excel de estudiantes generado exitosamente');
    } catch (error) {
        console.error('Error al generar Excel de estudiantes:', error);
        alert('Error al generar el Excel. Revise la consola para más detalles.');
    }
};

export const exportarAsistenciaExcel = (clases, asistencias) => {
    try {
        const datos = clases.map((clase, index) => {
            const asistenciasClase = asistencias.filter(a => a.ClaseID === clase.ClaseID);
            const presentes = asistenciasClase.filter(a => a.Presente).length;
            const total = asistenciasClase.length;
            const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;

            return {
                '#': index + 1,
                'Materia': clase.Materia || 'N/A',
                'Fecha': new Date(clase.Fecha).toLocaleDateString('es-MX'),
                'Horario': clase.Horario || 'N/A',
                'Docente': clase.DocenteNombre || 'N/A',
                'Tema': clase.Tema || 'N/A',
                'Salón': clase.Salon || 'N/A',
                'Presentes': presentes,
                'Ausentes': total - presentes,
                'Total': total,
                'Porcentaje': `${porcentaje}%`,
                'Observaciones': clase.Observaciones || ''
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(datos);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Asistencias');

        const maxWidth = 50;
        const columnWidths = Object.keys(datos[0] || {}).map(key => ({
            wch: Math.min(
                maxWidth,
                Math.max(
                    key.length,
                    ...datos.map(row => String(row[key] || '').length)
                ) + 2
            )
        }));
        worksheet['!cols'] = columnWidths;

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Reporte_Asistencias_${new Date().toISOString().split('T')[0]}.pdf`);
        console.log('Excel de asistencias generado exitosamente');
    } catch (error) {
        console.error('Error al generar Excel de asistencias:', error);
        alert('Error al generar el Excel. Revise la consola para más detalles.');
    }
};

export const exportarClasesExcel = (clases) => {
    try {
        const datos = clases.map((clase, index) => ({
            '#': index + 1,
            'Materia': clase.Materia || 'N/A',
            'Fecha': new Date(clase.Fecha).toLocaleDateString('es-MX'),
            'Horario': clase.Horario || 'N/A',
            'Docente': clase.DocenteNombre || 'N/A',
            'Tema': clase.Tema || 'N/A',
            'Salón': clase.Salon || 'N/A',
            'Observaciones': clase.Observaciones || ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(datos);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Clases');

        const maxWidth = 50;
        const columnWidths = Object.keys(datos[0] || {}).map(key => ({
            wch: Math.min(
                maxWidth,
                Math.max(
                    key.length,
                    ...datos.map(row => String(row[key] || '').length)
                ) + 2
            )
        }));
        worksheet['!cols'] = columnWidths;

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Reporte_Clases_${new Date().toISOString().split('T')[0]}.xlsx`);
        console.log('Excel de clases generado exitosamente');
    } catch (error) {
        console.error('Error al generar Excel de clases:', error);
        alert('Error al generar el Excel. Revise la consola para más detalles.');
    }
};