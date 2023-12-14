# Ariana Gewurz Rise interview take home assignment 

## This was my first time working with injecting scripts into divs in Javascript. I enjoyed learning about the process and deeloping this code. 

#### This simple weather widget allows you to inject weather information into your webpage. The widget retrieves data from the  JavaScript file which I uploaded to Git and injects it into a specified <div> on the page. As such, by opening the index1.html file, in a web browser, the following script tag will inject the targetDivId weatherWidget into the web page: <!-- <script src= "https://arg224.github.io/Rise/weatherWidget.js" targetDivId="weatherWidget" ></script> --> 

#### This program can be run both locally and not. To run locally open a terminal and create a server by typing: npx live-server and clicking into index1. 

#### The testCase file contains a function I used to test the injection of this widget into the body of any webpage. 

##### The weatherWidget.js file contains the meat and logic of the code. It is the target div that will be injected based on the script in index1.html. Some key things to note in this program: 

##### I invoked two free open souce API platforms - open-meteo for the weather content and API-ninjas (API-ninjas allowes for up to 10,000 calls per month for free. There shouldn't be an issue with running out but if there are, please let me know). The reason I needed to use API-ninjas as well was due to the requirements to include capabilities of both city name and lat/lng. The open-meteo program only takes in lat/lng as parameters and does not return a city name. I therefore used API-ninjas to geocode the result if a user submits a city name and send the lat/lng to the open-meteo API for usage. 

#### When submitting lat/lng the format must be lat,lng with no spaces between.

#### The weather codes at the top correspond to the weathe codes given by open-meteo. For times sake I used the same photo for any form of rain or snow although in a real world project, the photo would differ based on the severity of the storm. 
