import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/_app")({
  beforeLoad: ({ location }) => {
    if (!localStorage.getItem("auth_token")) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AppLayout,
});
