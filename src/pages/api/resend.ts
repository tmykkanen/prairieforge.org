export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const users = import.meta.env.RESEND_USERS;

export const POST: APIRoute = async ({ request }) => {
	const event = await request.json();

	if (event.type === "email.received") {
		const { data: email } = await resend.emails.receiving.get(
			event.data.email_id,
		);

		if (!users.includes(email?.from)) {
			return new Response(null, {
				status: 403,
				statusText: "Not an authorized user!",
			});
		}

		const { data: broadcastID } = await resend.broadcasts.create({
			segmentId: import.meta.env.RESEND_SEGMENT_KEY,
			from: import.meta.env.RESEND_FROM,
			subject: event.data.subject,
			html: `${email?.html} <p>Want to stop receiving these emails? <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Click here to unsubscribe from this list.</a></p> `,
			replyTo: email?.from,
			name: `${event.data.subject} (${email?.from})`,
		});

		if (!broadcastID) return new Response(null, { status: 400 });

		await resend.broadcasts.send(broadcastID.id);

		return new Response(null, { status: 200 });
	}
	return new Response(event, { status: 400 });
};
