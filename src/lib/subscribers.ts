import { createServerFn } from "@tanstack/react-start";

export type Subscriber = {
  id: number;
  email: string;
  created_at: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribeEmail = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const email = typeof data === "string" ? data : (data as { email?: string })?.email;
    if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      throw new Error("Enter a valid email address.");
    }
    return { email: email.trim().toLowerCase() };
  })
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`
      insert into email_subscribers (email)
      values (${data.email})
      on conflict (email) do nothing
    `;
    return { ok: true as const };
  });

export const listSubscribers = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("@/lib/admin/auth.server");
  await requireAdmin();
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  return sql<Subscriber>`
    select id, email, created_at
    from email_subscribers
    order by created_at desc
  `;
});

export const deleteSubscriber = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const id = (data as { id?: number })?.id;
    if (typeof id !== "number") throw new Error("Missing subscriber id.");
    return { id };
  })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin/auth.server");
    await requireAdmin();
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`delete from email_subscribers where id = ${data.id}`;
    return { ok: true as const };
  });
