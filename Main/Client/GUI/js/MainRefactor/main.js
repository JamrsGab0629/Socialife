<<<<<<< HEAD
import { SidebarManager } from './SidebarManager.js';
import { ComponentFactory } from './ComponentFactory.js';

document.addEventListener('DOMContentLoaded', () => {
  
  const sidebarApp = new SidebarManager();

  
  const cardContainer = document.getElementById('card-container');
  if (cardContainer) {
    const sampleCard = ComponentFactory.createCard('Interactive Settings', () => {
      console.log('[Activity Log] Card action clicked!');
    });
    cardContainer.appendChild(sampleCard);
  }
=======
import { SidebarManager } from './SidebarManager.js';
import { ComponentFactory } from './ComponentFactory.js';

document.addEventListener('DOMContentLoaded', () => {
    
  const sidebarApp = new SidebarManager();
  const cardContainer = document.getElementById('card-container');
  if (cardContainer) {
    const sampleCard = ComponentFactory.createCard('Interactive Settings', () => {
      console.log('[Activity Log] Card action clicked!');
    });
    cardContainer.appendChild(sampleCard);
  }
>>>>>>> d99a73c590e4d38b5677bfc2f3b03d6a673723dd
});