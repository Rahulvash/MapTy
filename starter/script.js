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

let mymap, mapEvent;

//my addition
const mapid = document.querySelector('#mapid');


const displayWorkout = (currentDate, currentMonth) => {

    //console.log("display called");

    let inputDistanceValue = inputDistance.value;
    let inputDurationValue = inputDuration.value;
    let inputCadenceValue = inputCadence.value;
    let inputElevationValue = inputElevation.value;
    let speedValueCycling = Math.round(((inputDistanceValue / inputDurationValue) * 60));
    let speedValueRunning = Math.round((inputDurationValue / inputDistanceValue) * 10) / 10;
    let randomId = Math.floor(Math.random() * 10000000000);
    randomId = randomId.toString();

    //console.log("inputDistanceValue", inputDistanceValue);
    //console.log("inputDurationValue", inputDurationValue);
    //console.log("speedValueRunning", speedValueRunning);

    if (inputType.value === 'Running') {
        const html = `<li class="workout workout--running" data-id=${randomId}>
            <h2 class="workout__title">Running on ${currentMonth} ${currentDate}</h2>
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
            <span class="workout__value">${speedValueRunning}</span>
            <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${inputCadenceValue}</span>
            <span class="workout__unit">spm</span>
            </div>
        </li>`;
        form.classList.add('hidden');
        form.parentNode.insertAdjacentHTML('beforeend', html);



    }
    else if (inputType.value === 'Cycling') {
        const html = `<li class="workout workout--cycling" data-id="1234567891">
        <h2 class="workout__title">Cycling on ${currentMonth} ${currentDate}</h2>
        <div class="workout__details">
          <span class="workout__icon">🚴‍♀️</span>
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
          <span class="workout__value">${speedValueCycling}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${inputElevationValue}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>`;
        form.classList.add('hidden');
        form.parentNode.insertAdjacentHTML('beforeend', html);
    }
}



inputType.addEventListener('change', (e) => {
    // console.log("value is changed");
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
        mymap = L.map('mapid').setView(coords, 13);

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

            //  console.log('on mapclicked called');

            mapEvent = e;
            // console.log("mapEvent",mapEvent);

            //console.log(value);

            form.classList.remove('hidden');
            inputDistance.focus();
        }

        mymap.on('click', onMapClick);

    }, (accesDenied) => {
        //console.log(accesDenied);
        alert(accesDenied.message);
    })
}


const myClick = () => {
    if (containerWorkouts) {
        console.log("event clicked");
        //alert('data-id is',containerWorkouts.getAttribute('data-id'));
        //containerWorkouts.lastChild.getAttribute('data-id')
        console.log(containerWorkouts);
        console.log(containerWorkouts.childNodes);
        const listItem = containerWorkouts.children[1];
        console.log(listItem);
        containerWorkouts.removeEventListener('click', myClick);
    }
}

containerWorkouts.addEventListener('click', myClick);


form.addEventListener('submit', (e) => {
    e.preventDefault();
    let { lat } = mapEvent.latlng;
    let { lng } = mapEvent.latlng;

    let cor = [lat, lng];
    // console.log("on submit called");

    //console.log("form submit");
    var marker = L.marker(cor).addTo(mymap);
    //console.log("inputType.values",inputType.values)

    // var value = selectedValue();
    let value = inputType.value;

    let date = new Date();
    // console.log("valeu of type",value);
    let currentDate = date.getDate();
    let currentMonthValue = date.getMonth();
    let currentMonth = months[currentMonthValue];

    marker.bindPopup(L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${value}-popup`
    }))
        .setPopupContent(`<span>${value} on ${currentDate} ${currentMonth}</span>`)
        .openPopup();

    //`<span>${value} on ${currentDate} ${currentMonth}</span>`
    displayWorkout(currentDate, currentMonth);

    //setting the values to null
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
})


