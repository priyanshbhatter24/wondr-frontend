/**
 * This file now re-exports from GenerationsContext to maintain backward compatibility.
 * All pages import from "@/lib/use-generations", so we keep this file but delegate to the context.
 */
export { useGenerations } from "@/contexts/GenerationsContext";
