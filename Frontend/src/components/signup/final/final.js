import style from './final.module.css'
import style_btn from "../../../styles/main/btn.module.css"
import { init_variables, setup_form } from './final.helper'

export default function Final(root){
    // console.log("final.debug", this);
    root.innerHTML = `
        <div class="${style['auth-card']} ${style['profile-card']}">
            <h2 class="${style['otp-title']}">Complete your profile</h2>
            <p class="${style['otp-sub']}">Register Account</p>

            <!-- Added top-level error banner container -->
            <div class="${style['auth-error-banner']}" id="formErrorBanner" aria-live="polite"></div>

            <form class="${style['auth-form']}" id="profileForm" novalidate>

                <div class="${style['profile-name-grid']}">
                    <label class="${style['auth-field']}">
                        <span>First Name</span>
                        <input type="text" name="firstname" autocomplete="given-name" required placeholder="Juan">
                        <span class="${style['field-error-msg']}" id="firstnameError"></span>
                    </label>

                    <label class="${style['auth-field']}">
                        <span>Last Name</span>
                        <input type="text" name="lastname" autocomplete="family-name" required placeholder="Cruz">
                        <span class="${style['field-error-msg']}" id="lastnameError"></span>
                    </label>
                </div>

                <label class="${style['auth-field']}">
                    <span>Birthdate</span>
                    <input type="date" name="birthday" id="birthdate" required>
                    <span class="${style['field-error-msg']}" id="birthdayError"></span>
                </label>

                <button type="submit" class="${style_btn['btn']} ${style_btn['btn-primary']} ${style['auth-submit']}">Complete Profile</button>

            </form>
        </div>
    `

    function init( ){
        init_variables();
        setup_form( style, this );
    }

    init.bind(this)();
}