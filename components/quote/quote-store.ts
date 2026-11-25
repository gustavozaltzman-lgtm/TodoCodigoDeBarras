"use client";

import { useSyncExternalStore } from "react";

export type QuoteItem = { slug: string; name: string; quantity: number };

export const QUOTE_MAX_ITEMS = 20;
export const QUOTE_MAX_QUANTITY = 99999;

const KEY = "tcb-quote-list";
const EVENT = "tcb-quote-change";

// Lista de cotizacion: vive en el navegador del visitante (localStorage), con
// todo en try/catch para que el sitio funcione igual si el almacenamiento
// esta bloqueado. El estado del panel (abierto/cerrado) es aparte.
let items: QuoteItem[] = [];
let loaded = false;
let drawerOpen = false;

function read(): QuoteItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed
          .filter(
            (i) =>
              i &&
              typeof i.slug === "string" &&
              typeof i.name === "string" &&
              Number.isInteger(i.quantity) &&
              i.quantity > 0
          )
          .slice(0, QUOTE_MAX_ITEMS)
      : [];
  } catch {
    return [];
  }
}

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

function save(next: QuoteItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // sin almacenamiento: queda en memoria
  }
  emit();
}

function itemsSnapshot() {
  if (!loaded) {
    items = read();
    loaded = true;
  }
  return items;
}

function subscribe(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      items = read();
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

const EMPTY: QuoteItem[] = [];

export function useQuoteItems(): QuoteItem[] {
  return useSyncExternalStore(subscribe, itemsSnapshot, () => EMPTY);
}

export function useQuoteOpen(): boolean {
  return useSyncExternalStore(subscribe, () => drawerOpen, () => false);
}

export function addToQuote(item: { slug: string; name: string }, quantity = 1) {
  const current = itemsSnapshot();
  if (current.some((i) => i.slug === item.slug)) return "exists" as const;
  if (current.length >= QUOTE_MAX_ITEMS) return "full" as const;
  save([...current, { ...item, quantity }]);
  return "added" as const;
}

export function setQuoteQuantity(slug: string, quantity: number) {
  const q = Math.min(Math.max(Math.floor(quantity) || 1, 1), QUOTE_MAX_QUANTITY);
  save(itemsSnapshot().map((i) => (i.slug === slug ? { ...i, quantity: q } : i)));
}

export function removeFromQuote(slug: string) {
  save(itemsSnapshot().filter((i) => i.slug !== slug));
}

export function clearQuote() {
  save([]);
}

export function openQuote() {
  drawerOpen = true;
  emit();
}

export function closeQuote() {
  drawerOpen = false;
  emit();
}
