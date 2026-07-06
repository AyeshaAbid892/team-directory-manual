// src/components/AddMemberModal/AddMemberModal.jsx
// Doubles as the "Add member" and "Edit member" form. When `member` is
// provided, the form pre-fills with that person's data and submitting
// calls onSubmit with the same shape used for creation — the parent
// decides whether that means addMember or updateMember.
import { useEffect, useState } from 'react';
import './AddMemberModal.css';

const EMPTY_FORM = {
  name: '',
  role: '',
  age: '',
  city: '',
  country: '',
  skills: '',
  isAdmin: false,
};

function memberToForm(member) {
  if (!member) return EMPTY_FORM;
  return {
    name: member.name,
    role: member.role,
    age: String(member.age),
    city: member.address.city,
    country: member.address.country,
    skills: member.skills.join(', '),
    isAdmin: member.isAdmin,
  };
}

function AddMemberModal({ open, onClose, onSubmit, member = null }) {
  const isEditMode = Boolean(member);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // Reset the form each time the modal opens fresh, pre-filling for edit mode.
  useEffect(() => {
    if (open) {
      setForm(memberToForm(member));
      setErrors({});
    }
  }, [open, member]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const updateField = (field) => (event) => {
    const value = field === 'isAdmin' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.role.trim()) nextErrors.role = 'Role is required';
    if (!form.age || Number.isNaN(Number(form.age)) || Number(form.age) <= 0) {
      nextErrors.age = 'Enter a valid age';
    }
    if (!form.city.trim()) nextErrors.city = 'City is required';
    if (!form.country.trim()) nextErrors.country = 'Country is required';
    if (!form.skills.trim()) nextErrors.skills = 'Add at least one skill';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit(form);
  };

  return (
    <div className="add-modal__overlay" onMouseDown={onClose}>
      <div
        className="add-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="add-modal__header">
          <h2 id="add-modal-title" className="add-modal__title">
            {isEditMode ? `Edit ${member.name}` : 'Add team member'}
          </h2>
          <button type="button" className="add-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="add-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="add-modal__row">
            <label className="add-modal__field">
              <span className="add-modal__label" htmlFor="field-name">Full name</span>
              <input
                id="field-name"
                type="text"
                value={form.name}
                onChange={updateField('name')}
                placeholder="e.g. Sofia Alvarez"
                className={errors.name ? 'add-modal__input add-modal__input--error' : 'add-modal__input'}
              />
              {errors.name && <span className="add-modal__error">{errors.name}</span>}
            </label>

            <label className="add-modal__field">
              <span className="add-modal__label" htmlFor="field-role">Role</span>
              <input
                id="field-role"
                type="text"
                value={form.role}
                onChange={updateField('role')}
                placeholder="e.g. Product Manager"
                className={errors.role ? 'add-modal__input add-modal__input--error' : 'add-modal__input'}
              />
              {errors.role && <span className="add-modal__error">{errors.role}</span>}
            </label>
          </div>

          <div className="add-modal__row">
            <label className="add-modal__field add-modal__field--small">
              <span className="add-modal__label" htmlFor="field-age">Age</span>
              <input
                id="field-age"
                type="number"
                min="18"
                max="99"
                value={form.age}
                onChange={updateField('age')}
                placeholder="30"
                className={errors.age ? 'add-modal__input add-modal__input--error' : 'add-modal__input'}
              />
              {errors.age && <span className="add-modal__error">{errors.age}</span>}
            </label>

            <label className="add-modal__field">
              <span className="add-modal__label" htmlFor="field-city">City</span>
              <input
                id="field-city"
                type="text"
                value={form.city}
                onChange={updateField('city')}
                placeholder="e.g. Toronto"
                className={errors.city ? 'add-modal__input add-modal__input--error' : 'add-modal__input'}
              />
              {errors.city && <span className="add-modal__error">{errors.city}</span>}
            </label>

            <label className="add-modal__field">
              <span className="add-modal__label" htmlFor="field-country">Country</span>
              <input
                id="field-country"
                type="text"
                value={form.country}
                onChange={updateField('country')}
                placeholder="e.g. Canada"
                className={errors.country ? 'add-modal__input add-modal__input--error' : 'add-modal__input'}
              />
              {errors.country && <span className="add-modal__error">{errors.country}</span>}
            </label>
          </div>

          <label className="add-modal__field">
            <span className="add-modal__label" htmlFor="field-skills">Skills (comma separated)</span>
            <input
              id="field-skills"
              type="text"
              value={form.skills}
              onChange={updateField('skills')}
              placeholder="e.g. React, GraphQL, Figma"
              className={errors.skills ? 'add-modal__input add-modal__input--error' : 'add-modal__input'}
            />
            {errors.skills && <span className="add-modal__error">{errors.skills}</span>}
          </label>

          <label className="add-modal__checkbox-row" htmlFor="field-admin">
            <input
              id="field-admin"
              type="checkbox"
              checked={form.isAdmin}
              onChange={updateField('isAdmin')}
            />
            Grant admin access
          </label>

          <div className="add-modal__footer">
            <button type="button" className="add-modal__btn add-modal__btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-modal__btn add-modal__btn--primary">
              {isEditMode ? 'Save changes' : 'Add member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberModal;
