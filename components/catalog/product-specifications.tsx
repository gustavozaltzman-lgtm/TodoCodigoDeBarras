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
              <h3 className="eyebrow mb-2">{groupName}</h3>
            )}
            {/* En pantallas angostas la tabla scrollea sola en horizontal en vez de empujar la pagina */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((spec, index) => (
                    <tr
                      key={spec.label}
                      className={index % 2 === 0 ? "bg-white" : "bg-muted"}
                    >
                      <th
                        scope="row"
                        className="w-2/5 min-w-[8rem] px-3 py-2.5 text-left align-top font-medium text-secondary sm:w-1/3 sm:px-4"
                      >
                        {spec.label}
                      </th>
                      <td className="font-mono-data break-words px-3 py-2.5 align-top text-primary sm:px-4">
                        {spec.value}
                      </td>
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
