//app-form.js
// This file is used to handle the app form functionality in the Shopify dashboard extension
// let appButton = document.querySelector('.app-btn');
// appButton.addEventListener('click', function() {
//     alert("This is from app-form.js");
// });
let userForm = document.querySelector("form[type=app-form]");

userForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // console.log("Form button cliked!");
    let formData = new FormData(userForm);
    let data= [...formData.values()];
    fetch(`${location.origin}/apps/proxy/userinfo?shop=${Shopify.shop}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response=> response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
});