from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="medicall_app")
location = geolocator.geocode("Kathmandu, Nepal")

print(location.latitude, location.longitude)
