
    
function addToCart(params) {
    document.querySelectorAll('.add').forEach(add => {
        add.addEventListener('click',async (e) => {
            e.preventDefault();
            const added = document.querySelector('input');
            const addedValue = added.valueAsNumber;
            try {
                const res = await fetch('/carts',{
                    method : 'POST',
                    body : JSON.stringify({addedValue}),
                    headers : {'Content-Type' : 'application/json'}
                })
            } catch (error) {
                console.log(error);
            }
        });
    })
}

module.exports = addToCart;