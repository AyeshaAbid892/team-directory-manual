// src/components/ConfirmDialog/ConfirmDialog.jsx
import './ConfirmDialog.css';

function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirm-dialog__overlay" onMouseDown={onCancel}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h3 id="confirm-dialog-title" className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__description">{description}</p>
        <div className="confirm-dialog__actions">
          <button type="button" className="confirm-dialog__btn confirm-dialog__btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="confirm-dialog__btn confirm-dialog__btn--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
