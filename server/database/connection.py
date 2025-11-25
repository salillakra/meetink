import os
import motor.motor_asyncio
from beanie import init_beanie
from models.confession import Confession, Comment
from models.earlyAccess import EarlyAccess
from models.user import User
from dotenv import load_dotenv

load_dotenv()


async def init_database():
    """Initialize database connection and Beanie ODM"""
    mongo_uri = os.getenv("DATABASE_URL")
    client = motor.motor_asyncio.AsyncIOMotorClient(mongo_uri)
    await init_beanie(
        database=client.meetink,  # pyright: ignore[reportArgumentType]
        document_models=[EarlyAccess, Comment, Confession, User],
    )
