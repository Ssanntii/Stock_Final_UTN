import * as XLSX from 'xlsx'

/**
 * Formatea los datos de logs para exportación
 */
const formatLogsForExport = (logs) => {
    return logs.map(log => ({
        'ID': log.id,
        'Nombre': log.name,
        'Precio': `$${parseFloat(log.price).toFixed(2)}`,
        'Stock': log.stock,
        'Fecha Creación': new Date(log.createdAt).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        'Creado Por': log.createdBy?.name || 'N/A',
        'Email Creador': log.createdBy?.email || 'N/A',
        'Fecha Modificación': log.updatedAt !== log.createdAt 
            ? new Date(log.updatedAt).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : '-',
        'Modificado Por': log.modifiedBy?.name || '-',
        'Email Modificador': log.modifiedBy?.email || '-'
    }))
}

/**
 * Exporta los logs a formato Excel
 */
export const exportToExcel = (logs) => {
    const formattedData = formatLogsForExport(logs)
    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    
    // Ajustar ancho de columnas
    const columnWidths = [
        { wch: 5 },   // ID
        { wch: 25 },  // Nombre
        { wch: 12 },  // Precio
        { wch: 8 },   // Stock
        { wch: 20 },  // Fecha Creación
        { wch: 25 },  // Creado Por
        { wch: 30 },  // Email Creador
        { wch: 20 },  // Fecha Modificación
        { wch: 25 },  // Modificado Por
        { wch: 30 }   // Email Modificador
    ]
    worksheet['!cols'] = columnWidths
    
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs de Productos')
    
    const filename = `export_productos_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, filename)
}

/**
 * Exporta los logs a formato CSV
 */
export const exportToCSV = (logs) => {
    const formattedData = formatLogsForExport(logs)
    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    
    // Crear blob y descargar (BOM para que Excel abra correctamente con acentos)
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `logs_productos_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}