


// element..................


const weatherForecastEl=document.querySelector('#weather-forcast');
const currentTempEl=document.getElementById('current-temp');




// classes..................


class AjaxWeather{
    constructor(){
        this.apiKey = "11b390ce12d164cdbd0b639892823704";
        
    }
    async getWeather(city){
        const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

        

        const weatherData=await fetch(url);
        
        
        const weather=await weatherData.json();
        
        
        return weather;
    }
}



// DISPLAY
class Display{
    constructor(){
        this.results=document.querySelector('.start');
        this.cityName=document.getElementById('time-zone');
        this.countryName=document.getElementById('country');
        this.humidity=document.getElementById('humidity');
        this.speed=document.getElementById('speed');
        this.temp1=document.getElementById('temp1');
        this.rise=document.getElementById('rise');
        this.set=document.getElementById('set');


        // bottom part.........................................



    }
    showWeather(data){

        console.log(data);

        const dataCopy=data;

        const {name,sys:{country},main:{humidity,temp},sys:{sunrise,sunset},wind:{speed},coord:{lon,lat}}=data;

        

        this.results.classList.remove('start');
        this.cityName.innerHTML = `<span>${name}</span>`;
        if(country!==undefined){
        this.countryName.innerHTML = `<span>${country}</span>`;
        }else{
            this.countryName.innerHTML = `<span></span>`;
        }
        this.humidity.innerHTML = `<span>${humidity}</span>`;
        this.speed.innerHTML = `<span>${speed}</span>`;
        this.temp1.innerHTML = `<span>${temp}</span>`;
        this.rise.innerHTML = `<span>${window.moment(sunrise*1000).format('h:mm A')}</span>`;
        this.set.innerHTML = `<span>${window.moment(sunset*1000).format('h:mm A')}</span>`;

        // bottom part..................................

        const longi=lon;
        const lati=lat;

        const apikeymulti="96ce5e4b135cc322b31b26270f229dbc";

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lati}&lon=${longi}&exclude=hourly,minutely&appid=${apikeymulti}&units=metric`).then(res=>res.json()).then(data1=>{
            console.log(data1);
            showWeatherData(data1);
        })

        // const {timezone}=data;
        // console.log(timezone);

        // TimeZone...........................

        const apiTime="V2QRZHDPTXAU";


        fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${apiTime}&format=json&by=position&lat=${lati}&lng=${longi}`).then(tim=>tim.json()).then(data2=>{
            console.log(data2);
            showTime(data2);
        })

        // fetch(`https://cors-anywhere.herokuapp.com/https://api.timezonedb.com/v2.1/get-time-zone?key=${apiTime}&format=json&by=position&lat=${lati}&lng=${longi}`).then(tim=>tim.json()).then(data2=>{
        //     console.log(data2);
        //     showTime(data2);
        // })

        

    }
}
// end of display

(function(){
    const form=document.getElementById('wheatherForm');
    const cityInput=document.getElementById('cityInput');
    const feedback=document.querySelector('.feedback');

    // class calls
    const ajax=new  AjaxWeather();
    const display=new Display();

    form.addEventListener('submit',event=>{
        event.preventDefault();
        const city=cityInput.value;

        if(city.length===0){
            showFeedback(`city value cannot be empty`);
        }else{
            ajax.getWeather(city).then(data=>{
                if(data.message==='city not found'){
                    showFeedback(`city with such name not found`);
                }else{
                    display.showWeather(data);
                }
            });
        }
    });

    function showFeedback(text){
        // console.log(text);
        feedback.classList.add('showItem');
        feedback.innerHTML = `<p>${text}</p>`;

        setTimeout(()=>{
            feedback.classList.remove("showItem");
        },3000)
    }
})();


//bottom part.........................

function showWeatherData(data1){
    var otherDayForcast='';
    // let firstDayForcast='';
    const date=document.getElementById('date');

    data1.daily.forEach((day,idx)=>{
        if(idx==0){

            currentTempEl.innerHTML=`
          <img
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
            alt="Weather-icon"
            class="w-icon"
          />
          <div class="other">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <div class="temp">Night - ${day.temp.night}&#176;C</div>
            <div class="temp">Day - ${day.temp.night}&#176;C</div>
          </div>
            `;

            date.innerHTML=`<span>${window.moment(day.dt*1000).format('dddd')}</span>`;

        }else{
            otherDayForcast+=`
            <div class="weather-forcast" id="weather-forcast">
                <div class="weather-forcast-item">
                        <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                        <img
                        src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                        alt="Weather-icon"
                        class="w-icon"
                        />
                        <div class="temp">Night - ${day.temp.night}&#176;C
                        </div>
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
                </div>
            </div>`

        
        }
    })
    // currentTempEl.innerHTML=firstDayForcast;
    weatherForecastEl.innerHTML=otherDayForcast;
    console.log(window.moment(19800).format('h:mm A'));
    
}


// TimeZone....................................................

function showTime(data2){

    const time=document.getElementById('time');
    const ampm=document.getElementById('am-pm');
    const date=document.getElementById('date');

    const {gmtoffset,formatted}=data2;

    // time.innerHTML=`<span>${window.moment(gmtoffset).format('HH:mm a')}</span>`;

    time.innerHTML=`<span>${window.moment(formatted).format('h:mm A')}</span>`;

    // console.log(window.moment(19800).format('h:mm A'));
}