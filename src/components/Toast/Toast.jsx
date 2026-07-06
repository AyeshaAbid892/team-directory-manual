// src/components/Toast/Toast.jsx
import { useEffect } from 'react';
import './Toast.css';

function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onDismiss, 2600);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <button type="button" className="toast" role="status" onClick={onDismiss} title="Dismiss">
      <span className="toast__dot" aria-hidden="true" />
      {message}
    </button>
  );
}

export default Toast;
