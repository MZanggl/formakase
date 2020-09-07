export function makeDraft(elements, init) {
  return elements.reduce((acc, el) => {
    let value = el.value;
    if (init) {
      value = el.getAttribute("data-value");
      el.value = value;
    }

    if (el.type === "number") {
      value = Number(value);
    } else if (el.type === "checkbox") {
      value = el.checked;
    }
    // TODO: date, range

    acc[el.name] = value;
    return acc;
  }, {});
}

export function disableSubmitButtons(elements, value) {
  elements.filter(el => ["BUTTON", "INPUT"].includes(el.tagName) && el.type === 'submit').map(el => (el.disabled = value));
}

export function reportHTML5Message(element, message) {
  element.setCustomValidity(message);
  element.reportValidity();
}