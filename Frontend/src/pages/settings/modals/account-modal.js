// account-modal.js
// Content for the "Accounts Center" overlay: change-password form + a
// read-only list of previous password changes (metadata only — never
// render actual past passwords, even mocked ones).
import { fetch_password_history, change_password } from "../api/account.service";

export function render_account_modal(body, style) {
    body.innerHTML = `
        <form id="changePasswordForm">
            <div class="${style["field"]}">
                <label>Current password</label>
                <input type="password" name="current_password" class="${style["input"]}" required />
            </div>
            <div class="${style["field"]}">
                <label>New password</label>
                <input type="password" name="new_password" class="${style["input"]}" required minlength="8" />
            </div>
            <div class="${style["field"]}">
                <label>Confirm new password</label>
                <input type="password" name="confirm_password" class="${style["input"]}" required minlength="8" />
            </div>
            <p class="${style["form-error"]}" id="passwordError"></p>
            <button type="submit" class="${style["btn"]} ${style["btn-primary"]}" id="passwordSubmit">
                Update password
            </button>
        </form>

        <div class="${style["divider"]}"></div>

        <p class="${style["section-label"]}">Previous passwords</p>
        <div id="passwordHistory">
            <div class="${style["skeleton-line"]}" style="width:100%"></div>
            <div class="${style["skeleton-line"]}" style="width:75%"></div>
        </div>
    `;

    let has_submit = false; // submission guard
    const form = body.querySelector("#changePasswordForm");
    const error_el = body.querySelector("#passwordError");
    const submit_btn = body.querySelector("#passwordSubmit");

    async function load_history() {
        const history_el = body.querySelector("#passwordHistory");
        const history = await fetch_password_history();
        history_el.innerHTML = history
            .map(
                (h) => `
                <div class="${style["list-row"]}">
                    <span>Changed ${h.changed_at}</span>
                    <span class="${style["muted-text"]}">${h.hint}</span>
                </div>`
            )
            .join("");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (has_submit) return;
        error_el.textContent = "";

        const data = new FormData(form);
        const current_password = data.get("current_password");
        const new_password = data.get("new_password");
        const confirm_password = data.get("confirm_password");

        if (new_password !== confirm_password) {
            error_el.textContent = "New passwords do not match.";
            return;
        }

        has_submit = true;
        submit_btn.disabled = true;
        submit_btn.textContent = "Updating...";

        try {
            await change_password({ current_password, new_password });
            form.reset();
            submit_btn.textContent = "Updated ✓";
            await load_history();
            setTimeout(() => (submit_btn.textContent = "Update password"), 1500);
        } catch (err) {
            error_el.textContent = err.message;
            submit_btn.textContent = "Update password";
        } finally {
            has_submit = false;
            submit_btn.disabled = false;
        }
    });

    load_history();
}
