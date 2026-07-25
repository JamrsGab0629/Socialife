import style from './component.module.css';
import { createState } from '../../core/createState';

export default function Counter(root) {
  const button = document.createElement('button');
  button.className = style['counter-btn'];

  const {get, set} = createState(0, render);

  function render() {
    button.innerText = `Click Me (${get()})`;
  }

  button.addEventListener('click', () => {
    set(get() + 1);
  });

  render();
  root.appendChild(button);
}
