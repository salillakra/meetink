from beanie import Document
from datetime import datetime, timezone
from pydantic import Field

class User(Document):
    email: str
    name: str | None = None
    picture: str | None = None
    provider: str
    role: str = "user"
    provider_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "users"
