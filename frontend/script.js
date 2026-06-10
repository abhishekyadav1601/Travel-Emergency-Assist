// =======================
// OPTION BUTTON CLICK
// =======================

const options = document.querySelectorAll(".option");

options.forEach(button => {
    button.addEventListener("click", function () {

        const type = this.innerText;

        alert("You selected: " + type);

        handleEmergency(type);
    });
});


// =======================
// DARK MODE
// =======================

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}


// =======================
// SOS CALL
// =======================

function callEmergency() {

    alert("🚨 Emergency Help Activated!");

    window.location.href = "tel:112";
}


// =======================
// GET CURRENT LOCATION
// =======================

function getCurrentLocation(successCallback) {

    if (!navigator.geolocation) {
        alert("Geolocation not supported ❌");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            successCallback(lat, lon);
        },

        () => {
            alert("Location permission denied ❌");
        }

    );
}


// =======================
// MAIN EMERGENCY FEATURE
// =======================

function handleEmergency(type) {

    getCurrentLocation(async (lat, lon) => {

        try {

            const response =
                await fetch(
                    "https://travel-emergency-assist.onrender.com/emergency",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            type,
                            latitude: lat,
                            longitude: lon
                        })
                    }
                );

            const data =
                await response.json();

            console.log("Saved:", data);

            alert(
                `✅ ${type} request saved successfully`
            );

            openGoogleMap(type, lat, lon);

        } catch (error) {

            console.log(error);

            alert(
                "❌ Server not connected"
            );
        }
    });
}


// =======================
// GOOGLE MAP
// =======================

function openGoogleMap(place, lat, lon) {

    const url =
        `https://www.google.com/maps/search/${place}/@${lat},${lon},15z`;

    window.open(url, "_blank");
}


// =======================
// OPEN NEARBY
// =======================

function openNearby(place) {

    getCurrentLocation((lat, lon) => {

        openGoogleMap(
            place,
            lat,
            lon
        );
    });
}


// =======================
// LOADER
// =======================

window.onload = function () {

    const loader =
        document.getElementById(
            "loader"
        );

    if (loader) {
        loader.style.display =
            "none";
    }
};


// =======================
// SCROLL ANIMATION
// =======================

window.addEventListener(
    "scroll",

    function () {

        const reveals =
            document.querySelectorAll(
                ".reveal"
            );

        reveals.forEach(el => {

            const windowHeight =
                window.innerHeight;

            const elementTop =
                el.getBoundingClientRect().top;

            if (
                elementTop <
                windowHeight - 100
            ) {

                el.classList.add(
                    "active"
                );

            } else {

                el.classList.remove(
                    "active"
                );
            }
        });
    }
);