import { change_password } from "../api/account.service";
import { changePassword$ } from "../../../validators/user.validators";

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
  `;

    let has_submit = false;
    const form = body.querySelector("#changePasswordForm");
    const error_el = body.querySelector("#passwordError");
    const submit_btn = body.querySelector("#passwordSubmit");

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

        if (current_password === new_password) {
            error_el.textContent = "New password must not be the same with the current password";
            return;
        }

        const validation = changePassword$.safeParse({
            password: current_password,
            new_password: new_password,
        });

        if (!validation.success) {
            error_el.textContent = validation.error.issues[0]?.message || "Invalid input format.";
            return;
        }

        // 3. Submit validated data
        has_submit = true;
        submit_btn.disabled = true;
        submit_btn.textContent = "Updating...";

        try {
            await change_password(validation.data);
            form.reset();
            submit_btn.textContent = "Updated ✓";
            setTimeout(() => (submit_btn.textContent = "Update password"), 1500);
        } catch (err) {
            error_el.textContent = err.message;
            submit_btn.textContent = "Update password";
        } finally {
            has_submit = false;
            submit_btn.disabled = false;
        }
    });
}