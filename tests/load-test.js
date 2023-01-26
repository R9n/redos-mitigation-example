import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 250 }, // Simula um aumento de 0 até 100 requisições, em um período de 2 minutos
    { duration: "2m", target: 300 }, // Permaneçe em 300 requisições por 2 min
    { duration: "1m", target: 0 }, // Desce para 0 requisições ao longo de 1 minuto
  ],
};

const BASE_URL = "http://192.168.2.176:3000"; // Aqui eu coloquei o ip do computador que estava rodando a api, utilizei um outro computador para rodar o teste para garantir que não haveriam interferências

export default () => {
  const headers = { "Content-Type": "application/json" };

  // Primeiro envio um payload malicioso, simulando um ataque
  const maliciusPatternResult = http.post(
    `${BASE_URL}/validate-form-safe`,
    JSON.stringify({
      email: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com",
      password: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    }),
    { headers: headers }
  );

  // Verifico para ver se recebi um timeout como resposta
  check(maliciusPatternResult, {
    "Bad-request-blocked-successfully": (response) => {
      return (
        JSON.parse(response.body).message === "Operation timed out"
      );
    },
  });

  // Depois envio um payload válido para verificar se a api está funcionando como deveria e não foi prejudicada pelo payload malicioso enviado anteriorment

  const validPatternResult = http.post(
    `${BASE_URL}/validate-form-safe`,
    JSON.stringify({
      email: "email-valido@gmail.com",
      password: "ab.cd.Zz",
    }),
    { headers: headers }
  );

  // Aqui verifico a resposta para checar se a resposta foi correta
  check(validPatternResult, {
    "Valid-Pattern-Accepted-successfully": (response) =>
      JSON.parse(response.body).isValidForm === true,
  });

  // Por fim faço uma requisição para o endpoint de checagem da api, para ver e ele ainda está respondendo
  const serverCheckResponse = http.get(`${BASE_URL}/test-server`).json();

  // e verifico se ele de fato está ativo
  check(serverCheckResponse, {
    "servidor responsivo": (obj) =>
      obj.message === "Servidor está respondendo normalmente",
  });

  sleep(1); // apenas um pequeno timer entre uma iteração do teste e outra
};
