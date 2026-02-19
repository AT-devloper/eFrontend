export default function RoleSelector({ roles, value, onChange }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        padding: "6px",
        borderRadius: "5px",
        marginBottom: "12px"
      }}
    >
      <option value="" disabled>
        Select Role
      </option>

      {roles.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
    </select>
  );
}