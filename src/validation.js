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
