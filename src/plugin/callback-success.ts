import { createAuthEndpoint } from "better-auth/plugins";
import { html } from "./html";

export const callbackSuccess = (successText: string, scheme: string) =>
  createAuthEndpoint(
    "/callback/success",
    {
      method: "GET",
    },
    async (ctx) => {
      if (!ctx.request) return;

      const redirectTo = new URL(ctx.request.url).searchParams.get(
        "redirectTo",
      );

      const hideUI = new URL(ctx.request.url).searchParams.get("hideUI");

      if (!redirectTo)
        return new Response("Missing redirectTo argument", {
          headers: {
            "Content-Type": "text/html",
          },
        });

      if (!redirectTo.toString().startsWith(scheme + "://"))
        return new Response("Invalid redirect.", {
          headers: {
            "Content-Type": "text/html",
          },
        });

      if (hideUI) return Response.redirect(redirectTo, 302);

      return new Response(
        html(successText) +
          `<meta http-equiv="refresh" content="0; url='${redirectTo.replaceAll('"', "&quot;").replaceAll("'", "&#39;")}'"/>`,
        {
          headers: {
            "Content-Type": "text/html",
          },
        },
      );
    },
  );
