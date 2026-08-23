import crypto from "crypto";
import { DateTime } from "luxon";

const generate_OTP = (user_id, email, created_at) => {
    let timeValue;
    if (created_at && typeof created_at.valueOf === 'function') {
        timeValue = created_at.valueOf();
    } else {
        timeValue = new Date(created_at).valueOf();
    }
    const signature = user_id + email + timeValue;
    console.log("generate", signature);
    let process_signature = '';

    for (let i = 0; i < signature.length; i++) {
        if (i % 2) process_signature += signature.charAt(i);
    }

    const hash = crypto.createHmac('sha256', '67911420')
        .update(signature)
        .digest('hex');
    console.log("hash", hash);
    const numbersOnly = hash.replace(/\D/g, '');
    if (numbersOnly.length < 6) {
        return generate_OTP(hash, email, created_at);
    } else {
        return numbersOnly.substring(0, 6);
    }
}

export { generate_OTP }
