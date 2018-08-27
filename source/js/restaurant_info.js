let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) {
            console.error(error);
        } else {
            self.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: restaurant.latlng,
                scrollwheel: false
            });
            fillBreadcrumb();
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
        }
    });
}

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = () => {
    return new Promise((resolve, reject) => {
        if (self.restaurant) { // restaurant already fetched!
            return resolve(self.restaurant)
        }
        const id = getParameterByName('id');
        if (!id) { // no id found in URL
            const error = 'No restaurant id in URL'
            return reject(error);
        } else {
            DBHelper.fetchRestaurantById(id, (error, restaurant) => {
                self.restaurant = restaurant;
                if (!restaurant) {
                    return reject(error);
                }
                fillRestaurantHTML();
                DBHelper.fetchReviewByRestaurant(restaurant.id)
                    .then((reviews) => {
                        fillReviewsHTML(reviews);
                        fillFavouritesHTML(restaurant.is_favorite);
                        return resolve(self.restaurant);
                    }).catch(err => {
                        return reject(err);
                    })
                    //return resolve(self.restaurant);
            });
        }
    });
}


/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img'
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.setAttribute('alt', 'Photo of the ' + restaurant.name + ' restaurant');

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // fill reviews
    fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h2');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
}

/**
 * Remove all reviews HTML.
 */
const resetReviewsHTML = () => {
    const container = document.getElementById('reviews-container');
    container.innerHTML = "";
    const ul = document.createElement('ul');
    ul.id = 'reviews-list';
    container.appendChild(ul);
}


/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
    const li = document.createElement('li');
    const name = document.createElement('p');
    name.innerHTML = review.name;
    li.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = review.date;
    li.appendChild(date);

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Catch the restaurant review form action.
 */
const submitReview = () => {
    let review = {};
    let formEl = document.getElementById('post-review-form');
    let formElID = document.getElementById('restaurant_id');
    formElID.value = parseInt(getParameterByName('id'));
    formEl.appendChild(formElID);
    for (let i = 0; i < formEl.length; ++i) {
        let fieldName = formEl[i].name;
        let value = formEl[i].value;
        if (fieldName === "" || value === "") continue;
        if (fieldName === "restaurant_id" || fieldName === "rating") {
            value = parseInt(value);
        }
        review[formEl[i].name] = value;
    }
    formEl.reset();
    DBHelper.sendReview(review);
}

/**
 * Manage Favorite button
 */
const favoriteToggle = () => {
    let favButton = document.getElementById('is_fav');
    favButton.classList.toggle('is_favorite');

    let buttonState = favButton.getAttribute('aria-pressed');
    let pressed = 'false';
    let labelText = 'Like!';

    if (buttonState === 'true') {
        pressed = 'false';
        labelText = 'Like!';
    } else {
        pressed = 'true';
        labelText = 'Remove Like!';
    }

    favButton.setAttribute('aria-pressed', pressed);
    favButton.setAttribute('aria-label', labelText);
    favButton.innerHTML = labelText;

    const id = getParameterByName('id');
    DBHelper.sendFavourite(id, pressed);
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillFavouritesHTML = (is_favorite) => {
    let favButton = document.getElementById('is_fav');
    let pressed = '';
    let labelText = '';

    if (is_favorite === 'true' || is_favorite === true) {
        pressed = 'true';
        labelText = 'Remove Like!';
        favButton.classList.add('is_favorite');
    } else {
        pressed = 'false';
        labelText = 'Like!';
        favButton.classList.remove('is_favorite');
    }

    favButton.setAttribute('aria-pressed', pressed);
    favButton.setAttribute('aria-label', labelText);
    favButton.innerHTML = labelText;
}

/**
 * Init
 */
(() => {
    console.log('rentaurant Init')
    fetchRestaurantFromURL()
        .then((restaurant) => {
            fillBreadcrumb();
            let form = document.getElementById('post-review-form');
            form.addEventListener('submit', function(ev) {
                ev.preventDefault();
                submitReview();
            })
            document.addEventListener("update_reviews_list", ev => {
                resetReviewsHTML()
                DBHelper.fetchReviewByRestaurant(restaurant.id)
                    .then((reviews) => {
                        fillReviewsHTML(reviews);
                        return resolve(self.restaurant);
                    })
            })
        })
        .catch((err) => {
            console.error('Init Error: ', err);
        });
})();