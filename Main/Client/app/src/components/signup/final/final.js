import style from './final.module.css'
import style_btn from "../../../styles/main/btn.module.css"

export default function Final(root){
    root.innerHTML = `
        <div class="${style['auth-card']} ${style['profile-card']}">
            <h2 class="${style['otp-title']}">Complete your profile</h2>
            <p class="${style['otp-sub']}">Step 2</p>

            <form class="${style['auth-form']}" id="profileForm" novalidate>

            <div class="${style['profile-name-grid']}">
                <label class="${style['auth-field']}">
                <span>First Name</span>
                <input type="text" name="firstName" autocomplete="given-name" required placeholder="Juan">
                </label>

                <label class="${style['auth-field']}">
                <span>Middle Name</span>
                <input type="text" name="middleName" autocomplete="additional-name" placeholder="Dela">
                </label>
            </div>

            <label class="${style['auth-field']}">
                <span>Last Name</span>
                <input type="text" name="lastName" autocomplete="family-name" required placeholder="Cruz">
            </label>

            <label class="${style['auth-field']}">
                <span>Birthdate</span>
                <input type="date" name="birthdate" id="birthdate" required>
            </label>

            <label class="${style['auth-field']}">
                <span>Address</span>
                <input type="text" name="address" autocomplete="street-address" required placeholder="Balagtas, Bulacan, Philippines">
            </label>

            <button type="submit" class="${style_btn['btn']} ${style_btn['btn-primary']} ${style['auth-submit']}">Complete Profile</button>

            </form>
        </div>
    `
}