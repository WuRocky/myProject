let map;
let currentPosition;
let selectedRestaurant;
let marker;
let directionsService;
let directionsRenderer;
let infoWindow;

//  Cannot read properties of null;
const restaurantList =
    JSON.parse(localStorage.getItem("restaurantList")) || [];
restaurantList.forEach(function (restaurant) {
    document.getElementById("restaurant-list").innerHTML += `
    <li class="list-group-item">
        ${restaurant.name}
    <button class="btn-close float-end remove"></button>
        </li>
    `;
});

//map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 23.553118, lng: 121.0211024 },
        zoom: 7,
    });

    navigator.geolocation.getCurrentPosition(function (position) {
        currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        map.setCenter(currentPosition);
        map.setZoom(16);

        const autocomplete = new google.maps.places.Autocomplete(
            document.getElementById("search-input"),
            {
                types: ["restaurant"],
                bounds: {
                    east: currentPosition.lng + 0.001,
                    west: currentPosition.lng - 0.001,
                    south: currentPosition.lat - 0.001,
                    north: currentPosition.lat + 0.001,
                },
                strictBounds: false,
            }
        );

        autocomplete.addListener("place_changed", function () {
            const place = autocomplete.getPlace();

            selectedRestaurant = {
                location: place.geometry.location,
                placeId: place.place_id,
                name: place.name,
                address: place.formatted_address,
                phoneNumber: place.formatted_phone_number,
                rating: place.rating,
            };

            map.setCenter(selectedRestaurant.location);

            if (!marker) {
                marker = new google.maps.Marker({
                    map: map,
                });
            }

            marker.setPosition(selectedRestaurant.location);

            if (!directionsService) {
                directionsService = new google.maps.DirectionsService();
            }

            if (!directionsRenderer) {
                directionsRenderer = new google.maps.DirectionsRenderer({
                    map: map,
                });
            }

            directionsRenderer.set("directions", null);

            directionsService.route(
                {
                    origin: new google.maps.LatLng(
                        currentPosition.lat,
                        currentPosition.lng
                    ),
                    destination: {
                        placeId: selectedRestaurant.placeId,
                    },
                    travelMode: "WALKING",
                },
                function (response, status) {
                    if (status === "OK") {
                        directionsRenderer.setDirections(response);

                        if (!infoWindow) {
                            infoWindow = new google.maps.InfoWindow();
                        }

                        infoWindow.setContent(
                            `
                            <h3>${selectedRestaurant.name}<h3>
                            <div>地址:${selectedRestaurant.address}</div>
                            <div>電話:${selectedRestaurant.phoneNumber}</div>
                            <div>評分:${selectedRestaurant.rating}</div>
                            <div>步行時間:${response.routes[0].legs[0].duration.text}</div>
                            `
                        );
                        infoWindow.open(map, marker);
                    }
                }
            );
        });
    });
}

document.getElementById("add").addEventListener("click", function () {
    document.getElementById("restaurant-list").innerHTML += `
        <li class="list-group-item">
            ${selectedRestaurant.name}
            <button class="btn-close float-end remove"></button>
        </li>
        `;
    //新增到我的最愛
    const restaurantList =
        JSON.parse(localStorage.getItem("restaurantList")) || [];

    const color = colors[restaurantList.length % 4];
    wheel.addSegment({
        fillStyle: color,
        text: selectedRestaurant.name,
        strokeStyle: "white",
    });
    wheel.draw();

    restaurantList.push(selectedRestaurant);
    localStorage.setItem("restaurantList", JSON.stringify(restaurantList));
});

document
    .getElementById("restaurant-list")
    .addEventListener("click", function (e) {
        if (e.target.classList.contains("remove")) {
            e.target.parentNode.remove();
            const restaurantName = e.target.parentNode.innerText.trim();

            //和我的最愛相同
            const restaurantList =
                JSON.parse(localStorage.getItem("restaurantList")) || [];

            const index = restaurantList.findIndex(function (restaurant) {
                return restaurant.name === restaurantName;
            });
            wheel.deleteSegment(index + 1);
            wheel.draw();

            const newRestaurantList = restaurantList.filter(function (
                restaurant
            ) {
                if (restaurant.name === restaurantName) return false;
                return true;
            });
            localStorage.setItem(
                "restaurantList",
                JSON.stringify(newRestaurantList)
            );
        }
    });

//color
const colors = ["#00FFFF", "#FAEBD7", "#F0F8FF", "#7FFFD4"];

const wheel = new Winwheel({
    numSegments: restaurantList.length,
    segments: restaurantList.map((restaurant, index) => {
        return {
            fillStyle: colors[index % 4],
            text: restaurant.name,
            strokeStyle: "white",
        };
    }),
    pins: true,
    animation: {
        type: "pinToStop",
        spins: 8,
        easing: "Power4.easeInOut",
        callbackFinished: function (segment) {
            document.getElementById("wheel").style.display = "none";
            wheel.rotationAngle = 0;
            wheel.draw();

            window.alert(segment.text);
            const restaurantList =
                JSON.parse(localStorage.getItem("restaurantList")) || [];
            selectedRestaurant = restaurantList.find(function (
                restaurant
            ) {
                return restaurant.name === segment.text;
            });
            map.setCenter(selectedRestaurant.location);

            if (!marker) {
                marker = new google.maps.Marker({
                    map: map,
                });
            }

            marker.setPosition(selectedRestaurant.location);

            if (!directionsService) {
                directionsService = new google.maps.DirectionsService();
            }

            if (!directionsRenderer) {
                directionsRenderer = new google.maps.DirectionsRenderer({
                    map: map,
                });
            }

            directionsRenderer.set("directions", null);

            directionsService.route(
                {
                    origin: new google.maps.LatLng(
                        currentPosition.lat,
                        currentPosition.lng
                    ),
                    destination: {
                        placeId: selectedRestaurant.placeId,
                    },
                    travelMode: "WALKING",
                },
                function (response, status) {
                    if (status === "OK") {
                        directionsRenderer.setDirections(response);

                        if (!infoWindow) {
                            infoWindow = new google.maps.InfoWindow();
                        }

                        infoWindow.setContent(
                            `
                        <h3>${selectedRestaurant.name}<h3>
                        <div>地址:${selectedRestaurant.address}</div>
                        <div>電話:${selectedRestaurant.phoneNumber}</div>
                        <div>評分:${selectedRestaurant.rating}</div>
                        <div>步行時間:${response.routes[0].legs[0].duration.text}</div>
                        `
                        );
                        infoWindow.open(map, marker);
                    }
                }
            );
        },
    },
});

document.getElementById("draw").addEventListener("click", function () {
    document.getElementById("wheel").style.display = "block";
    wheel.startAnimation();
});
