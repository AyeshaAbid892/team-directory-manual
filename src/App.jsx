// src/App.jsx
// Same useTeamDirectory hook, same handlers, same CRUD logic as before —
// only the layout changed: a fixed left Sidebar now holds branding, stats,
// filters, sort, and primary actions, while the main column holds the
// search field and the member grid/list.
import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import MemberGrid from './components/MemberGrid/MemberGrid.jsx';
import MemberDrawer from './components/MemberDrawer/MemberDrawer.jsx';
import AddMemberModal from './components/AddMemberModal/AddMemberModal.jsx';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog.jsx';
import Toast from './components/Toast/Toast.jsx';
import { useTeamDirectory } from './hooks/useTeamDirectory.js';
import { downloadMembersCsv } from './utils/exportCsv.js';
import './App.css';

function App() {
  const {
    members,
    totalCount,
    stats,
    query,
    setQuery,
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy,
    following,
    toggleFollow,
    addMember,
    updateMember,
    removeMember,
  } = useTeamDirectory();

  const [viewMode, setViewMode] = useState('grid');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [openProfileId, setOpenProfileId] = useState(null);
  const [pendingDeleteMember, setPendingDeleteMember] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const openProfileMember = members.find((m) => m.id === openProfileId) || null;

  const handleAddSubmit = (formValues) => {
    const newMember = addMember(formValues);
    setAddModalOpen(false);
    setToastMessage(`${newMember.name} was added to the ledger.`);
  };

  const handleEditSubmit = (formValues) => {
    const updated = updateMember(editingMember.id, formValues);
    setEditingMember(null);
    setToastMessage(`${updated.name}'s entry was updated.`);
  };

  const handleToggleFollow = (id, name) => {
    const wasFollowing = following.has(id);
    toggleFollow(id);
    setToastMessage(wasFollowing ? `Unfollowed ${name}.` : `Now following ${name}.`);
  };

  const handleSkillClick = (skill) => {
    setQuery(skill);
    setOpenProfileId(null);
  };

  const handleStatClick = (statId) => {
    if (statId === 'total') {
      setActiveFilter('all');
      setQuery('');
    } else if (statId === 'admins') {
      setActiveFilter('admins');
    } else if (statId === 'countries') {
      setToastMessage(`Team spans: ${stats.countryList.join(', ')}.`);
    } else if (statId === 'skills') {
      setToastMessage(`Top skills: ${stats.skillList.slice(0, 6).join(', ')}.`);
    }
  };

  const handleConfirmDelete = () => {
    removeMember(pendingDeleteMember.id);
    setToastMessage(`${pendingDeleteMember.name} was removed from the ledger.`);
    setPendingDeleteMember(null);
    setOpenProfileId(null);
  };

  const handleExport = () => {
    downloadMembersCsv(members, 'team-directory.csv');
    setToastMessage(`Exported ${members.length} member${members.length === 1 ? '' : 's'} to CSV.`);
  };

  return (
    <div className="app">
      <Sidebar
        stats={stats}
        onStatClick={handleStatClick}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onAddClick={() => setAddModalOpen(true)}
        onExportClick={handleExport}
      />

      <main className="app__main">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          resultCount={members.length}
          totalCount={totalCount}
        />

        <MemberGrid
          members={members}
          following={following}
          onToggleFollow={handleToggleFollow}
          onOpen={(member) => setOpenProfileId(member.id)}
          onSkillClick={handleSkillClick}
          query={query}
          onClearSearch={() => setQuery('')}
          layout={viewMode}
        />
      </main>

      <MemberDrawer
        member={openProfileMember}
        isFollowing={openProfileMember ? following.has(openProfileMember.id) : false}
        onClose={() => setOpenProfileId(null)}
        onToggleFollow={handleToggleFollow}
        onEdit={(member) => {
          setOpenProfileId(null);
          setEditingMember(member);
        }}
        onDeleteRequest={(member) => setPendingDeleteMember(member)}
        onSkillClick={handleSkillClick}
      />

      <AddMemberModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAddSubmit} />

      <AddMemberModal
        open={Boolean(editingMember)}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSubmit={handleEditSubmit}
      />

      <ConfirmDialog
        open={Boolean(pendingDeleteMember)}
        title="Remove team member?"
        description={
          pendingDeleteMember
            ? `${pendingDeleteMember.name} will be permanently removed from the ledger. This can't be undone.`
            : ''
        }
        confirmLabel="Remove"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteMember(null)}
      />

      <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
    </div>
  );
}

export default App;
