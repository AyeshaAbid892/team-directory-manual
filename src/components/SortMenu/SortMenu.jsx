// src/components/SortMenu/SortMenu.jsx
import { useEffect, useRef, useState } from 'react';
import './SortMenu.css';

const OPTIONS = [
  { id: 'recent', label: 'Recently added' },
  { id: 'name', label: 'Name (A–Z)' },
  { id: 'role', label: 'Role (A–Z)' },
];

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const current = OPTIONS.find((opt) => opt.id === value) ?? OPTIONS[0];

  return (
    <div className="sort-menu" ref={ref}>
      <button
        type="button"
        className="sort-menu__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="sort-menu__trigger-label">Sort: {current.label}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="sort-menu__list" role="listbox">
          {OPTIONS.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={value === option.id}
                className={`sort-menu__option ${value === option.id ? 'sort-menu__option--active' : ''}`}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SortMenu;
