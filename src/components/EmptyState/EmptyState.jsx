// src/components/EmptyState/EmptyState.jsx
import './EmptyState.css';

function EmptyState({ query, onClear }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">⌕</div>
      <h3 className="empty-state__title">No members found</h3>
      <p className="empty-state__text">
        {query
          ? `Nothing matches "${query}". Try a different name, role, or skill.`
          : 'No one matches this filter yet.'}
      </p>
      {query && (
        <button type="button" className="empty-state__clear-btn" onClick={onClear}>
          Clear search
        </button>
      )}
    </div>
  );
}

export default EmptyState;
