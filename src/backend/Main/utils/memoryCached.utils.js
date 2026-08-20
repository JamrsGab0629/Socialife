


export const otpCache = new Map();

// Run a cleanup every 5 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [email, userData] of otpCache.entries()) {
        if (now > userData.expiresAt) {
            otpCache.delete(email);
        }
    }
}, 5 * 60 * 1000);