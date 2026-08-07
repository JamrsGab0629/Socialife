import style from "./post.module.css";

export const Helper = ( comment_data ) => {
    // console.log('debig.helper', comment_data);
    const data = comment_data || [];
    let template = "";

    if (data.length === 0) return template;

    data.forEach((comment_data) => {
        template += `
            <div class="${style["comment"]}">
                <div class="${style["comment-avatar"]}">
                    <img src="../public/profile/${comment_data["user_id"]}" alt="${comment_data["user_name"]}">
                </div>
                <div><b>${comment_data["user_name"]}</b>${comment_data["comment"]}</div>
            </div>
        `
    });

    // console.log('debig.helper', template);
    return template;
}

export default Helper;