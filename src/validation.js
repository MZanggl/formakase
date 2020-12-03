import { makeDraft } from "./form-fields";

const validityKeys = [
  "valueMissing",
  "typeMismatch",
  "tooShort",
  "tooLong",
  "stepMismatch",
  "rangeUnderflow",
  "rangeOverflow",
  "patternMismatch",
  "badInput"
];

export async function getValidationMessage(messages, el) {
  if (el.validity.valid) return "";

  for (const key of validityKeys) {
    if (!el.validity[key]) continue;
    if (messages && messages[key]) {
      return typeof messages[key] === "function"
        ? await messages[key](el)
        : messages[key];
    } else {
      return el.validationMessage;
    }
  }
}

export async function collectErrors(elements, customValidate, messages, bails) {
  const errors = {};

  for (const el of elements) {
    const message = await getValidationMessage(messages, el);
    if (message) {
      errors[el.name] = message;
      if (bails) return errors;
    }
  }

  if (customValidate) {
    const blame = (name, message) => message && (errors[name] = message);
    await customValidate(makeDraft(elements), blame);
  }

  return errors;
}
