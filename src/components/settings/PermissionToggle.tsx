interface PermissionToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function PermissionToggle({ enabled, onChange }: PermissionToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-primary" : "bg-toggle"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
