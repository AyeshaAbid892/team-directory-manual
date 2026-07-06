// src/components/MemberGrid/MemberGrid.jsx
import MemberCard from '../MemberCard/MemberCard.jsx';
import EmptyState from '../EmptyState/EmptyState.jsx';
import './MemberGrid.css';

function MemberGrid({ members, following, onToggleFollow, onOpen, onSkillClick, query, onClearSearch, layout = 'grid' }) {
  if (members.length === 0) {
    return <EmptyState query={query} onClear={onClearSearch} />;
  }

  return (
    <div className={`member-grid member-grid--${layout}`}>
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          isFollowing={following.has(member.id)}
          onToggleFollow={onToggleFollow}
          onOpen={onOpen}
          onSkillClick={onSkillClick}
          layout={layout}
        />
      ))}
    </div>
  );
}

export default MemberGrid;
