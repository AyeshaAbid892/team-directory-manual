// src/utils/exportCsv.js
// Turns the currently visible member list into a downloadable CSV file —
// the kind of "export the roster" feature real HR/People-ops tools ship.

export function downloadMembersCsv(members, filename = 'team-directory.csv') {
  const headers = ['Name', 'Role', 'Age', 'Admin', 'City', 'Country', 'Skills'];
  const rows = members.map((m) => [
    m.name,
    m.role,
    m.age,
    m.isAdmin ? 'Yes' : 'No',
    m.address.city,
    m.address.country,
    m.skills.join('; '),
  ]);

  const escapeCell = (value) => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
