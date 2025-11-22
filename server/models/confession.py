from beanie import Document, PydanticObjectId
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import Field

class Comment(Document):
    content: str
    gender: str
    anonymousName: str
    avatarSeed: int
    confessionId: PydanticObjectId
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "Comment"



class Confession(Document):
    content: str
    category: Optional[str] = None
    likes: int = 0
    isApproved: bool = False
    gender: str
    anonymousName: str
    avatarSeed: int
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    comments: Optional[List[Comment]] = None

    class Settings:
        name = "Confession"
