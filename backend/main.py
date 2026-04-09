from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import router
from individual_routes import router as individual_router
from course_routes import router as course_router

load_dotenv()

app = FastAPI(title="JobPath Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(individual_router)
app.include_router(course_router)

@app.get("/")
def read_root():
    return {"status": "JobPath Intelligence API is running"}
