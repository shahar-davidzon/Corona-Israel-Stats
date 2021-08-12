// Check if the new app version is undefined or null or old version and update the local storage

(function () {
  if (typeof localStorage.version_app === 'undefined' || localStorage.version_app === null || localStorage.version_app != 'ver13') {
    localStorage.setItem('darkMode', null);
    localStorage.clear();
    localStorage.setItem('version_app', 'ver13');
  }
})();

/// GET THE CURRENT DATE ///

const fullDate = () => {
  let now, day, months, year;
  now = new Date();

  day = now.getDate();
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  year = now.getFullYear();
  now = `Update daily: &nbsp${months[now.getMonth()]} ${day},&nbsp ${year}`;

  document.getElementById('date').innerHTML = now;

}
fullDate();

/// ASYNC AWAIT FUNCTION WITH API REQUEST TO GET AND SHOW COVID-19 DATA ///

async function getData() {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  

   try {
    const result = await fetch("https://api.covid19api.com/live/country/israel/status/confirmed", requestOptions);

    const data = await result.json();
    

    var totalCases;
    var totalDeaths;
    var totalRecoveries;
    var totalActive;
    var newCases;
    var newDeaths;
    var newRecoveries;
    var newActive;;

    for (var i = 1; i <= data.length -1; i++) {
        totalCases = data[i].Confirmed;
        totalDeaths = data[i].Deaths;
        totalRecoveries = data[i].Recovered;
        totalActive = data[i].Active;
        newCases = data[i].Confirmed - data[ i - 1 ].Confirmed;
        newDeaths = data[i].Deaths - data[ i - 1 ].Deaths;
        newRecoveries  = data[i].Recovered - data[ i - 1 ].Recovered;
        newActive = newCases - (newRecoveries + newDeaths);
      }

    const deathRate = totalDeaths / totalCases * 100;
    const recoveriesRate = totalRecoveries / totalCases * 100;
    const casesRate = totalCases / 9200000 * 100;
    const activeRate = totalActive / 9200000 * 100;

    

    document.querySelector('.cases').innerHTML = totalCases;
    document.querySelector('.deaths').innerHTML = totalDeaths;
    totalRecoveries === 0 ? document.querySelector('.recoveries').innerHTML = 'N/A' : document.querySelector('.recoveries').innerHTML = totalRecoveries;
    totalActive > 300000 ? document.querySelector('.active').innerHTML = 'N/A' : document.querySelector('.active').innerHTML = totalActive;

    document.querySelector('.cases-1').innerHTML = newCases;
    document.querySelector('.deaths-1').innerHTML = newDeaths;
    newRecoveries === 0 ? document.querySelector('.recoveries-1').innerHTML = 'N/A' : document.querySelector('.recoveries-1').innerHTML = newRecoveries;
    newRecoveries === 0 ? document.querySelector('.active-1').innerHTML = 'N/A' : document.querySelector('.active-1').innerHTML = newActive;

    document.querySelector('.cases-3').innerHTML = casesRate.toFixed(2)+'%';
    document.querySelector('.deaths-3').innerHTML = deathRate.toFixed(2)+'%';
    totalRecoveries === 0 ? document.querySelector('.recoveries-3').innerHTML = 'N/A' : document.querySelector('.recoveries-3').innerHTML = recoveriesRate.toFixed(2)+'%';
    totalActive > 300000 ? document.querySelector('.active-3').innerHTML = 'N/A' : document.querySelector('.active-3').innerHTML = activeRate.toFixed(3)+'%';

    if( newCases === 0 && newDeaths === 0 && newRecoveries === 0 ) {
      document.querySelector('.cases-1').innerHTML = 'N/A';
      document.querySelector('.deaths-1').innerHTML = 'N/A';
      document.querySelector('.recoveries-1').innerHTML = 'N/A';
      document.querySelector('.active-1').innerHTML = 'N/A';

    }
    

  } catch (error) {
    alert('Data is unavailable right now \nPlease try again in a few minutes')
  }
  // API request for - "By Country Live" - CASES
  const result2 = await fetch("https://api.covid19api.com/country/israel/status/confirmed/live", requestOptions);
  const data2 = await result2.json();
  
   

  // API request for - "By Country Live" - DEATHS
  const result3 = await fetch("https://api.covid19api.com/country/israel/status/deaths/live", requestOptions);
  const data3 = await result3.json();
  

  // API request for - "By Country Live" - RECOVERIES
  const result4 = await fetch("https://api.covid19api.com/country/israel/status/recovered/live", requestOptions);
  const data4 = await result4.json();
  




  (function (data2, window) {

    var dataPoints = [];

    // if API cases is 0 = put the last element instead

    for (var i = 0; i <= data2.length - 1; i++) {
      if (data2[i].Cases === 0 && i > 30) {

        data2[i].Cases = data2[i - 1].Cases;
        
      }

      dataPoints.push({ x: new Date(data2[i].Date), y: Number(data2[i].Cases) });
    }

    var chart1 = new CanvasJS.Chart("chartContainer1",
      {
        exportFileName: "Total Cases",
        exportEnabled: true,
        animationEnabled: true,
        animationDuration: 3000,
        theme: "light2",
        title: {


          padding: 12,
          margin: 3.5,
          fontSize: 26,
          fontFamily: "arial",
          fontStyle: "italic",
          text: "Total Cases"
        },
        toolTip: {
          content: "<span style='\"' font-size: 10px;'\"'>{x}</span> <br/>{name}: {y}",
          fontFamily: "arial",
          fontWeight: "bold",
          cornerRadius: 6,
          animationEnabled: true
        },
        axisY: {
          title: "Total Coronavirus Cases",
          margin: 20,
          labelFormatter: function (e) {
            if (e.value === 0) {
              return e.value;
            }
            else {
              return CanvasJS.formatNumber(e.value, "#,##0,.k");
            }
          },
          stripLines: [{
            value: 50,
            color: "transparent",
            label: "Dummy Long Label",
            labelMaxWidth: 50,
            labelPlacement: "outside",
            labelBackgroundColor: "transparent",
            labelFontColor: "transparent",
          }]
         
        },
        axisX: {
          labelAngle: -15
        },
        legend: {
          fontFamily: "arial",
          fontWeight: "bolder",
        },
        data: [
          {
            legendMarkerType: "circle",
            markerBorderColor: "#e6f3ff",
            markerSize: 5,
            lineThickness: 5,
            markerColor: "#2196F3",
            lineColor: "#2196F3",
            color: "#2196F3",
            showInLegend: true,
            legendText: "Cases",
            type: "splineArea",
            fillOpacity: .6,
            name: "Cases",
            dataPoints:
              dataPoints

          }
        ]
      });



    setTimeout(() => {
      chart1.render();
    }, 500);

    let darkMode1 = localStorage.getItem('darkMode1');


    const darkTheme = () => {
      chart1.set('theme', 'dark2');
      localStorage.setItem('darkMode1', 'enabled');
      chart1.toolTip.set("fontColor", "white");
      chart1.toolTip.set("backgroundColor", "black");
      chart1.toolTip.set("borderColor", "black");

    }
    const lightTheme = () => {
      chart1.set('theme', 'light2');
      localStorage.setItem('darkMode1', null);
      chart1.toolTip.set("fontColor", "black");
      chart1.toolTip.set("backgroundColor", "white");
      chart1.toolTip.set("borderColor", "#2196F3");
    }

    if (darkMode1 === 'enabled') {
      darkTheme();

    }

    // When someone clicks the button
    document.getElementById('toggle').addEventListener('click', () => {
      // get their darkMode setting
      darkMode1 = localStorage.getItem('darkMode1');

      // if it not current enabled, enable it
      if (darkMode1 !== 'enabled') {
        darkTheme();

        // if it has been enabled, turn it off  
      } else {
        lightTheme();

      }


    });




  })(data2, window);

  (function (data3) {

    var dataPoints = [];


    // if API deaths cases is 0 = put the last element instead

    for (var i = 0; i <= data3.length - 1; i++) {
      if (data3[i].Cases === 0 && i > 1) {

        data3[i].Cases = data3[i - 1].Cases;
         
      }

      dataPoints.push({ x: new Date(data3[i].Date), y: Number(data3[i].Cases) });
      
    }



    var chart2 = new CanvasJS.Chart("chartContainer2",
      {
        exportFileName: "Total Deaths",
        exportEnabled: true,
        animationEnabled: true,
        animationDuration: 3000,
        theme: "light2",
        title: {

          padding: 12,
          margin: 3.5,
          fontSize: 26,
          fontFamily: "arial",
          fontStyle: "italic",
          text: "Total Deaths"
        },
        toolTip: {
          content: "<span style='\"' font-size: 10px;'\"'>{x}</span> <br/>{name}: {y}",
          fontFamily: "arial",
          fontWeight: "bold",
          cornerRadius: 6,
          animationEnabled: true
        },
        legend: {
          fontFamily: "arial",
          fontWeight: "bolder",
        },
        axisX: {
          labelAngle: -15
        },
        axisY: {
          title: "Total Coronavirus Deaths",
          margin: 20,
          stripLines: [{
            value: 50,
            color: "transparent",
            label: "Dummy Long Label",
            labelMaxWidth: 50,
            labelPlacement: "outside",
            labelBackgroundColor: "transparent",
            labelFontColor: "transparent",
          }],
        },
        data: [
          {
            legendMarkerType: "circle",
            markerBorderColor: "#e6f3ff",
            markerSize: 5,
            lineThickness: 5,
            markerColor: "#2196F3",
            lineColor: "#2196F3",
            color: "#2196F3",
            showInLegend: true,
            legendText: "Deaths",
            type: "splineArea",
            fillOpacity: .6,
            name: "Deaths",
            dataPoints: dataPoints

          }
        ]
      });





    setTimeout(() => {

      chart2.render();
    }, 500);



    let darkMode2 = localStorage.getItem('darkMode2');

    const darkTheme = () => {
      chart2.set('theme', 'dark2');
      localStorage.setItem('darkMode2', 'enabled');
      chart2.toolTip.set("fontColor", "white");
      chart2.toolTip.set("backgroundColor", "black");
      chart2.toolTip.set("borderColor", "black");
    }
    const lightTheme = () => {
      chart2.set('theme', 'light2');
      localStorage.setItem('darkMode2', null);
      chart2.toolTip.set("fontColor", "black");
      chart2.toolTip.set("backgroundColor", "white");
      chart2.toolTip.set("borderColor", "#2196F3");
    }

    if (darkMode2 === 'enabled') {
      darkTheme();
    }

    // When someone clicks the button
    document.getElementById('toggle').addEventListener('click', () => {
      // get their darkMode setting
      darkMode2 = localStorage.getItem('darkMode2');

      // if it not current enabled, enable it
      if (darkMode2 !== 'enabled') {
        darkTheme();
        // if it has been enabled, turn it off  
      } else {
        lightTheme();
      }

    });




  })(data3);

  (function (data2, data3, data4) {

    var dataPoints = [];


    // if API deaths/recoveries cases is 0 = put the last element instead
    for (var i = 0; i <= data3.length - 1; i++) {
      if (data3[i].Cases === 0 && i > 60) {

        data3[i].Cases = data3[i - 1].Cases;
         
      }


      for (var i = 0; i <= data4.length - 1; i++) {
        if (data4[i].Cases === 0 && i > 40) {

          data4[i].Cases = data4[i - 1].Cases;
         
        }


        dataPoints.push({ x: new Date(data3[i].Date), y: Number(data2[i].Cases) - ((data3[i].Cases) + (data4[i].Cases)) });
        


      }
    }

    var chart3 = new CanvasJS.Chart("chartContainer3",
      {
        exportEnabled: true,
        exportFileName: "Active Cases",
        animationEnabled: true,
        animationDuration: 3000,
        theme: "light2",
        title: {
          padding: 12,
          margin: 3.5,
          fontSize: 26,
          fontFamily: "arial",
          fontStyle: "italic",
          text: "Active Cases",
        },
        toolTip: {
          content: "<span style='\"' font-size: 10px;'\"'>{x}</span> <br/>{name}: {y}",
          fontFamily: "arial",
          fontWeight: "bold",
          cornerRadius: 6,
          animationEnabled: true
        },
        legend: {
          fontFamily: "arial",
          fontWeight: "bolder",
        },
        axisX: {
          labelAngle: -15
        },
        axisY: {
          title: "Total Currently Infected",
          margin: 20,
          labelFormatter: function (e) {
            if (e.value === 0) {
              return e.value;
            }
            else {
              return CanvasJS.formatNumber(e.value, "#,##0,.k");
            }
          },
          stripLines: [{
            value: 50,
            color: "transparent",
            label: "Dummy Long Label",
            labelMaxWidth: 50,
            labelPlacement: "outside",
            labelBackgroundColor: "transparent",
            labelFontColor: "transparent",
          }],
        },

        data: [
          {
            markerBorderColor: "#e6f3ff",
            markerSize: 5,
            lineThickness: 5,
            markerColor: "#2196F3",
            legendMarkerType: "circle",
            color: "#2196F3",
            type: "splineArea",
            fillOpacity: .6,
            showInLegend: true,
            legendText: "Active",
            lineColor: "#2196F3",
            name: "Currently Infected",
            dataPoints: dataPoints
          }
        ]
      });




    setTimeout(() => {

      chart3.render();
    }, 500);
    let darkMode3 = localStorage.getItem('darkMode3');

    const darkTheme = () => {
      chart3.set('theme', 'dark2');
      localStorage.setItem('darkMode3', 'enabled');
      chart3.toolTip.set("fontColor", "white");
      chart3.toolTip.set("backgroundColor", "black");
      chart3.toolTip.set("borderColor", "black");
    }
    const lightTheme = () => {
      chart3.set('theme', 'light2');
      localStorage.setItem('darkMode3', null);
      chart3.toolTip.set("fontColor", "black");
      chart3.toolTip.set("backgroundColor", "white");
      chart3.toolTip.set("borderColor", "#2196F3");
    }

    if (darkMode3 === 'enabled') {
      darkTheme();
    }

    // When someone clicks the button
    document.getElementById('toggle').addEventListener('click', () => {
      // get their darkMode setting
      darkMode3 = localStorage.getItem('darkMode3');

      // if it not current enabled, enable it
      if (darkMode3 !== 'enabled') {
        darkTheme();
        // if it has been enabled, turn it off  
      } else {
        lightTheme();
      }

    });



  })(data2, data3, data4);

}

getData();

// DELAY 0.7S THE BODY FOR THE ASYNC AWAIT FUNCTION ////////

let myVar;

const showPage = () => {
  document.getElementById("body").style.display = "block";
}

((page) => {

  myVar = setTimeout(page, 700);
})(showPage);



// DARK MODE FEATURE /////

let darkMode = localStorage.getItem('darkMode');

const darkModeToggle = document.getElementById('toggle');

const enableDarkMode = () => {
  document.body.classList.add('dark-mode');

  const link = document.querySelector('.link');
  link.classList.add('link-dark');

  const title = document.querySelector('.main-text-wp');
  title.classList.add('head-dark');

  const column = document.querySelectorAll('.column');
  for (let i = 0; i < column.length; i++) {
    column[i].classList.add('dark-mode');
  }

  const head = document.querySelectorAll('.head');
  for (let i = 0; i < column.length; i++) {
    head[i].classList.add('head-dark');
  }


  localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
  // 1. Remove the class from the body
  document.body.classList.remove('dark-mode');

  const link = document.querySelector('.link');
  link.classList.remove('link-dark');

  const title = document.querySelector('.main-text-wp');
  title.classList.remove('head-dark');

  const column = document.querySelectorAll('.column');
  for (let i = 0; i < column.length; i++) {
    column[i].classList.remove('dark-mode');
  }

  const head = document.querySelectorAll('.head');
  for (let i = 0; i < column.length; i++) {
    head[i].classList.remove('head-dark');
  }
  // 2. Update darkMode in localStorage 
  localStorage.setItem('darkMode', null);
}

if (darkMode === 'enabled') {
  enableDarkMode();
}

// When someone clicks the button
darkModeToggle.addEventListener('click', () => {
  // get their darkMode setting
  darkMode = localStorage.getItem('darkMode');

  // if it not current enabled, enable it
  if (darkMode !== 'enabled') {
    enableDarkMode();
    // if it has been enabled, turn it off  
  } else {
    disableDarkMode();
  }

});


