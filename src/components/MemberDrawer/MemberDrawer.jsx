// src/components/MemberDrawer/MemberDrawer.jsx
// Full profile panel opened by clicking a MemberCard. Every action here is
// real: Follow toggles shared app state, Edit opens the same form used to
// add members (pre-filled), Delete asks for confirmation before removing
// the person, and clicking a skill filters the whole directory by it.

import { useEffect } from 'react';
import { getInitials, getAvatarPaletteIndex } from '../../utils/avatar.js';
import './MemberDrawer.css';

function MemberDrawer({ member, isFollowing, onClose, onToggleFollow, onEdit, onDeleteRequest, onSkillClick }) {
  useEffect(() => {
    if (!member) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [member, onClose]);

  if (!member) return null;

  const { name, role, age, isAdmin, skills, address } = member;
  const paletteIndex = getAvatarPaletteIndex(name);
  const emailHandle = name.toLowerCase().replace(/[^a-z]+/g, '.');
  const mockEmail = `${emailHandle}@company.com`;
  const joinedLabel = new Date(member.addedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="member-drawer__overlay" onMouseDown={onClose}>
      <aside
        className="member-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-name"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="member-drawer__close" onClick={onClose} aria-label="Close profile">
          ×
        </button>

        <div className="member-drawer__hero">
          <div
            className="member-drawer__avatar"
            style={{
              backgroundColor: `var(--avatar-${paletteIndex}-bg)`,
              color: `var(--avatar-${paletteIndex}-fg)`,
            }}
          >
            {getInitials(name)}
          </div>
          <h2 id="drawer-name" className="member-drawer__name">{name}</h2>
          <p className="member-drawer__role">{role}</p>
          {isAdmin && <span className="member-drawer__admin-badge">Admin</span>}
        </div>

        <div className="member-drawer__quick-actions">
          <button
            type="button"
            className={`member-drawer__follow-btn ${isFollowing ? 'member-drawer__follow-btn--active' : ''}`}
            onClick={() => onToggleFollow(member.id, name)}
          >
            {isFollowing ? '✓ Following' : '+ Follow'}
          </button>
          <button
            type="button"
            className="member-drawer__icon-btn"
            onClick={() => navigator.clipboard?.writeText(mockEmail)}
            title="Copy email"
          >
            ✉
          </button>
          <button
            type="button"
            className="member-drawer__icon-btn"
            onClick={() => onEdit(member)}
            title="Edit profile"
          >
            ✎
          </button>
          <button
            type="button"
            className="member-drawer__icon-btn member-drawer__icon-btn--danger"
            onClick={() => onDeleteRequest(member)}
            title="Remove from directory"
          >
            🗑
          </button>
        </div>

        <dl className="member-drawer__details">
          <div className="member-drawer__detail-row">
            <dt>Email</dt>
            <dd>{mockEmail}</dd>
          </div>
          <div className="member-drawer__detail-row">
            <dt>Location</dt>
            <dd>{address.city}, {address.country}</dd>
          </div>
          <div className="member-drawer__detail-row">
            <dt>Age</dt>
            <dd>{age}</dd>
          </div>
          <div className="member-drawer__detail-row">
            <dt>Member since</dt>
            <dd>{joinedLabel}</dd>
          </div>
        </dl>

        <div className="member-drawer__section">
          <h3 className="member-drawer__section-title">Skills</h3>
          <ul className="member-drawer__skills">
            {skills.map((skill) => (
              <li key={skill}>
                <button
                  type="button"
                  className="member-drawer__skill"
                  onClick={() => onSkillClick(skill)}
                  title={`Filter directory by "${skill}"`}
                >
                  {skill}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default MemberDrawer;
