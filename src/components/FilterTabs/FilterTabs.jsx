// src/components/FilterTabs/FilterTabs.jsx
import './FilterTabs.css';

const TABS = [
  { id: 'all', label: 'All members' },
  { id: 'admins', label: 'Admins' },
  { id: 'following', label: 'Following' },
];

function FilterTabs({ active, onChange }) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter members">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`filter-tabs__tab ${active === tab.id ? 'filter-tabs__tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
