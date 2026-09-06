// Sends a notification email via Resend when someone joins the waitlist.
// Uses the RESEND_API_KEY environment variable (never hard-coded).
//
// NOTE: Until a custom sending domain is verified with Resend, emails can
// only be delivered to the Resend account's own owner email, not to
// arbitrary visitors. That's fine for this use case: we're notifying the
// site owner (you) that someone signed up, not emailing the visitor back.

const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Change this to the email address on your Resend account if different.
const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'e.viksninai@gmail.com';

module.exports = async (req, res) => {
if (req.method !== 'POST') {
res.setHeader('Allow', 'POST');
return res.status(405).json({ error: 'Method not allowed' });
}

try {
const { name, email, city } = req.body || {};

if (!name || !email) {
return res.status(400).json({ error: 'Missing name or email' });
}

await resend.emails.send({
from: 'AIptieka <onboarding@resend.dev>',
to: NOTIFY_TO,
subject: 'New AIptieka waitlist signup',
html: `<h2>New waitlist signup</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Nearest city:</strong> ${city || 'n/a'}</p>`,
});

res.status(200).json({ ok: true });
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
};
