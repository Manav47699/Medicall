Before running make sure to open 4 terminals and run these commands
```
npm run dev #to launch the nextjs server which is used for frontend
uvicorn main:app --reload --port 8080 #to launch the FastAPI server. this mainly is used for ollama's generated answer fetching.
python3 manage.py runserver # to launch django and restframework server which acts as the main backend
stripe listen --forward-to localhost:8000/stripe/webhook/  #It starts Stripe’s webhook listener and forwards any test webhook events to your local Django server at localhost:8000/stripe/webhook/ which we have setup in backend/doctors/urls.py
```
