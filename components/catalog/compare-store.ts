"use client";

import { useSyncExternalStore } from "react";

export type CompareItem = { slug: string; name: string };

export const COMPARE_MAX = 3;
const KEY = "tcb-compare";
const EVENT = "tcb-compare-change";

// Lista de equipos a comparar, guardada en el navegador de cada visitante
// (localStorage). Todo se envuelve en try/catch: en navegacion privada o
// con el almacenamiento bloqueado la pagina sigue funcionando, solo que el
// comparador no recuerda la seleccion.
let cache: CompareItem[] = [];
let loaded = false;

function read(): CompareItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed
          .filter((i) => i && typeof i.slug === "string" && typeof i.name === "string")
          .slice(0, COMPARE_MAX)
      : [];
  } catch {
    return [];
  }
}

function write(items: CompareItem[]) {
  cache = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // sin almacenamiento: queda solo en memoria
  }
  window.dispatchEvent(new Event(EVENT));
}

function snapshot(): CompareItem[] {
  if (!loaded) {
    cache = read();
    loaded = true;
  }
  return cache;
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      callback();
    }
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: CompareItem[] = [];

export function useCompareList(): CompareItem[] {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY);
}

export function toggleCompare(item: CompareItem): "added" | "removed" | "full" {
  const current = snapshot();
  if (current.some((i) => i.slug === item.slug)) {
    write(current.filter((i) => i.slug !== item.slug));
    return "removed";
  }
  if (current.length >= COMPARE_MAX) return "full";
  write([...current, item]);
  return "added";
}

export function clearCompare() {
  write([]);
}
