function createContainer (id, classNames, ...children) {
  const container = document.createElement('div');
  container.id = id;
  container.className = classNames;
  children.forEach((child) => {
    container.appendChild(child);
  })
  return container;
}

function createElement(value, classNames) {
  const valueELem = document.createElement('p');
  valueELem.textContent = value;
  valueELem.className = classNames;
  return valueELem;
};

function createLabeledElement(id, label, value) {
  const labelElem = createElement(label, 'bold');
  const valueElem = createElement(value, 'value');
  const container = createContainer(id, 'flex-row', labelElem, valueElem);
  return container;
}
function createAnHour (hour) {
  
}
export {createContainer, createElement, createLabeledElement};