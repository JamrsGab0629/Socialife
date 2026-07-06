document.addEventListener("DOMContentLoaded", () => {
  const uploadContainers = document.querySelectorAll(".image-upload-wrapper");

  uploadContainers.forEach(container => {
    const fileInput = container.querySelector(".file-input");
    const previewImg = container.querySelector(".preview-img");
    const placeholder = container.querySelector(".upload-placeholder");

    // Click trigger forwarding to input element safely
    container.addEventListener("click", () => {
      fileInput.click();
    });

    // Detect file input variations
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
          previewImg.src = event.target.result;
          previewImg.classList.remove("hidden");
          placeholder.classList.add("hidden");
          
          // Tighten wrapper borders once custom assets fill view blocks
          container.style.borderStyle = "solid";
        };

        reader.readAsDataURL(file);
      }
    });
  });
});