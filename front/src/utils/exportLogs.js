import * as XLSX from 'xlsx'

const autoFitColumns = (data, worksheet) => {
    const cols = Object.keys(data[0])

    const columnWidths = cols.map(col => {
        const maxLength = data.reduce((max, row) => {
            const value = row[col] ? row[col].toString() : ""
            return Math.max(max, value.length)
        }, col.length) // incluye el nombre de la columna

        return { wch: maxLength + 2 } // +2 para un poco de espacio
    })

    worksheet['!cols'] = columnWidths
}

/**
 * Formatea los datos completos de logs para exportación (CSV y JSON)
 */
const formatLogsComplete = (logs) => {
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
 * Formatea los datos simplificados para Excel (solo campos básicos)
 */
const formatLogsForExcel = (logs) => {
    return logs.map(log => ({
        'Nombre': log.name,
        'Precio': `$${parseFloat(log.price).toFixed(2)}`,
        'Stock': log.stock,
        'Fecha Creación': new Date(log.createdAt).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }))
}

/**
 * Exporta los logs a formato Excel (solo campos básicos)
 */
export const exportToExcel = (logs) => {
    const formattedData = formatLogsForExcel(logs)
    const worksheet = XLSX.utils.json_to_sheet(formattedData)

    // Auto-ajustar columnas
    autoFitColumns(formattedData, worksheet)

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs de Productos')

    const filename = `export_productos_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(workbook, filename)
}

/**
 * Exporta los logs a formato CSV (todos los campos)
 */
export const exportToCSV = (logs) => {
    const formattedData = formatLogsComplete(logs)
    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    
    // Crear blob y descargar (BOM para que Excel abra correctamente con acentos)
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `export_productos_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

/**
 * Exporta los logs a formato JSON (todos los campos)
 */
export const exportToJSON = (logs) => {
    const formattedData = formatLogsComplete(logs)
    
    // Convertir a JSON con formato legible
    const jsonString = JSON.stringify(formattedData, null, 2)
    
    // Crear blob y descargar
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `export_productos_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}