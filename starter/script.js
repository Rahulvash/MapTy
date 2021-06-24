'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


//my addition
const mapid = document.querySelector('#mapid');


const displayWorkout = () => {

    let inputDistanceValue = inputDistance.value;
    let inputDurationValue = inputDuration.value;
    let inputCadenceValue = inputCadence.value;
    let speedValue = Math.round((inputCadenceValue / inputDurationValue));

    if (inputType.value === 'Running') {
        const html = `<li class="workout workout--running" data-id="1234567890">
            <h2 class="workout__title">Running on April 14</h2>
            <div class="workout__details">
            <span class="workout__icon">🏃‍♂️</span>
            <span class="workout__value">${inputDistanceValue}</span>
            <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${inputDurationValue}</span>
            <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${speedValue}</span>
            <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${inputCadenceValue}</span>
            <span class="workout__unit">spm</span>
            </div>
        </li>`;
        form.classList.add('hidden');
        form.parentNode.insertAdjacentHTML( 'beforeend', html );

    }
    else if(inputType.value === 'Cycling'){
        const html = `<li class="workout workout--cycling" data-id="1234567891">
        <h2 class="workout__title">Cycling on April 5</h2>
        <div class="workout__details">
          <span class="workout__icon">🚴‍♀️</span>
          <span class="workout__value">27</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">95</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">16</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">223</span>
          <span class="workout__unit">m</span>
        </div>
      </li>`
    }
}



inputType.addEventListener('change', (e) => {
    console.log("value is changed");
    if (inputType.value === 'Cycling') {
        inputCadence.parentNode.classList.toggle('form__row--hidden');
        inputElevation.parentNode.classList.toggle('form__row--hidden');
    }
    if (inputType.value === 'Running') {
        inputCadence.parentNode.classList.toggle('form__row--hidden');
        inputElevation.parentNode.classList.toggle('form__row--hidden')
    }
})



if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);

        const { latitude } = position.coords;
        const { longitude } = position.coords;

        //console.log(latitude, longitude);
        let coords = [latitude, longitude];
        var mymap = L.map('mapid').setView(coords, 13);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoicmFodWwwNyIsImEiOiJja3FhNnBnMWIwOXJ0Mm9vdnFueTczY2w3In0.HWmcqKJyEiQwTmWP_Ae3xw'
        }).addTo(mymap);



        // mapid.addEventListener('click',(e)=>{
        //     console.log(e);
        //     var marker = L.marker(coords).addTo(mymap);
        // });

        var popup = L.popup();

        function onMapClick(e) {

            let mapEvent = e;
            // console.log("mapEvent",mapEvent);
            let { lat } = mapEvent.latlng;
            let { lng } = mapEvent.latlng;

            let cor = [lat, lng];
            //console.log(value);

            form.classList.toggle('hidden');
            inputDistance.focus();

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // console.log("form submit");
                var marker = L.marker(cor).addTo(mymap);
                //console.log("inputType.values",inputType.values)

                // var value = selectedValue();
                let value = inputType.value;
                let date = new Date();

                let currentDate = date.getDate();
                let currentMonthValue = date.getMonth();
                let currentMonth = months[currentMonthValue];
                marker.bindPopup(L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup '
                }))
                    .setPopupContent(`<span>${value} on ${currentDate} ${currentMonth}</span>`)
                    .openPopup();

                //`<span>${value} on ${currentDate} ${currentMonth}</span>`
                displayWorkout();
            })

        }

        mymap.on('click', onMapClick);

    }, (accesDenied) => {
        //console.log(accesDenied);
        alert(accesDenied.message);
    })
}


