# Socialife Loader

A reusable loading screen for the **Socialife** project.

---

# Step 1: Add the CSS

Include the loader stylesheet in your HTML.

```html
<link rel="stylesheet" href="style.css">
```

---

# Step 2: Add the Loader HTML

Place the loader HTML inside the `<body>` of your page.

```html
<div class="loader" id="loader">
    <div class="circle-wrap">
        <svg class="progress-ring" viewBox="0 0 200 200">
            <circle
                class="progress-ring-track"
                cx="100"
                cy="100"
                r="90">
            </circle>

            <circle
                class="progress-ring-fill"
                id="ringFill"
                cx="100"
                cy="100"
                r="90">
            </circle>
        </svg>

        <div class="circle-content">
            <span class="logo">socialife</span>
            <span class="percentage" id="percentage">0%</span>
        </div>
    </div>
</div>
```

---

# Step 3: Add the JavaScript

Include the loader script before the closing `</body>` tag.

```html
<script src="script.js"></script>
```

---

# Step 4: Show the Loader

Whenever your application starts loading something, call:

```javascript
socialifeLoader.show();
```

This will:

* Display the loading screen.
* Start the circular loading animation.
* Continue animating until you hide it.

---

# Step 5: Hide the Loader

After your loading process is finished, call:

```javascript
socialifeLoader.hide();
```

This will:

* Complete the progress to **100%**.
* Play the fade-out animation.
* Hide the loading screen.

---

# Example 1: Loading Data

```javascript
async function loadFeed() {

    socialifeLoader.show();

    try {

        const response = await fetch("/api/posts");
        const posts = await response.json();

        console.log(posts);

    } finally {

        socialifeLoader.hide();

    }

}
```

---

# Example 2: Testing the Loader

```javascript
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testLoader() {

    socialifeLoader.show();

    await sleep(3000);

    socialifeLoader.hide();

}

testLoader();
```

---

# API

### Show the loader

```javascript
socialifeLoader.show();
```

### Hide the loader

```javascript
socialifeLoader.hide();
```

---

# Typical Usage

```javascript
// for circle animatrion
socialifeLoader.show();

// Load data...
await fetch("/api/data");

socialifeLoader.hide();
```

or

```javascript
socialifeLoader.show();

// Login user...
await login();

socialifeLoader.hide();
```

or

```javascript
// for main animation
socialifeLoader.show();

// Initialize application...
await initializeApp();

socialifeLoader.hide();
```

---

# Notes

* Include **`style.css`**, the loader HTML, and **`script.js`** on every page where you want to use the loader.
* Call **`socialifeLoader.show()`** before starting a task.
* Call **`socialifeLoader.hide()`** after the task has finished.
* Do not use fixed delays in production unless you are testing the loader.
* The loader is designed for API requests, authentication, page initialization, uploads, downloads, and other loading operations.
* You can call the loader from any JavaScript file after `script.js` has been loaded.
