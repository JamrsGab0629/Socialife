function getId(name) {
    const val = document.getElementById(name);
    if (!val) throw new Error(`Element Id #${name}`);
    return val;
}

export async function initSettings({ signal }) {
    const abortCheck = () => {
        if (signal?.aborted) throw new Error("initSettings");
    }

    let toggle = null;
    let checkItems = null;
    let searchInput = null;

    try {
        //helpers
        const toggleClick = (e) => {
            e.stopPropagation();
            e.currentTarget.classList.toggle('active');
        }

        const toggleKeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.currentTarget.click();
            }
        }

        const checkboxListener = (e) => {
            const item = e.currentTarget;
            const box = item.querySelector('.check-box');
            if (!box) return;

            box.classList.toggle('checked');
            box.textContent = box.classList.contains('checked') ? '✓' : '';
        }

        abortCheck();

        // settings config
        try {
            toggle = getId('darkModeToggle');
            toggle.addEventListener('click', toggleClick);
            toggle.addEventListener('keydown', toggleClick);
        } catch (error) {
            console.error(error);
        }

        checkItems = document.querySelectorAll('.check-item');
        console.log(checkItems.length);
        checkItems.forEach((item) => {
            item.addEventListener('click', checkboxListener);
        });

        signal?.addEventListener('abort', () => {
            if (toggle) {
                toggle.removeEventListener('click', toggleClick);
                toggle.removeEventListener('keydown', toggleClick);
            }

            checkItems.forEach((item) => {
                const box = item.querySelector('.check-box');
                if (!box) return;

                item.removeEventListener('click', checkboxListener);
            });

            console.log("Cleared tab navigation listeners.");
        });

        abortCheck();

        console.log("Settings fully rendered");
    } catch (error) {
        if (error.message === "initSettings") {
            console.error("Profile Aborted mid-session");
        } else {
            console.error(error);
        }
    }
}