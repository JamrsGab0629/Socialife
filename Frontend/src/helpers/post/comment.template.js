export function CommentItemTemplate(commentData) {
    const userName = commentData.user_name || commentData.author?.user_name || "User";
    const commentText = commentData.comment || "";
    
    return `
        <div class="comment-item" style="display: flex; gap: 10px; margin-top: 8px; font-size: 13px;">
            <div class="comment-bubble" style="background: #f0f2f5; padding: 8px 12px; border-radius: 12px; width: 100%;">
                <strong style="color: #050505;">${userName}</strong>
                <div style="color: #4b4f56; margin-top: 2px;">${commentText}</div>
            </div>
        </div>
    `;
}