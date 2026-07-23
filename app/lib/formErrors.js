// DRF validation errors come back as {field: ["msg", ...], ...}; auth/permission/throttle
// errors come back as {detail: "msg"}. This normalizes both shapes into a per-field message
// map (for inline errors under each input) plus a general fallback message.
export function parseApiErrors(data) {
  const fieldErrors = {};
  let general = null;

  if (!data || typeof data !== "object") {
    return { fieldErrors, general: "Something went wrong. Please try again." };
  }

  for (const [key, value] of Object.entries(data)) {
    const message = Array.isArray(value) ? value.join(" ") : String(value);
    if (key === "detail" || key === "non_field_errors") {
      general = general ? `${general} ${message}` : message;
    } else {
      fieldErrors[key] = message;
    }
  }

  if (!general && Object.keys(fieldErrors).length === 0) {
    general = "Something went wrong. Please try again.";
  }

  return { fieldErrors, general };
}

// Client-side mirror of the backend's registration rules (RegisterSerializer +
// AUTH_PASSWORD_VALIDATORS in settings.py) — catches obvious problems before a round trip,
// with the server still authoritative for anything not checked here (e.g. common-password
// list, real uniqueness).
const USERNAME_RE = /^[\w.@+-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignupForm(formData) {
  const errors = {};

  if (!formData.first_name?.trim()) errors.first_name = "First name is required.";
  if (!formData.last_name?.trim()) errors.last_name = "Last name is required.";

  if (!formData.username?.trim()) {
    errors.username = "Username is required.";
  } else if (!USERNAME_RE.test(formData.username)) {
    errors.username =
      "Username may only contain letters, numbers, and @/./+/-/_ characters.";
  }

  if (!formData.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  const password = formData.password || "";
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  } else if (/^\d+$/.test(password)) {
    errors.password = "Password can't be entirely numeric.";
  } else {
    const lowerPw = password.toLowerCase();
    const identifiers = [
      formData.username,
      formData.first_name,
      formData.last_name,
      formData.email?.split("@")[0],
    ]
      .filter(Boolean)
      .map((v) => v.toLowerCase());
    if (identifiers.some((v) => v.length > 2 && lowerPw.includes(v))) {
      errors.password = "Password is too similar to your personal information.";
    }
  }

  return errors;
}
