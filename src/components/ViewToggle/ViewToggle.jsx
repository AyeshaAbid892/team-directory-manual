// src/components/ViewToggle/ViewToggle.jsx
import './ViewToggle.css';

function ViewToggle({ value, onChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="Change layout">
      <button
        type="button"
        className={`view-toggle__btn ${value === 'grid' ? 'view-toggle__btn--active' : ''}`}
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
        title="Grid view"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
      <button
        type="button"
        className={`view-toggle__btn ${value === 'list' ? 'view-toggle__btn--active' : ''}`}
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        title="List view"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="2" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="1" y="6" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="1" y="10" width="12" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

export default ViewToggle;
