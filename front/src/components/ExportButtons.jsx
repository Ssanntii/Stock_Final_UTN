import Button from './ui/Button'
import { exportToCSV, exportToExcel, exportToJSON } from '../utils/exportLogs'

const ExportButtons = ({ data, disabled = false }) => {
    const handleExportExcel = () => {
        if (data.length === 0) {
            alert('No hay datos para exportar')
            return
        }
        exportToExcel(data)
    }

    const handleExportCSV = () => {
        if (data.length === 0) {
            alert('No hay datos para exportar')
            return
        }
        exportToCSV(data)
    }

    const handleExportJSON = () => {
        if (data.length === 0) {
            alert('No hay datos para exportar')
            return
        }
        exportToJSON(data)
    }

    return (
        <div className="flex gap-3">
            <Button
                variant="success"
                size="md"
                onClick={handleExportExcel}
                disabled={disabled || data.length === 0}
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar Excel
            </Button>
            
            <Button
                variant="success"
                size="md"
                onClick={handleExportCSV}
                disabled={disabled || data.length === 0}
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
            </Button>

            <Button
                variant="success"
                size="md"
                onClick={handleExportJSON}
                disabled={disabled || data.length === 0}
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Exportar JSON
            </Button>
        </div>
    )
}

export default ExportButtons