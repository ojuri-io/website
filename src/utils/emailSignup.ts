// Email capture — posts to a Google Form whose responses collect in a
// Google Sheet. Single source of truth for the form config, shared by the
// coming-soon page and the landing closing CTA.
//
// To point at a different form: create a Google Form with one short-answer
// field, use ⋮ → "Get pre-filled link" to read the FORM_ID and entry field
// id out of the resulting URL, and replace the two constants below.
const GOOGLE_FORM_ID = '1FAIpQLScELODEJk1-Ge9AH5kxwLHuVERBrkGPIMQM1yt9byGolE0blg';
const GOOGLE_FORM_EMAIL_FIELD = 'entry.655310729';

// Practical email check — catches the common bad inputs without the false
// negatives a strict RFC 5322 pattern would produce client-side.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Google Forms accepts cross-origin POSTs in no-cors mode. We can't read the
// response, but the submission still lands in the form's responses.
export async function submitEmailSignup(email: string): Promise<void> {
  const url = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
  const body = new FormData();
  body.append(GOOGLE_FORM_EMAIL_FIELD, email);
  await fetch(url, { method: 'POST', mode: 'no-cors', body });
}
