import strawberry
from datetime import datetime
from typing import Optional, List
from models.confession import Confession, Comment
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
    commentsCount: int = strawberry.field(name="commentsCount")
    comments: Optional[List[CommentType]] = None

    @staticmethod
    def from_model(confession: Confession, include_comments: bool = True) -> "ConfessionType":
        comments_list = None
        if include_comments and hasattr(confession, 'comments') and confession.comments:
            comments_list = [CommentType.from_model(c) for c in confession.comments]
        
        comments_count = len(confession.comments) if hasattr(confession, 'comments') and confession.comments else 0
        
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
            commentsCount=comments_count,
            comments=comments_list,
        )
