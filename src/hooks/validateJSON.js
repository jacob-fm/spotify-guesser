// utility: safe JSON parse
export function safeParse(str) {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null; // invalid JSON
  }
}

// utility: validate game shape
export function isValidGameArray(val) {
  return (
    Array.isArray(val) &&
    val.every(
      (round) =>
        round &&
        typeof round === "object" &&
        "guessed" in round &&
        "target" in round,
    )
  );
}
