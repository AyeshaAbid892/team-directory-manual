// src/components/MemberCard/MemberCard.jsx
// The entire card is clickable and opens the full profile drawer — the
// Follow button and skill chips stop propagation so they act independently
// (Follow toggles state in place, a skill chip filters the whole directory).

import { getInitials, getAvatarPaletteIndex } from '../../utils/avatar.js';
import './MemberCard.css';

function MemberCard({ member, isFollowing, onToggleFollow, onOpen, onSkillClick, layout = 'grid' }) {
  const { name, role, age, isAdmin, skills, address } = member;
  const paletteIndex = getAvatarPaletteIndex(name);

  const stop = (handler) => (event) => {
    event.stopPropagation();
    handler();
  };

  return (
    <article
      className={`member-card member-card--${layout}`}
      onClick={() => onOpen(member)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(member);
        }
      }}
    >
      <div className="member-card__header">
        <div
          className="member-card__avatar"
          style={{
            backgroundColor: `var(--avatar-${paletteIndex}-bg)`,
            color: `var(--avatar-${paletteIndex}-fg)`,
          }}
          aria-hidden="true"
        >
          {getInitials(name)}
        </div>

        <div className="member-card__identity">
          <h3 className="member-card__name">{name}</h3>
          <p className="member-card__role">{role}</p>
        </div>

        {isAdmin && <span className="member-card__admin-badge">Admin</span>}
      </div>

      <div className="member-card__meta">
        <span className="member-card__meta-item">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1.5c-2.5 0-4.5 2-4.5 4.5C3.5 9.5 8 14.5 8 14.5S12.5 9.5 12.5 6c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="8" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          {address.city}, {address.country}
        </span>
        <span className="member-card__meta-item">Age {age}</span>
      </div>

      <ul className="member-card__skills">
        {skills.map((skill) => (
          <li key={skill}>
            <button
              type="button"
              className="member-card__skill"
              onClick={stop(() => onSkillClick(skill))}
              title={`Filter by "${skill}"`}
            >
              {skill}
            </button>
          </li>
        ))}
      </ul>

      <div className="member-card__footer">
        <button
          type="button"
          className={`member-card__follow-btn ${isFollowing ? 'member-card__follow-btn--active' : ''}`}
          onClick={stop(() => onToggleFollow(member.id, name))}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <span className="member-card__view-hint">View profile →</span>
      </div>
    </article>
  );
}

export default MemberCard;
