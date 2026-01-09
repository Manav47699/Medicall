Before running make sure to open 4 terminals and run these commands
```
npm run dev #to launch the nextjs server which is used for frontend
uvicorn main:app --reload --port 8080 #to launch the FastAPI server. this mainly is used for ollama's generated answer fetching.
python3 manage.py runserver # to launch django and restframework server which acts as the main backend
stripe listen --forward-to localhost:8000/stripe/webhook/  #It starts Stripe’s webhook listener and forwards any test webhook events to your local Django server at localhost:8000/stripe/webhook/ which we have setup in backend/doctors/urls.py
```



# integrating stripe test-mode in your webapp along with stripe webhook for payment conformation for any backend action after the payment
## here is the work flow in my Medicall project (github repo-> https://github.com/Manav47699/Medicall.git)
1️⃣ User selects doctor
2️⃣ User fills appointment form
3️⃣ Backend creates Appointment (unpaid)
4️⃣ Backend creates Stripe Checkout Session
5️⃣ User pays on Stripe-hosted page
6️⃣ Stripe confirms payment
7️⃣ Stripe sends webhook to backend (our webhook -> /doctors/stripe/webhook/)
8️⃣ Backend verifies Stripe signature
9️⃣ Backend sends email to doctor
1️⃣0️⃣ Backend marks appointment as paid
1️⃣1️⃣ Frontend shows success page

------------------------------------------------------------------------------------------------------------
First we will see how to integrate stripe payments in your webapp
------------------------------------------------------------------------------------------------------------
# Step 1: get stripe API keys.
- stripe mainly provides 2 API keys, a publishable and a secret key. Here are the steps to get it.
- Go to https://dashboard.stripe.com
- Log in or create an account
- Turn Test mode ON (top-right toggle)
- Navigate to or just search "developers" in the search bar. Then go to "API Keys"
- There you will see your Publishable key and secret key

# Step 2: Step up stripe API keys in your backend (⚠️It is always better to make a .env file that stores all your API keys and tokens and adding that .env file to .gitignore file instead of adding the API keys directly to settings.py)
- install the stripe python wrapper.
```
pip install stripe
```
- then you can use the library in your views.py like this
```
import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY
```
---------------------------------------------------------------------------------------------------------------------
Now using stripe web-hooks. Using this, stripe will let our backend know when the payment is approved. 
--------------------------------------------------------------------------------------------------------------------
# WEB-HOOKS: 
