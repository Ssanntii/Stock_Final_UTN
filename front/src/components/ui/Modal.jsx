import Button from './Button'

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Eliminar", cancelText = "Cancelar" }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className="text-slate-300 text-sm mt-1">{message}</div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button
            onClick={onConfirm}
            variant="danger"
            size="md"
            className="flex-1"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal