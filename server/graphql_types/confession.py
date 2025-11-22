import strawberry
from datetime import datetime
from typing import Optional, List
from models.confession import Confession
from graphql_types.comment import CommentType


@strawberry.type
class ConfessionType:
    id: str
    content: str
    category: Optional[str]
    likes: int
    isApproved: bool = strawberry.field(name="isApproved")
    gender: str
    anonymousName: str = strawberry.field(name="anonymousName")
    avatarSeed: int = strawberry.field(name="avatarSeed")
    createdAt: datetime = strawberry.field(name="createdAt")
    updatedAt: datetime = strawberry.field(name="updatedAt")
    comments: Optional[List[CommentType]]

    @staticmethod
    def from_model(confession: Confession) -> "ConfessionType":
        return ConfessionType(
            id=str(confession.id),
            content=confession.content,
            category=confession.category,
            likes=confession.likes,
            isApproved=confession.isApproved,
            gender=confession.gender,
            anonymousName=confession.anonymousName,
            avatarSeed=confession.avatarSeed,
            createdAt=confession.createdAt,
            updatedAt=confession.updatedAt,
            comments=[CommentType.from_model(c) for c in confession.comments] if confession.comments else None,
        )
