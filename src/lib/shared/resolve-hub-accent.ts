/**
 * Normalises an accent colour into a paintable value for a `--hub-*-accent` CSS slot,
 * accepting ANY colour. A bareword (a semantic name, a host-registered accent, or a CSS
 * named colour) resolves to its design-system token `var(--hub-sys-color-<name>, <name>)`
 * — the raw word is the fallback so an unregistered name still paints. A literal `#hex` /
 * `rgb()` / `oklch()` / `var(...)` is passed through unchanged. Returns `null` when the
 * value is unset or blank, so the SCSS default (or a builtin `@each`) can take over.
 *
 * @param value The raw accent value to normalise.
 * @returns The paintable CSS value, or `null` when unset/blank.
 */
export function resolveHubAccent(value: string | null | undefined): string | null {
	const color = value?.trim();
	if (!color) {
		return null;
	}
	return /^[a-zA-Z][\w-]*$/.test(color) ? `var(--hub-sys-color-${color}, ${color})` : color;
}
