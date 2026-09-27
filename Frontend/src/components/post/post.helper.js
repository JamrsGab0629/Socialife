import style from "./post.module.css";

export const Helper = (comment_data) => {
    const data = comment_data || [];
    let template = "";

    if (data.length === 0) return template;

    data.forEach((comment) => {
        template += `
            <div class="${style["comment"]}">
                <div class="${style["comment-avatar"]}">
                    <img src="${comment["avatar_url"] || "/icon/default-avatar.svg"}" alt="${comment["user_name"] || "User"}">
                </div>
                <div><b>${comment["user_name"] || "Anonymous"}</b> ${comment["comment"] || ""}</div>
            </div>
        `;
    });

    return template;
};

export default Helper;