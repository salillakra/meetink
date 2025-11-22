from beanie import Document
from pydantic import Field
from datetime import datetime, timezone

class EarlyAccess(Document):
    email: str
    name: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "earlyAccess"
