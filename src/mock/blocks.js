// Builders for fake-screen blocks, so data files stay short:
//   ai('Here is the answer [1]'), modal('Pay ₹1,500?', 'Details', ['Cancel', '!Pay'])
// Every builder takes an optional last argument `x` with extra fields
// (tone, pin, caret, slot…). Blocks are drawn by Mock.jsx, one `case` per type.
// Adding a new block type: add a builder here and a `case` in Mock.jsx.
export const user = (text, x) => ({ type: 'user', text, ...x });
export const ai = (text, x) => ({ type: 'ai', text, ...x });
export const note = (text, x) => ({ type: 'note', text, ...x });
export const text = (t, x) => ({ type: 'text', text: t, ...x });
export const chips = (items, x) => ({ type: 'chips', items, ...x });
export const buttons = (items, x) => ({ type: 'buttons', items, ...x });
export const input = (value, x) => ({ type: 'input', value, ...x });
export const ph = (placeholder, x) => ({ type: 'input', placeholder, ...x });
export const ghost = (value, g, x) => ({ type: 'ghost', value, ghost: g, ...x });
export const edit = (t, x) => ({ type: 'edit', text: t, ...x });
export const steps = (items, x) => ({ type: 'steps', items: items.map(([label, state]) => ({ label, state })), ...x });
export const spinner = (t, x) => ({ type: 'spinner', text: t, ...x });
export const banner = (tone, title, t, x) => ({ type: 'banner', tone, title, text: t, ...x });
export const toast = (t, action, x) => ({ type: 'toast', text: t, action, ...x });
export const variants = (items, x) => ({ type: 'variants', items, ...x });
export const rows = (items, x) => ({ type: 'rows', items, ...x });
export const card = (title, t, x) => ({ type: 'card', title, text: t, ...x });
export const list = (items, x) => ({ type: 'list', items, ...x });
export const check = (items, x) => ({ type: 'check', items, ...x });
export const diff = (items, x) => ({ type: 'diff', items, ...x });
export const modal = (title, t, btns, x) => ({ type: 'modal', title, text: t, buttons: btns, ...x });
export const slider = (label, value, left, right, x) => ({ type: 'slider', label, value, left, right, ...x });
export const toggle = (label, on, x) => ({ type: 'toggle', label, on, ...x });
export const avatar = (name, role, badge, x) => ({ type: 'avatar', name, role, badge, ...x });
export const voice = (state, label, t, x) => ({ type: 'voice', state, label, text: t, ...x });
export const blank = (t, x) => ({ type: 'blank', text: t, ...x });
