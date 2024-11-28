To make the whole thing dynamic:

1. Use @media for different screen sizes
2. In Javascript set responsive property to true
3. Chart Container needs dynamic height
4. Use flexbox
5. Use em and rem so it adapts with screen size

API for weather
https://aqicn.org//here/
https://openweathermap.org/api/air-pollution
https://developers.google.com/maps/documentation/air-quality/overview?hl=de

Next step:

- Test openweathermap api and write Javascript function to output the data
- Write a function to display this data as a graph
-

Tested several options for displaying the data

- Opening a new html page when clicking on a sidebar icon -> too slow and to many API calls
- Updating the boxes and graphs dynamically when clicking on a sidebar icon -> works but needs caching to guarantee a smooth experience
- Loading everything at the start and clicking on the sidebar icon just scrolls down to the specified section
