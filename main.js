let eventBus = new Vue()

Vue.component("product-tabs", {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },

    template: `
    <div>
        <div>
            <span class="tab" 
            :class="{ activeTab: selectedTab === tab}"
            v-for="(tab,index) in tabs" 
            :key="index"
            @click="selectedTab = tab"
            >
            {{tab}}</span>
        </div>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for = "(review, index) in reviews" :key="index">
                        <p>{{review.name}}</p>
                        <p>Rating: {{review.rating}}</p>
                        <p>{{review.review}}</p>
                        <p>{{review.recommend}}</p>
                    </li>
                </ul>
        </div>

        <div v-show="selectedTab === 'Write a Review'">
            <product-review></product-review>
        </div>
    </div>
    `,
    data(){
        return{
            tabs: ["Reviews", "Write a Review"],
            selectedTab: "Reviews"
        }

    }
})

Vue.component("info-tabs", {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },

    template: `
    <div>

        <div>
        <span class="tab"
        v-for="(tab,index) in tabs"
        :key="index"
        :class="{activeTab: selectedTab === tab}"
        @click="selectedTab = tab"
        >
            {{tab}}        
        </span>
        </div>

        <div v-show="selectedTab === 'Shipping'">
            <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
            <product-details :details="details"></product-details>
        </div>

    </div>
    `,

    data() {
        return {
            tabs: ["Shipping", "Details"],
            selectedTab: "Shipping"
        }
    }
})

Vue.component("product-review", {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
        <strong>Please correct the following error(s):</strong>
        <ul>
            <li v-for="error in errors">{{error}}</li>
        </ul>
    </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
      <label for="recommend">Would you recommend this product?</label>

      <input type="radio" value="Yes" id="yes" v-model="recommend">
      <label for="yes">Yes</label>      

      <input type="radio" value="No" id="no" v-model="recommend">
      <label for="no">No</label>   
      </p>   
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: Number(this.rating),
                    recommend: this.recommend
                }
                eventBus.$emit("review-submitted", productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if (!this.name) {
                    this.errors.push("Name required.")
                }
                if (!this.review) {
                    this.errors.push("Review required.")
                }
                if (!this.rating) {
                    this.errors.push("Rating required.")
                }
                if (!this.recommend) {
                    this.errors.push("Recommendation required.")
                }
            }
        }
    }
})

Vue.component("product-details", {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
    <li v-for="detail in details">{{ detail }}</li>
  </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
     <div class="product">
          
        <div class="product-image">
          <img :src="image" />
        </div>
  
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>

            <info-tabs :shipping="shipping" :details="details"></info-tabs>
  
            <div class="color-box"
                 v-for="(variant, index) in variants" 
                 :key="variant.variantId"
                 :style="{ backgroundColor: variant.variantColor }"
                 @mouseover="updateProduct(index)"
                 >
            </div> 
  
            <button v-on:click="addToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
              >
            Add to cart
            </button>
            <button v-on:click="removeFromCart"
                :disabled="!inStock"
                :class="{disabledButton: !inStock}"
            >
            Remove item
            </button>
         </div>  

         <product-tabs :reviews="reviews"></product-tabs>
      </div>
     `,
    data() {
        return {
            product: 'Socks',
            brand: 'Joda',
            selectedVariant: 0,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [{
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: 'assets/baby-joda.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: 'assets/turbo-joda.png',
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId)
        },
        removeFromCart: function () {
            this.$emit("remove-from-cart", this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99 + ' €'
        }
    },
    mounted() {
        eventBus.$on("review-submitted", productReview => {
            this.reviews.push(productReview)
        })
    }
})


var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeCart(id) {
            this.cart.pop(id)
        }
    }
})