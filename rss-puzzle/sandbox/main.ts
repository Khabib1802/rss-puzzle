import '@styles/global.scss';

import { Check, X, ChevronRight, LogOut } from 'lucide';

import Button from '@/components/ui/Button/Button.ts';
import Input from '@/components/ui/Input/Input.ts';
import Select, { type SelectOption } from '@/components/ui/Select/Select.ts';

import styles from './sandbox.module.scss';

const root = document.querySelector<HTMLDivElement>('#sandbox-root');

if (!root) {
  throw new Error('Sandbox root element not found');
}

function renderSection(title: string, nodes: HTMLElement[]): HTMLElement {
  const section = document.createElement('section');
  section.classList.add(styles['section']);

  const heading = document.createElement('h2');
  heading.textContent = title;

  const row = document.createElement('div');
  row.classList.add(styles['row']);
  row.append(...nodes);

  section.append(heading, row);
  return section;
}

// --- Button ---

const buttonVariants = renderSection('Button — variants', [
  new Button({ text: 'Primary', variant: 'primary' }).element,
  new Button({ text: 'Secondary', variant: 'secondary' }).element,
  new Button({ text: 'Danger', variant: 'danger' }).element,
]);

const buttonSizes = renderSection('Button — sizes', [
  new Button({ text: 'Small', variant: 'primary', size: 'sm' }).element,
  new Button({ text: 'Medium', variant: 'primary', size: 'md' }).element,
  new Button({ text: 'Large', variant: 'primary', size: 'lg' }).element,
]);

const buttonIcons = renderSection('Button — icons', [
  new Button({ text: 'Confirm', variant: 'primary', icon: Check, iconPosition: 'left' }).element,
  new Button({ text: 'Cancel', variant: 'secondary', icon: X, iconPosition: 'right' }).element,
  new Button({ variant: 'secondary', icon: LogOut, ariaLabel: 'Log out' }).element,
]);

const activeToggle = new Button({ text: 'Hint', variant: 'secondary', icon: ChevronRight, active: true });

const hoverDemo = new Button({ text: 'Hover (static demo)', variant: 'primary' });
hoverDemo.element.classList.add(styles['forceHover']);

const buttonStates = renderSection('Button — states', [
  activeToggle.element,
  new Button({ text: 'Disabled', variant: 'primary', disabled: true }).element,
  hoverDemo.element,
]);

// --- Input ---

const inputDefault = new Input({ label: 'Default (live)', placeholder: 'John' });

const inputValid = new Input({ label: 'Type to validate (live)', placeholder: 'Ann', minLength: 2 });

const inputInvalid = new Input({
  label: 'Invalid (static demo)',
  placeholder: 'Ann',
  required: true,
  minLength: 5,
});
const invalidNativeInput = inputInvalid.element.querySelector('input');
if (invalidNativeInput) {
  invalidNativeInput.value = 'ab';
}
inputInvalid.isValid();

const inputSection = renderSection('Input — states', [inputDefault.element, inputValid.element, inputInvalid.element]);

// --- Select ---

const fruitOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', isCompleted: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
];

const selectDefault = new Select(fruitOptions);

const selectDisabled = new Select(fruitOptions);
selectDisabled.setDisabled(true);

const selectSection = renderSection('Select — states (open/typeahead — live)', [
  selectDefault.element,
  selectDisabled.element,
]);

root.append(buttonVariants, buttonSizes, buttonIcons, buttonStates, inputSection, selectSection);
