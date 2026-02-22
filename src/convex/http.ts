import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Webhook } from "svix";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET environment variable not set");
    }

    // Get Svix headers for verification
    const svix_id = request.headers.get("svix-id");
    const svix_timestamp = request.headers.get("svix-timestamp");
    const svix_signature = request.headers.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    // Verify the webhook signature
    const wh = new Webhook(webhookSecret);
    let evt: any;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Webhook verification failed", { status: 400 });
    }

    const { type, data } = evt;

    // Sync user to Convex on create or update
    if (type === "user.created" || type === "user.updated") {
      const firstName = data.first_name ?? "";
      const lastName = data.last_name ?? "";
      const fullName =
        `${firstName} ${lastName}`.trim() || data.username || "User";

      await ctx.runMutation(api.users.upsertUser, {
        clerkId: data.id,
        name: fullName,
        email: data.email_addresses[0]?.email_address ?? "",
        imageUrl: data.image_url,
      });
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;