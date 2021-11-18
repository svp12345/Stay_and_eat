const submit = document.querySelector('#submit-btn');
submit.onclick = function () {
    const nameInput = document.querySelector("#name");
    const locationInput = document.querySelector("#location");
    const menuInput = document.querySelector("#menu");
    const priceInput = document.querySelector("#price");
    const name = nameInput.value;
    const location = locationInput.value;
    const menu = menuInput.value;
    const price = priceInput.value;
    nameInput.value = "";
    locationInput.value = "";
    menuInput.value = "";
    priceInput.value = "";
    console.log(name, location, price, menu);

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name: name, location: location, menu: menu, price: price })
    })
        .then(response => response.json());
}