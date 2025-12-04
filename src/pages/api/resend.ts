export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
	const event = await request.json();

	if (event.type === "email.received") {
		const { data: email } = await resend.emails.receiving.get(
			event.data.email_id,
		);

		console.log("EVENT:", event);
		console.log("FROM", email?.from);

		const { data: broadcastID } = await resend.broadcasts.create({
			segmentId: "d1c96805-55c7-48e4-a02a-806ebd131ca0",
			from: "Prairie Forge <updates@updates.prairieforge.org>",
			subject: event.data.subject,
			html: `${email?.html} <p>Want to stop receiving these emails? <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Click here to unsubscribe from this list.</a></p> `,
			replyTo: email?.from,
			name: `${event.data.subject} (${email?.from})`,
		});

		if (!broadcastID) return new Response(null, { status: 400 });

		await resend.broadcasts.send(broadcastID.id);

		console.log("broadcastID", broadcastID);
		console.log(email?.html);
		console.log(email?.text);
		console.log(email?.headers);

		return new Response(null, { status: 200 });
	}
	return new Response(event, { status: 400 });
};
