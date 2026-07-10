function getId(name) {
    const val = document.getElementById(name);
    if (!val) throw new Error(`Element Id #${name}`);
    return val;
}

export async function initProfile({ signal }) {
    const abortCheck = () => {
        if (signal?.aborted) throw new Error("initProfile");
    }

    let triggers = null;
    let seeAllLink = null;
    
    try {
        abortCheck();
        console.log("profile init");
        triggers = document.querySelectorAll('.tab, .nav-item');

        const contents = {
            all: getId('tab-all'),
            photos: getId('tab-photos'),
            settings: getId('tab-settings')
        };

        const masterGrid = document.getElementById('master-photos-grid');
        const previewGrid = document.getElementById('all-photos-preview');

        if (masterGrid && previewGrid) {
            const photos = masterGrid.querySelectorAll('.photo-placeholder');
            // Take up to 6 photos for the small sidebar grid preview
            const previewCount = Math.min(photos.length, 6);

            for (let i = 0; i < previewCount; i++) {
                previewGrid.appendChild(photos[i].cloneNode(true));
            }
        }

        function activate(tabName) {
            triggers.forEach((t) => {
                const active = t.getAttribute('data-tab') === tabName;
                t.classList.toggle('active', active);
                t.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            Object.keys(contents).forEach(key => {
                if (contents[key]) {
                    contents[key].classList.toggle('active', key === tabName);
                }
            });
        }

        const onTabClick = (e) => {
            e.preventDefault();
            activate(e.currentTarget.getAttribute('data-tab'));
        };

        const onSeeAllClick = (e) => {
            e.preventDefault();
            activate('photos');
        };

        triggers.forEach((t) => {
            t.addEventListener('click', onTabClick);
        });

        const seeAllLink = document.getElementById('see-all-photos-lnk');
        if (seeAllLink) {
            seeAllLink.addEventListener('click', onSeeAllClick);
        }

        abortCheck();

        signal?.addEventListener('abort', () => {
            if (triggers) {
                triggers.forEach((trigger) => {
                    trigger.removeEventListener('click', onTabClick);
                });
            }

            if (seeAllLink) {
                seeAllLink.removeEventListener('click', onSeeAllClick);
            }

            console.log("Cleared tab navigation listeners.");
        });

        console.log("Profile fully rendered");
    } catch (error) {
        if (error.message === "initProfile") {
            console.error("Profile Aborted mid-session");
        } else {
            console.error(error);
        }
    }
};