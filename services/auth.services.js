const vm = require("vm");
const InternalErrorMessages = require("../utils/internal-system-error-code");
const validadePasswordRegex = /^(([a-z])+.)+[A-Z]([a-z])+$/;
const TimeoutError = require("../erros/timeout-error");

const validadeEmailRegex =
  /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/;

const maxRegexEvaluationTimeoutInMillissecons = 50;

function unsafeValidateForm(email, password) {
  const isEmailValid = validadeEmailRegex.exec(email) !== null;
  const isPasswordValid = validadePasswordRegex.exec(password) !== null;
  return isEmailValid && isPasswordValid;
}

function validateData(email, password) {
  // Essa funçã só está aqui para lhe lembrar que nós SEMPRE precisamos tratar os inputs do usuário antes de entregá-los para o sistema, capiche :) ?
}

async function safeValidateForm(email, password) {
  try {
    validateData(email, password);

    const vmVariables = {
      regexResult: false,
    };

    const context = vm.createContext(vmVariables);

    const regexScript = new vm.Script(
      `regexResult = new RegExp(${validadePasswordRegex}, "gm").exec("${password}") !== null &&
     RegExp(${validadeEmailRegex},"gm").exec("${email}") !== null`
    );

    regexScript.runInContext(context, {
      timeout: maxRegexEvaluationTimeoutInMillissecons,
    });
    return vmVariables.result !== null;
  } catch (error) {
    if (error.code == InternalErrorMessages.TIMEOUT) {
      throw new TimeoutError("ValidateForm");
    }
    throw error;
  }
}

module.exports = {
  unsafeValidateForm,
  safeValidateForm,
};
