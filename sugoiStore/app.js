// Hamburger sidebar toggle
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");

hamburger.addEventListener("click", () => {
  sidebar.style.width = "300px";
});

closeBtn.addEventListener("click", () => {
  sidebar.style.width = "0";
});


//fetch data

let products = []
fetch("product.json")
.then((res)=> res.json())
.then((data)=> {
    products = data
    displayFourProducts(products)
})
.catch((err)=> console.error("this is an error", err))

  // display only 4 products on the landing page


  function displayFourProducts(productList){
    const container = document.getElementById("display-four-products")
    container.innerHTML = ""

    const limitedProduct = productList.slice(0, 4);

    limitedProduct.forEach(({image, title, price})=>{
        const card = document.createElement("div")
        card.className = "product-card";

        card.innerHTML += `
        <img src="${image}" alt="${title}" class="fourProductList">
        <h3>${title}</h3>
        <p>${price}</p>
        `
        card.classList.add("card")
        container.appendChild(card)

    })
  }