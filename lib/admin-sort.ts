// Orden de las tablas del panel: se elige con ?sort=<columna>&dir=asc|desc
// (los titulos de columna son links, ver components/admin/sortable-th.tsx).

export type SortDir = "asc" | "desc";

export function parseSort<T extends string>(
  sp: { sort?: string; dir?: string },
  allowed: readonly T[]
): { sort: T | undefined; dir: SortDir } {
  const sort = allowed.find((column) => column === sp.sort);
  return { sort, dir: sp.dir === "desc" ? "desc" : "asc" };
}

// Direccion del proximo clic en una columna: si ya estaba ordenada por esa
// columna se invierte; si no, arranca en `firstDir`.
export function nextDir(
  current: { sort: string | undefined; dir: SortDir },
  column: string,
  firstDir: SortDir = "asc"
): SortDir {
  if (current.sort !== column) return firstDir;
  return current.dir === "asc" ? "desc" : "asc";
}

type Comparable = string | number | boolean | Date | null | undefined;

// Ordena en memoria (para listas chicas que se cargan completas). Los
// vacios quedan siempre al final y el texto se compara en espanol, sin
// distinguir mayusculas ni acentos, con numeros en orden natural.
export function sortRows<T>(
  rows: T[],
  getters: Record<string, (row: T) => Comparable>,
  sort: string | undefined,
  dir: SortDir
): T[] {
  const get = sort ? getters[sort] : undefined;
  if (!get) return rows;
  const factor = dir === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const va = get(a);
    const vb = get(b);
    const emptyA = va === null || va === undefined || va === "";
    const emptyB = vb === null || vb === undefined || vb === "";
    if (emptyA && emptyB) return 0;
    if (emptyA) return 1;
    if (emptyB) return -1;
    if (typeof va === "string" && typeof vb === "string") {
      return factor * va.localeCompare(vb, "es", { sensitivity: "base", numeric: true });
    }
    const na = va instanceof Date ? va.getTime() : Number(va);
    const nb = vb instanceof Date ? vb.getTime() : Number(vb);
    return factor * (na - nb);
  });
}
