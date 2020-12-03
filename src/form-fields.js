export function parseInputValue(element) {
  if (element.type === "number") {
    return parseInt(element.value, 10);
  }

  if (element.type === "checkbox") {
    return element.checked;
  }

  // TODO: date, range

  return element.value;
}

export function setDefaultValues(elements) {
  elements.forEach((el) => {
    el.value = el.getAttribute("data-value");
  })
}

export function makeDraft(elements) {
  return elements.reduce((acc, el) => {
    const value = parseInputValue(el);

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