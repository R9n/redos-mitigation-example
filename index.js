const express = require("express");
const {
  safeValidateForm,
  unsafeValidateForm,
} = require("./services/auth.services");

const HttpStatus = require("./utils/http-status-codes");

const http = require("http");
const InternalSystemCodes = require("./utils/internal-system-codes");

const appPort = 3000;

const app = express();

app.use(express.json());

app.post("/validate-form-unsafe", (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .send({ message: "campo email precisa ser informado" });
    }

    if (!password) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .send({ message: "campo password precisa ser informado" });
    }

    const isFormValid = unsafeValidateForm(email, password);

    if (isFormValid) {
      return response.status(HttpStatus.OK).send({
        isValidForm: true,
        message: "Email e senha são válidos",
      });
    }

    return response.status(HttpStatus.BAD_REQUEST).send({
      isValidForm: false,
      message: "Email ou senha são inválidos",
    });
  } catch (error) {
    console.log(error);
    if (error.internalCode === InternalSystemCodes.TIMEOUT) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Operation timed out" });
    }
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal server error" });
  }
});

app.post("/validate-form-safe", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .send({ message: "campo email precisa ser informado" });
    }

    if (!password) {
      return response
        .status(HttpStatus.FORBIDDEN)
        .send({ message: "campo password precisa ser informado" });
    }

    const isFormValid = await safeValidateForm(email, password);

    if (isFormValid) {
      return response.status(HttpStatus.OK).send({
        isValidForm: true,
        message: "Email e senha são válidos",
      });
    }

    return response.status(HttpStatus.BAD_REQUEST).send({
      isValidForm: false,
      message: "Email ou senha são inválidos",
    });
  } catch (error) {
    if (error.internalCode === InternalSystemCodes.TIMEOUT) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: "Operation timed out" });
    }
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal server error" });
  }
});

app.get("/test-server", (request, response) => {
  return response
    .status(HttpStatus.OK)
    .send({ message: "Servidor está respondendo normalmente" });
});

const server = http.createServer(app);

server.listen(appPort, "0.0.0.0", () => {
  console.log(`Server running at port ${appPort}`);
});
