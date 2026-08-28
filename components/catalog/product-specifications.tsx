type Spec = {
  groupName: string | null;
  label: string;
  value: string;
};

export function ProductSpecifications({ specifications }: { specifications: Spec[] }) {
  if (specifications.length === 0) return null;

  const groups = new Map<string, Spec[]>();
  for (const spec of specifications) {
    const key = spec.groupName ?? "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(spec);
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-primary">
        Especificaciones técnicas
      </h2>
      <div className="mt-4 space-y-6">
        {[...groups.entries()].map(([groupName, specs]) => (
          <div key={groupName}>
            {groups.size > 1 && (
              <h3 className="mb-2 text-sm font-medium text-secondary">
                {groupName}
              </h3>
            )}
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, index) => (
                    <tr
                      key={spec.label}
                      className={index % 2 === 0 ? "bg-white" : "bg-muted"}
                    >
                      <th
                        scope="row"
                        className="w-1/3 px-4 py-2 text-left font-medium text-secondary"
                      >
                        {spec.label}
                      </th>
                      <td className="px-4 py-2 text-primary">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
