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
});