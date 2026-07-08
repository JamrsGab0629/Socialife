function getId(name){
    const val = document.getElementById(name);
    if(!val) throw new Error(`id #{name}`);
    return val;
}

export async function init(){
    console.log('init time');

    const main_view = getId("main-content");

    const html = {}

    try {
        const response = await fetch('./html/timeline.html');

        if (!response.ok) throw new Error(`Error fecthing HTML: timeline code ${response.status}`);

        const data = await response.text();

        html.time = data;
    } catch (error){
        console.error(`Failed to load`, error);
        return;
    }

    main_view.innerHTML = html.time;
}