from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="medicall_app")
location = geolocator.geocode("Dharan, Nepal")

print(location.latitude, location.longitude)
