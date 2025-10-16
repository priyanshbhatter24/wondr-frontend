type ClassDictionary = Record<string, string | number | boolean | null | undefined>;
export type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassValue[];

function stringifyClass(value: ClassValue): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(stringifyClass).filter(Boolean).join(" ");
  }

  const entries = Object.entries(value as ClassDictionary).filter(([, condition]) => Boolean(condition));
  return entries.map(([className]) => className).join(" ");
}

export function cn(...inputs: ClassValue[]) {
  return inputs.map(stringifyClass).filter(Boolean).join(" ");
}
