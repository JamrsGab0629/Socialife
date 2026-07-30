export default function Final(root){
    root.innerHTML = `
        <div class="auth-card profile-card">
            <h2 class="otp-title">Complete your profile</h2>
            <p class="otp-sub">Step 2</p>

            <form class="auth-form" id="profileForm" novalidate>

            <div class="profile-name-grid">
                <label class="auth-field">
                <span>First Name</span>
                <input type="text" name="firstName" autocomplete="given-name" required placeholder="Juan">
                </label>

                <label class="auth-field">
                <span>Middle Name</span>
                <input type="text" name="middleName" autocomplete="additional-name" placeholder="Dela">
                </label>
            </div>

            <label class="auth-field">
                <span>Last Name</span>
                <input type="text" name="lastName" autocomplete="family-name" required placeholder="Cruz">
            </label>

            <label class="auth-field">
                <span>Birthdate</span>
                <input type="date" name="birthdate" id="birthdate" required>
            </label>

            <label class="auth-field">
                <span>Address</span>
                <input type="text" name="address" autocomplete="street-address" required placeholder="Balagtas, Bulacan, Philippines">
            </label>

            <button type="submit" class="btn btn-primary auth-submit">Complete Profile</button>

            </form>
        </div>
    `
}