from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
import base64
import uuid
from datetime import datetime
import mimetypes

from models import BirthdayWish, CreateWishRequest, GenerateMessageRequest, GenerateMessageResponse, MediaFile
from ai_service import AIMessageGenerator

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize AI service
ai_service = AIMessageGenerator()

# Create the main app without a prefix
app = FastAPI(title="Birthday Wishes API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Birthday Wishes API is running! 🎂"}

# Generate AI birthday message
@api_router.post("/generate-message", response_model=GenerateMessageResponse)
async def generate_message(request: GenerateMessageRequest):
    """Generate a personalized birthday message using AI"""
    try:
        message = ai_service.generate_birthday_message(
            person_name=request.person_name,
            relationship=request.relationship
        )
        
        return GenerateMessageResponse(
            message=message,
            person_name=request.person_name,
            relationship=request.relationship
        )
    except Exception as e:
        logging.error(f"Error generating message: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate message")

# Upload multiple files
@api_router.post("/upload-files")
async def upload_files(files: List[UploadFile] = File(...)):
    """Upload multiple photos/videos and return base64 encoded data"""
    try:
        uploaded_files = []
        
        for file in files:
            # Validate file type
            if not file.content_type.startswith(('image/', 'video/')):
                raise HTTPException(
                    status_code=400, 
                    detail=f"File {file.filename} is not a valid image or video"
                )
            
            # Read file content
            content = await file.read()
            
            # Validate file size (50MB max)
            if len(content) > 50 * 1024 * 1024:
                raise HTTPException(
                    status_code=400, 
                    detail=f"File {file.filename} is too large (max 50MB)"
                )
            
            # Encode to base64
            base64_data = base64.b64encode(content).decode('utf-8')
            
            # Create media file object
            media_file = MediaFile(
                name=file.filename,
                type='image' if file.content_type.startswith('image/') else 'video',
                data=base64_data,
                size=len(content)
            )
            
            uploaded_files.append(media_file)
        
        return {"files": uploaded_files, "count": len(uploaded_files)}
        
    except Exception as e:
        logging.error(f"Error uploading files: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload files")

# Create a new birthday wish
@api_router.post("/wishes", response_model=BirthdayWish)
async def create_wish(request: CreateWishRequest):
    """Create a new birthday wish"""
    try:
        wish = BirthdayWish(
            person_name=request.person_name,
            relationship=request.relationship,
            message=request.message,
            photos=request.photos,
            custom_no_texts=request.custom_no_texts
        )
        
        # Save to database
        wish_dict = wish.dict()
        result = await db.birthday_wishes.insert_one(wish_dict)
        
        if result.inserted_id:
            return wish
        else:
            raise HTTPException(status_code=500, detail="Failed to create wish")
            
    except Exception as e:
        logging.error(f"Error creating wish: {e}")
        raise HTTPException(status_code=500, detail="Failed to create wish")

# Get a specific birthday wish
@api_router.get("/wishes/{wish_id}", response_model=BirthdayWish)
async def get_wish(wish_id: str):
    """Get a specific birthday wish by ID"""
    try:
        wish = await db.birthday_wishes.find_one({"id": wish_id})
        
        if not wish:
            raise HTTPException(status_code=404, detail="Wish not found")
        
        return BirthdayWish(**wish)
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting wish: {e}")
        raise HTTPException(status_code=500, detail="Failed to get wish")

# Get all wishes (for admin/debugging)
@api_router.get("/wishes", response_model=List[BirthdayWish])
async def get_all_wishes():
    """Get all birthday wishes"""
    try:
        wishes = await db.birthday_wishes.find().to_list(100)
        return [BirthdayWish(**wish) for wish in wishes]
        
    except Exception as e:
        logging.error(f"Error getting wishes: {e}")
        raise HTTPException(status_code=500, detail="Failed to get wishes")

# Update a wish
@api_router.put("/wishes/{wish_id}", response_model=BirthdayWish)
async def update_wish(wish_id: str, request: CreateWishRequest):
    """Update an existing birthday wish"""
    try:
        # Check if wish exists
        existing_wish = await db.birthday_wishes.find_one({"id": wish_id})
        if not existing_wish:
            raise HTTPException(status_code=404, detail="Wish not found")
        
        # Update the wish
        updated_wish = BirthdayWish(
            id=wish_id,
            person_name=request.person_name,
            relationship=request.relationship,
            message=request.message,
            photos=request.photos,
            custom_no_texts=request.custom_no_texts,
            created_at=existing_wish['created_at'],
            updated_at=datetime.utcnow()
        )
        
        # Save to database
        result = await db.birthday_wishes.update_one(
            {"id": wish_id},
            {"$set": updated_wish.dict()}
        )
        
        if result.modified_count > 0:
            return updated_wish
        else:
            raise HTTPException(status_code=500, detail="Failed to update wish")
            
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating wish: {e}")
        raise HTTPException(status_code=500, detail="Failed to update wish")

# Delete a wish
@api_router.delete("/wishes/{wish_id}")
async def delete_wish(wish_id: str):
    """Delete a birthday wish"""
    try:
        result = await db.birthday_wishes.delete_one({"id": wish_id})
        
        if result.deleted_count > 0:
            return {"message": "Wish deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Wish not found")
            
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting wish: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete wish")

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()