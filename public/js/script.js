// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const taxSwitch = document.getElementById("switchCheck");

taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("taxToggleText");
    let originalPrice = document.getElementsByClassName("price");

    for (let i = 0; i < taxInfo.length; i++) {
        if (taxSwitch.checked) {
            taxInfo[i].style.display = "inline";
            originalPrice[i].style.display = "none";
        } else {
            taxInfo[i].style.display = "none";
            originalPrice[i].style.display = "inline";
        }
    }
});