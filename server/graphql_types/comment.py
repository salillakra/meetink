import strawberry
from datetime import datetime
from models.confession import Comment


@strawberry.type
class CommentType:
    id: str
    content: str
    gender: str
    anonymousName: str = strawberry.field(name="anonymousName")
    avatarSeed: int = strawberry.field(name="avatarSeed")
    confessionId: str = strawberry.field(name="confessionId")
    createdAt: datetime = strawberry.field(name="createdAt")

    @staticmethod
    def from_model(comment: Comment) -> "CommentType":
        return CommentType(
            id=str(comment.id),
            content=comment.content,
            gender=comment.gender,
            anonymousName=comment.anonymousName,
            avatarSeed=comment.avatarSeed,
            confessionId=str(comment.confessionId),
            createdAt=comment.createdAt,
        )
