import style from "./mention.module.css";
import { search_users } from "../../helpers/profile/profile.request";

/**
 * Attaches @-mention autocomplete to any [data-comment-input] or
 * [data-reply-input] within `container`, using event delegation so it
 * works for inputs that don't exist yet at call time (dynamically added
 * comment/reply forms).
 *
 * Returns { getMentionIds(input), clearMentions(input) } so callers can
 * read out which user IDs were mentioned in a given input right before
 * submitting, then clear that input's mention state afterward.
 */
export function initMentionPicker(container) {
    if (!container) return { getMentionIds: () => [], clearMentions: () => {} };

    let dropdownEl = null;
    let searchTimer = null;
    const mentionsByInput = new WeakMap();

    function getMentionMap(input) {
        if (!mentionsByInput.has(input)) mentionsByInput.set(input, new Map());
        return mentionsByInput.get(input);
    }

    function closeDropdown() {
        if (dropdownEl) {
            dropdownEl.remove();
            dropdownEl = null;
        }
    }

    function selectMention(input, userId, username) {
        const cursorPos = input.selectionStart;
        const textBeforeCursor = input.value.slice(0, cursorPos);
        const textAfterCursor = input.value.slice(cursorPos);
        const newTextBefore = textBeforeCursor.replace(/@(\w*)$/, `@${username} `);

        input.value = newTextBefore + textAfterCursor;
        getMentionMap(input).set(username, userId);
        closeDropdown();
        input.focus();
    }

   function showDropdown(input, users) {
    closeDropdown();
    if (!users.length) return;

    dropdownEl = document.createElement('div');
    dropdownEl.className = style["mention-dropdown"];
    dropdownEl.innerHTML = users.map(u => `
        <div class="${style["mention-item"]}" data-user-id="${u.user_id || u.id}" data-username="${u.username}">
            ${u.username}
        </div>
    `).join('');

    // Find the modal card container safely without relying on the wrong CSS module
    const card = input.closest('section') || container.querySelector('section') || container;

    if (card) {
        const computedPosition = getComputedStyle(card).position;
        if (computedPosition === 'static') {
            card.style.position = 'relative';
        }
        
        // Calculate exact position relative to the modal card
        const cardRect = card.getBoundingClientRect();
        const inputRect = input.getBoundingClientRect();

        dropdownEl.style.position = 'absolute';
        dropdownEl.style.top = `${inputRect.bottom - cardRect.top + card.scrollTop + 4}px`;
        dropdownEl.style.left = `${inputRect.left - cardRect.left}px`;
        dropdownEl.style.width = `${inputRect.width}px`;
        dropdownEl.style.zIndex = '9999';

        card.appendChild(dropdownEl);
    }

    dropdownEl.addEventListener('mousedown', (e) => {
        e.preventDefault(); // keep focus on input instead of blurring it
        const item = e.target.closest('[data-user-id]');
        if (!item) return;
        selectMention(input, item.dataset.userId, item.dataset.username);
    });
}
    container.addEventListener('input', (e) => {
        const input = e.target;
        if (!input.matches('[data-comment-input], [data-reply-input], #captionInput')) return;
        
        const cursorPos = input.selectionStart;
        const textBeforeCursor = input.value.slice(0, cursorPos);
        const match = textBeforeCursor.match(/@(\w*)$/);

        clearTimeout(searchTimer);

        if (!match || !match[1]) {
            closeDropdown();
            return;
        }

        const query = match[1];
        searchTimer = setTimeout(async () => {
            try {
                const { data } = await search_users(query);
                showDropdown(input, data || []);
            } catch (error) {
                console.error("Mention search failed:", error);
            }
        }, 250);
    });

    document.addEventListener('click', (e) => {
        if (dropdownEl && !dropdownEl.contains(e.target)) closeDropdown();
    });

    return {
        getMentionIds(input) {
            return Array.from(getMentionMap(input).values());
        },
        clearMentions(input) {
            getMentionMap(input).clear();
        },
    };
}