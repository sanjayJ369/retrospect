export function isSoundEnabled() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("soundEnabled") !== "false";
}

export function toggleSoundSetting() {
  const current = isSoundEnabled();
  localStorage.setItem("soundEnabled", String(!current));
}
