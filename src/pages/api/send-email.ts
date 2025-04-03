export const prerender = false;
import { Resend } from "resend";
import { type APIContext } from "astro";
import EmailTemplate from "../../components/emails/EmailTemplate.astro";
import { experimental_AstroContainer } from "astro/container";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const RESEND_EMAIL = import.meta.env.RESEND_EMAIL;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function POST({ request }: { request: APIContext["request"] }) {
  const { email } = await request.json();
  const container = await experimental_AstroContainer.create();

  if (!resend) {
    console.error("The env variable RESEND_API_KEY is not configured");
    return new Response(
      JSON.stringify({
        error: "The env variable RESEND_API_KEY is not configured",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const emailHTML = await container.renderToString(EmailTemplate);

    // Envía el email usando Resend
    const { data, error } = await resend.emails.send({
      from: RESEND_EMAIL, // Reemplaza con tu dirección de remitente verificada en Resend
      to: email,
      subject: "Estoy interesado en mejorar mi web", // Asunto del email de saludo
      html: emailHTML,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Email sent successfully", data }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
