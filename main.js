const app = new Vue({
    el: "#app",
    data: {
        product: "Socks",
        brand: "Joda",
        selectedVariant: 0,
        link: "file:///Users/matijaosojnik/Desktop/Projects/vue-starter/index.html",
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [{
                variantId: 2234,
                variantColor: 'green',
                variantImage: 'assets/baby-joda.jpg',
                variantQuantity: 10,
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: 'assets/turbo-joda.png',
            }
        ],
        sizes: ['S', 'M', 'L'],
        cart: 0,
        onSale: true
    },
    methods: {
            addToCart() {
            this.cart += 1
            },
            removeFromCart() {
                this.cart -= 1
            },
            changeImage(index) {
                this.selectedVariant = index
                console.log(index)
            }
        },
    computed: {
        title() { 
            return this.brand + " " + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if(this.onSale){
                return this.brand + " " + this.product + " are on sale!"
            }else{
                return this.brand + " " + this.product + " are not on sale."
            }
        }
    }
})