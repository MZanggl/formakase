import { makeDraft } from './form-fields'

export async function getValidationMessage(messages, el) {
  if (el.validity.valid || el.validity.customError) return '';

  if (messages) {
    for (const key in messages) {
      if (!el.validity[key]) continue;
      return typeof messages[key] === 'function' ? await messages[key](el) : messages[key]
    }
  }

  return el.validationMessage;
}

export async function collectErrors(elements, customValidate, messages, bails) {
  const errors = {};

  for (const el of elements) {
    const message = await getValidationMessage(messages, el);
    if (message) {
      errors[el.name] = message;
      if (bails) return [message];
    }
  }

  if (customValidate) {
    const blame = (name, message) => message && (errors[name] = message);
    await customValidate(makeDraft(elements), blame);
  }

  return errors;
}
