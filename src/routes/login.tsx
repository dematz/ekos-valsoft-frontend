import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión · Inventario Inteligente" },
      { name: "description", content: "Accede a tu panel con Google SSO." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Blurred decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-[28rem] w-[28rem] rounded-full bg-chart-5/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-chart-2/20 blur-3xl" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/95 p-10 shadow-[0_8px_40px_-12px_rgb(15_23_42_/_0.12)] backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" strokeWidth={2.4} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Inventario Inteligente</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Accede con tu cuenta corporativa para continuar
            </p>
          </div>

          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="group flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Al continuar aceptas los Términos y la Política de Privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.17v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.17A11 11 0 0 0 1 12c0 1.78.43 3.46 1.17 4.95l3.67-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.17 7.05l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
