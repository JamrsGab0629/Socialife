import User from "../model/user.model.js";
import Otp from "../model/otp.model.js";
import { hashPassword } from "../utils/passwordHashing.utils.js";
import { sendVerificationEmail } from "./gmail/email.service.js";
import { generateOTP } from "../utils/gmail_utils/otpGen.utils.js";
import { getOTPExpiration } from "../utils/gmail_utils/otpExpired.utils.js";
import { generate_OTP } from "../utils/otp.utils.js";
import { DateTime } from "luxon";

const registerUser = async ({ username, email, password }) => {
    // 1. Check if username or email already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername && existingUsername?.is_verified) {
        throw new Error("Username already exists");
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail && existingEmail?.is_verified) {
        throw new Error("Email already in used? Try logging in.");
    }

    const hashedPassword = await hashPassword(password);

    // create account
    let targetUser;
    if (existingEmail && !existingEmail.is_verified) {
        // if email alreaddy exist
        existingEmail.username = username;
        existingEmail.password = hashedPassword;
        existingEmail.created_at = DateTime.now().toJSDate();

        await existingEmail.save()

        targetUser = existingEmail;
    } else {
        targetUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            role: "user",
        });
    }

    const otp = generate_OTP(targetUser.user_id, targetUser.email, targetUser.created_at);

    return {
        message: `Registration initiated. Please check your email for the 6-digit OTP code. otp is ${otp}... [please remove after testing]`,
    };
};

const verify_OTP = async ({ email, otp }) => {
    const existingEmail = await User.findOne({ where: { email } });

    // failsafes
    if (!existingEmail) {
        throw new Error("No active email is in used");
    }

    // check if the otp code has passed
    const createdAt = DateTime.fromJSDate(existingEmail.created_at);
    const now = DateTime.now();

    if (now.valueOf() - createdAt.valueOf() > 5 * 60 * 1000) {
        throw new Error("OTP expired. Generate new code by hitting resend");
    }

    // generate otp and compares them
    const otp_now = generate_OTP(existingEmail.user_id, email, existingEmail.created_at);
    const is_same = ( otp_now === otp )
    console.log("verify_OTP", otp_now, otp)

    if (!is_same) {
        throw new Error("OTP code not same");
    }

    existingEmail.is_verified = true;
    existingEmail.is_activated = true;
    existingEmail.save();

    return {
        message: "OTP succesfull",
    }
}

const resend_OTP = async ({ email }) => {
    const existingEmail = await User.findOne({ where: { email } });

    if (!existingEmail) {
        throw new Error("No active email is in used");
    }

    // check if the otp code has passed
    const createdAt = DateTime.fromJSDate(existingEmail.created_at);
    const now = DateTime.now();

    if (now.valueOf() - createdAt.valueOf() > 5 * 60 * 1000) {
        existingEmail.created_at = now.toJSDate();

        await existingEmail.save();
    }

    console.log(now.valueOf() - createdAt.valueOf());

    const otp = generate_OTP(existingEmail.user_id, email, existingEmail.created_at);

    return {
        message: "OTP resent",
        temp: `otp is ${otp}... [please remove after testing]`,
    }
}

const completeUser = async ({ email, firstname, lastname, birthdate }) => {
    const existingEmail = await User.findOne({ where: email });

    if (!existingEmail) {
        throw new Error("No active email is in used");
    }

    existingEmail.firstname = firstname,
        existingEmail.lastname = lastname,
        existingEmail.birthdate = birthdate,
        existingEmail.is_completed = true,

        await existingEmail.save();

    return {
        message: "Registration complete",
    }
}

export { registerUser, verify_OTP, resend_OTP, completeUser };
