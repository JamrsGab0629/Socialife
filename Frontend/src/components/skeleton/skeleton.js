import style from "./skeleton.module.css";

// Building blocks
const line = (width = "100%", height = 12) =>
    `<div class="${style.skeleton}" style="width:${width};height:${height}px"></div>`;

const avatar = (size = 44) =>
    `<div class="${style.skeleton} ${style.circle}" style="width:${size}px;height:${size}px;flex-shrink:0"></div>`;

// Templates, one per part of the app
const templates = {
    line: () => line(),

    avatar: () => avatar(),

    post: () => `
        <div class="${style.card}">
            <div class="${style.row}">
                ${avatar(44)}
                <div class="${style.col}">${line("40%", 14)}${line("20%", 10)}</div>
            </div>
            ${line("90%")}
            ${line("70%")}
            <div class="${style.skeleton} ${style.media}"></div>
        </div>
    `,

    notification: () => `
        <div class="${style.row}" style="padding:12px 16px">
            ${avatar(52)}
            <div class="${style.col}">${line("70%", 14)}${line("25%", 10)}</div>
        </div>
    `,

    comment: () => `
        <div class="${style.row}" style="padding:8px 0;align-items:flex-start">
            ${avatar(32)}
            <div class="${style.col}">${line("35%", 12)}${line("80%", 12)}</div>
        </div>
    `,

    friend: () => `
        <div class="${style.row}" style="padding:8px 0">
            ${avatar(40)}
            <div class="${style.col}">${line("50%", 14)}</div>
            ${line("70px", 28)}
        </div>
    `,
};

/**
 * Returns the HTML for `count` skeletons of the given type.
 * Usage: el.innerHTML = skeleton("post", 3);
 */
export function skeleton(type = "line", count = 1) {
    const render = templates[type] || templates.line;
    return `<div aria-hidden="true" data-skeleton>${Array.from({ length: count }, render).join("")}</div>`;
}

/**
 * Shows a skeleton inside `container` and returns a function that removes it.
 * Usage: const done = showSkeleton(el, "post", 2); await load(); done();
 */
export function showSkeleton(container, type, count = 1) {
    if (!container) return () => {};
    container.insertAdjacentHTML("beforeend", skeleton(type, count));
    const node = container.lastElementChild;
    return () => node?.remove();
}