import strawberry
from typing import Optional
from datetime import datetime, timezone
from models.confession import Confession, Comment
from models.earlyAccess import EarlyAccess
from graphql_types.confession import ConfessionType
from graphql_types.comment import CommentType
from graphql_types.early_access import EarlyAccessType


@strawberry.type
class Mutation:
    @strawberry.field
    async def create_confession(
        self,
        content: str,
        category: Optional[str],
        gender: str,
        anonymous_name: str,
        avatar_seed: int,
    ) -> ConfessionType:
        confession = Confession(
            content=content,
            category=category,
            gender=gender,
            anonymousName=anonymous_name,
            avatarSeed=avatar_seed,
            isApproved=True,  # Auto-approve for now
            likes=0,
            createdAt=datetime.now(timezone.utc),
            updatedAt=datetime.now(timezone.utc),
        )
        await confession.insert()
        confession.comments = []
        return ConfessionType.from_model(confession)

    @strawberry.field
    async def create_comment(
        self,
        confession_id: str,
        content: str,
        gender: str,
        anonymous_name: str,
        avatar_seed: int,
    ) -> CommentType:
        from beanie import PydanticObjectId

        comment = Comment(
            content=content,
            gender=gender,
            anonymousName=anonymous_name,
            avatarSeed=avatar_seed,
            confessionId=PydanticObjectId(confession_id),
            createdAt=datetime.now(timezone.utc),
        )
        await comment.insert()
        return CommentType.from_model(comment)

    @strawberry.field
    async def like_confession(self, confession_id: str) -> int:
        confession = await Confession.get(confession_id)
        if not confession:
            raise Exception("Confession not found")

        confession.likes += 1
        confession.updatedAt = datetime.now(timezone.utc)
        await confession.save()
        return confession.likes

    @strawberry.field
    async def create_early_access(self, email: str, name: str) -> EarlyAccessType:
        early_access = EarlyAccess(
            email=email,
            name=name,
            createdAt=datetime.now(timezone.utc),
        )
        await early_access.insert()
        return EarlyAccessType.from_model(early_access)
