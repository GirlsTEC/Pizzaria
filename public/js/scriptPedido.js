const addToCartButton = document.getElementsByName('add-to-cart')
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal")
const cartCounter = document.getElementById("cart-count")

let cart = [];
//abrir carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex"
})

//fechar modal clicando na tela
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

//botao de fechar
closeModalBtn.addEventListener("click", function (event) {
    cartModal.style.display = "none"
})

checkoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    alert('Compra Finalizada, Valor Final de ' + cartTotal.innerText);
})

//botao para adicionar no carrinho
addToCartButton.forEach((cart) => {
    cart.addEventListener('click', function () {
        const id = parseInt(cart.getAttribute('id'))
        const name = cart.getAttribute("data-name")
        const price = parseFloat(cart.getAttribute("data-price"))
        addToCart(id, name, price)
    })
})

//função adicionar no carrinho
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id)
    if (existingItem) {
        increaseItem(id);
    } else {
        cart.unshift({
            id,
            name,
            price,
            quantity: 1,
        })
    }
    getTotal()
    updateCart();
}
//função deletar do carrinho
function deleteItem(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity = 1;
            cart.splice(i, 1);
        }
    }
    updateCart();
    getTotal(cart);
}
//função atualizar
function updateCart() {
    cartItemsContainer.innerHTML = cart.map(
        (item) => `
            <div class="cart-item flex justify-between items-center py-0 px-4 my-1 mx-0">
                <h3>${item.name}</h3>
                <div class="cart-detail flex items-center justify-between">
                    <div class="mid flex items-center">
                        <button onClick={decreaseItem(${item.id})}>-</button>
                        <p>${item.quantity}</p>
                        <button onClick={increaseItem(${item.id})}>+</button>
                    </div>
                    <p>R$ ${item.price.toFixed(2)}</p>
                    <button onClick={deleteItem(${item.id})} class='cart-product'>Delete</button>
                </div>
            </div>`
    ).join("");
}
//função
function getTotal() {
    let {totalItem, totalPrice} = cart.reduce(
        (total, cartItem) => {
            total.totalPrice += cartItem.price * cartItem.quantity;
            total.totalItem += cartItem.quantity;
            return total;
        },
        {totalItem: 0, totalPrice: 0}
    )

    cartTotal.innerText = "R$ " + totalPrice.toFixed(2);
    cartCounter.innerText = totalItem;
}
//aumenta a quantidade do item no carrinho
function increaseItem(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i] && cart[i].id === id) {
            cart[i].quantity += 1;
        }
    }
    updateCart();
    getTotal();
}
//diminui a quantidade do item no carrinho
function decreaseItem(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i] && cart[i].id === id) {
            cart[i].quantity -= 1
            if (cart[i].quantity === 0) {
                deleteItem(id)
            }
        }
    }
    updateCart();
    getTotal();
}

updateCart()