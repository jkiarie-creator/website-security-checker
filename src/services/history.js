const STORAGE_KEY = 'scan_history_v1';

export const loadHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveHistory = (entries) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {

  }
};

export const addScanToHistory = ({ url, timestamp, counts }) => {
  const existing = loadHistory();
  const entry = { id: `${timestamp}-${url}`, url, timestamp, counts };
  const next = [entry, ...existing].slice(0, 100);
  saveHistory(next);
  return next;
};


