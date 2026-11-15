/** Focusable controls inside a dialog / sheet, for Tab trapping. */
export function focusables(root: HTMLElement) {
  return [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

export function trapTab(e: KeyboardEvent, root: HTMLElement) {
  if (e.key !== "Tab") return;
  const list = focusables(root);
  if (list.length === 0) return;
  const first = list[0];
  const last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
