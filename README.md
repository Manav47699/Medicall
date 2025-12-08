# Medicall devlog
# 2025 nov 18, day 1: setup django, restframework and nextjs. Also designed some pages such are app/page.jsx
-> setup django (backend) and nextJS(frontend)

# 2025 nov 19 day 2: tried implementing google authentication but failed. But I have created a google OAuth client. Will try again tommrow, just a differnet approch I guess :))
-> Initially tried django-allauth. 
-> then later, experimented with nextauth

# 2025, nov 21, day 3: tried to build a sign in page with django as backend and nextjs as the frontend
-> Created a google client. But is turn out 3rd party authentication is superrr messy. SO I WILL TRY THAT AT LAST

# 2025, nov 22, day 4: build a /posts and /global_posts page
-> each post has a "scope" field accociated with it.
-> /posts shows all the posts uploaded by the users
-> /global_posts shows only the posts which were uploaded as scope=global by the user

# 2025, nov 23, day 5: added /groups and /doctors pages. Also stared learning stripe integration in django
-> /groups shows all the groups
-> /doctors shows all the doctors

# 2025, nov 24, day 6, added /login, /signup, /posts/[postId]/comments and upvotes feature
-> /login allows user to login. NOTE: THIS FEATURE IS NOT WORKING AS IT SAYS INVALID CREDENTIALS
-> /signup allows users to create a new id
-> /commments fetches the comments for individual posts, diplaying them also allowing user to create(POST) new comments
-> upvotes is allowed once for evey user

# 2025, nov 25, day 7: added /posts/group/[groupId]. also added posts and group creating forms in /posts and /groups. Also added upvotes and comments in the posts
-> now users can create their own post form /post
-> now users can also create their own groups or join from /groups
-> now user can upvote and comment on posts

# 2025, nov 26, day day 8: tried some frontend designs.
-> added the front end and fixed the fetching issue in /posts page

# 2025, nov 29, day 9: added payment with stripe feature. Dont know how but is seems like it is working atleast.
-> will try to add the email sending feature tommorow.

# dec 4, day 10: added a chatbot to Medicall at /chat route with Ollama(qwen, 1.5B model)
-> create the folder structure and installed the dependecies.
medicall/
├── backend/
   ├── rag/                       # RAG + vector DB related files
   │   ├── vectorstore/            #word embeddings (inside .gitignore)
   │   ├── vector.py              # Your Chroma + embeddings logic
   │   └── data/
   │       └── instructions_one.csv
   └──main.py                 #main file that return the chatbot response


# dec 5 ,day 11: added rag to the Mediall chatbot with Ollama(mxbai-embed-large).
-> added the instruction_one.csv file and made the rag work some how.

# dec 8, day 12: added speech feature to the chatbot (whisper-tiny) and fixed the virtual env that was corrupted.
-> reinstalled venv and all the dependencies to make it work again


