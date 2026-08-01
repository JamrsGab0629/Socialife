<<<<<<< HEAD
export class ComponentFactory {
  static createCard(title, actionCallback) {
    const card = document.createElement('div');
    card.className = 'card';

    const heading = document.createElement('h3');
<<<<<<< HEAD
    heading.textContent = title; 
=======
    heading.textContent = title;
>>>>>>> fbb393ce6e3d5677e1ba48bfb75b4fe760d7c895

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
=======
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
>>>>>>> d99a73c590e4d38b5677bfc2f3b03d6a673723dd
}