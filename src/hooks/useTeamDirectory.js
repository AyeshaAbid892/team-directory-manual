// src/hooks/useTeamDirectory.js
// All directory data logic lives here: the member list, search, filters,
// sorting, follow state, and full CRUD (add / update / remove). Presentation
// -only UI state (which drawer is open, grid vs list) stays in App.jsx.

import { useMemo, useState, useCallback } from 'react';
import seedTeam from '../data/team.js';

function makeId() {
  return `m-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function toMemberRecord(formValues, existing = {}) {
  return {
    id: existing.id ?? makeId(),
    name: formValues.name.trim(),
    role: formValues.role.trim(),
    age: Number(formValues.age),
    isAdmin: formValues.isAdmin,
    skills: formValues.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    address: {
      city: formValues.city.trim(),
      country: formValues.country.trim(),
    },
    addedAt: existing.addedAt ?? Date.now(),
  };
}

export function useTeamDirectory() {
  const [members, setMembers] = useState(() =>
    seedTeam.map((m, index) => ({ ...m, addedAt: Date.now() - (seedTeam.length - index) * 1000 }))
  );
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'admins' | 'following'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name' | 'role'
  const [following, setFollowing] = useState(() => new Set());

  const addMember = useCallback((formValues) => {
    const newMember = toMemberRecord(formValues);
    setMembers((prev) => [newMember, ...prev]);
    return newMember;
  }, []);

  const updateMember = useCallback((id, formValues) => {
    let updated = null;
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        updated = toMemberRecord(formValues, m);
        return updated;
      })
    );
    return updated;
  }, []);

  const removeMember = useCallback((id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setFollowing((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleFollow = useCallback((id) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const visibleMembers = useMemo(() => {
    let list = members;

    if (activeFilter === 'admins') {
      list = list.filter((m) => m.isAdmin);
    } else if (activeFilter === 'following') {
      list = list.filter((m) => following.has(m.id));
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => {
        return (
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.address.city.toLowerCase().includes(q) ||
          m.address.country.toLowerCase().includes(q) ||
          m.skills.some((skill) => skill.toLowerCase().includes(q))
        );
      });
    }

    const sorted = [...list];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'role') {
      sorted.sort((a, b) => a.role.localeCompare(b.role));
    } else {
      sorted.sort((a, b) => b.addedAt - a.addedAt);
    }

    return sorted;
  }, [members, activeFilter, query, following, sortBy]);

  const stats = useMemo(() => {
    const admins = members.filter((m) => m.isAdmin).length;
    const countryList = [...new Set(members.map((m) => m.address.country))];
    const skillList = [...new Set(members.flatMap((m) => m.skills))];
    return {
      total: members.length,
      admins,
      countries: countryList.length,
      countryList,
      skills: skillList.length,
      skillList,
    };
  }, [members]);

  return {
    members: visibleMembers,
    totalCount: members.length,
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
  };
}
