document.addEventListener("DOMContentLoaded", () => {
     const form = document.getElementById("leadForm");
     const button = form.querySelector("button");
     const errorDiv = document.getElementById("error");

     form.addEventListener("submit", async (e) => {
          e.preventDefault();
          errorDiv.textContent = "";
          button.disabled = true;
          button.textContent = "Enviando...";

          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());

          try {
               const res = await fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
               });

               const result = await res.json();

               if (!res.ok) {
                    errorDiv.textContent = result.error || "Erro ao enviar formulário";
                    button.disabled = false;
                    button.textContent = "Quero saber mais";
                    return;
               }

               if (result.redirectTo) {
                    window.location.href = result.redirectTo;
               } else {
                    errorDiv.textContent = "Resposta inválida do servidor";
                    button.disabled = false;
                    button.textContent = "Quero saber mais";
               }
          } catch (err) {
               console.error("Erro no envio:", err);
               errorDiv.textContent = "Erro de conexão. Tente novamente.";
               button.disabled = false;
               button.textContent = "Quero saber mais";
          }
     });
});
