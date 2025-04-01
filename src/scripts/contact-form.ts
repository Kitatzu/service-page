document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(
    "#contact-form",
  ) as HTMLFormElement;
  const emailInput = contactForm.querySelector(
    "input[type='email']",
  ) as HTMLInputElement;
  const submitButton = contactForm.querySelector("button") as HTMLButtonElement;
  const buttonText = submitButton.querySelector(
    ".button-text",
  ) as HTMLSpanElement;
  const loader = submitButton.querySelector(".loader") as HTMLSpanElement;

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Deshabilitamos input y botón
    emailInput.disabled = true;
    submitButton.setAttribute("disabled", "true");
    buttonText.textContent = "Enviando...";
    loader.classList.remove("hidden");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.value }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Error al enviar el email");

      alert("¡Gracias por contactarnos! Hemos recibido tu email.");
      contactForm.reset();
    } catch (error: any) {
      alert(error.message || "Ocurrió un problema, intenta nuevamente.");
      console.error("Error:", error);
    } finally {
      // Restauramos el estado inicial
      emailInput.disabled = false;
      submitButton.removeAttribute("disabled");
      buttonText.textContent = "Contáctame";
      loader.classList.add("hidden");
    }
  });
});
