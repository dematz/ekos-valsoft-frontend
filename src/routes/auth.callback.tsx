import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("auth_token", token);
      const saved = sessionStorage.getItem("auth_redirect");
      sessionStorage.removeItem("auth_redirect");
      let destination = "/dashboard";
      if (saved) {
        try {
          destination = new URL(saved).pathname;
        } catch {
          destination = saved;
        }
      }
      router.invalidate().then(() => navigate({ to: destination as any }));
    } else {
      navigate({ to: "/login" });
    }
  }, [navigate, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Autenticando…</p>
    </div>
  );
}
