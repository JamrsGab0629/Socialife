document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('toast');

    document.addEventListener('click', (e) => {
        const item = e.target.closest('[data-action]');
        if (!item) return;

        e.preventDefault();
        const action = item.dataset.action;

        if (action === 'delete-account') {
            if (confirm('⚠️ Are you sure you want to delete your account?')) {
                toast?.show('Account deletion requested...', 'error');
            }
        } else if (action === 'logout') {
            if (confirm('Log out of Socialife?')) {
                toast?.show('Logging out...', 'show');
            }
        } else {
            const title = item.querySelector('.item-title')?.textContent || action;
            toast?.show(`${title} opened`, 'show');
        }
    });

    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            toast?.show('Dark mode feature coming soon!', 'show');
        });
    }
});