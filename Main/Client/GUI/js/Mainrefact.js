class ComponentFactory{
    static createCard(title , actionCallback){
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
        <h3>${title}</h3>
        <button class="card-action-btn">Action</button>
        `;
    }
}