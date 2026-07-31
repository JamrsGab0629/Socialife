export class ComponentFactory {
  static createCard(title, actionCallback) {
    const card = document.createElement('div');
    card.className = 'card';

    const heading = document.createElement('h3');
    heading.textContent = title;

    const button = document.createElement('button');
    button.className = 'card-action-btn';
    button.textContent = 'Action';

    if (actionCallback) {
      button.addEventListener('click', actionCallback);
    }

    card.append(heading, button);
    console.log(`[Factory] Card created: "${title}"`);
    return card;
  }
}