// src/components/Sidebar/Sidebar.jsx
// This is the layout change: instead of one horizontal top bar holding
// everything, the brand, stats, filters, sort, and primary actions now live
// in a fixed left rail — the same underlying state and handlers from
// useTeamDirectory, just arranged differently. No behavior changes here.

import FilterTabs from '../FilterTabs/FilterTabs.jsx';
import SortMenu from '../SortMenu/SortMenu.jsx';
import ViewToggle from '../ViewToggle/ViewToggle.jsx';
import './Sidebar.css';

function Sidebar({
  stats,
  onStatClick,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
  onAddClick,
  onExportClick,
}) {
  const statItems = [
    { id: 'total', label: 'Members', value: stats.total },
    { id: 'admins', label: 'Admins', value: stats.admins },
    { id: 'countries', label: 'Countries', value: stats.countries },
    { id: 'skills', label: 'Unique skills', value: stats.skills },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__mark">R</span>
        <div>
          <h1 className="sidebar__title">Roster</h1>
          <p className="sidebar__subtitle">Team ledger</p>
        </div>
      </div>

      <button type="button" className="sidebar__add-btn" onClick={onAddClick}>
        <span aria-hidden="true">+</span> Add member
      </button>

      <div className="sidebar__section">
        <h2 className="sidebar__section-title">Overview</h2>
        <ul className="sidebar__stats">
          {statItems.map((item) => (
            <li key={item.id}>
              <button type="button" className="sidebar__stat" onClick={() => onStatClick(item.id)}>
                <span className="sidebar__stat-label">{item.label}</span>
                <span className="sidebar__stat-value">{item.value}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar__section">
        <h2 className="sidebar__section-title">Filter</h2>
        <FilterTabs active={activeFilter} onChange={onFilterChange} />
      </div>

      <div className="sidebar__section">
        <h2 className="sidebar__section-title">Sort &amp; layout</h2>
        <div className="sidebar__controls">
          <SortMenu value={sortBy} onChange={onSortChange} />
          <ViewToggle value={viewMode} onChange={onViewChange} />
        </div>
      </div>

      <button type="button" className="sidebar__export-btn" onClick={onExportClick}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 1v8M7 9L4 6M7 9l3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.5 11v1.5A1.5 1.5 0 0 0 3 14h8a1.5 1.5 0 0 0 1.5-1.5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        Export as CSV
      </button>
    </aside>
  );
}

export default Sidebar;
