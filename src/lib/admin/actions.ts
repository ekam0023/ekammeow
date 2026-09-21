import { createServerFn } from "@tanstack/react-start";

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    const email = (data as { email?: string })?.email;
    const password = (data as { password?: string })?.password;
    if (typeof email !== "string" || !email) {
      throw new Error("Enter your admin email.");
    }
    if (typeof password !== "string" || !password) {
      throw new Error("Enter the admin password.");
    }
    return { email, password };
  })
  .handler(async ({ data }) => {
    const { adminSignIn, adminConfigured } = await import("@/lib/admin/auth.server");
    if (!adminConfigured()) {
      throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD are not set on the server yet.");
    }
    const ok = await adminSignIn(data.email, data.password);
    if (!ok) throw new Error("Wrong email or password.");
    return { ok: true as const };
  });

export const adminLogoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const { adminSignOut } = await import("@/lib/admin/auth.server");
  await adminSignOut();
  return { ok: true as const };
});

export const adminStatusFn = createServerFn({ method: "GET" }).handler(async () => {
  const { isAdmin, adminConfigured } = await import("@/lib/admin/auth.server");
  return { signedIn: await isAdmin(), configured: adminConfigured() };
});
