from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class MediaFile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # 'image' or 'video'
    data: str  # base64 encoded data
    size: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BirthdayWish(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    person_name: str
    relationship: str
    message: str
    photos: List[MediaFile] = Field(default_factory=list)
    custom_no_texts: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CreateWishRequest(BaseModel):
    person_name: str
    relationship: str
    message: str
    photos: List[MediaFile] = Field(default_factory=list)
    custom_no_texts: List[str] = Field(default_factory=list)

class GenerateMessageRequest(BaseModel):
    person_name: str
    relationship: str

class GenerateMessageResponse(BaseModel):
    message: str
    person_name: str
    relationship: str