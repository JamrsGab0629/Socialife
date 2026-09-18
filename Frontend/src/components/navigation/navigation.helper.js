import * as verifyHelper from "../../helpers/auth/verify.request";
import { logout } from "../../helpers/auth/users.request";

export async function logoutAction() {
    try {
        const response = await logout();
        if (response) {
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
}

export async function setupUserInformation() {
    try {
        const response = await verifyHelper.checkAuth();
        // console.log("navigation.debig", response);
        const { first_name, last_name, avatar_url } = response?.user || {};

        const profileNameEl = document.querySelector('[class*="profile-name"]');
        if (profileNameEl && first_name && last_name) {
            profileNameEl.textContent = `${first_name} ${last_name}`;
        }

        const avatarImgEl = document.querySelector('[class*="avatar-ring"] img');
        if (avatarImgEl && avatar_url) {
            avatarImgEl.src = avatar_url;
            avatarImgEl.alt = `${first_name} ${last_name}`;
        }

    } catch (error) {
        console.error("Auth verification failed:", error);
        window.location.href = "/login";
    }
}

export function attachNavigationEvents(root) {
    const logoutLinks = root.querySelectorAll('[nav-action="log-out"]');
    logoutLinks.forEach((link) => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();
            await logoutAction();
        });
    });
}