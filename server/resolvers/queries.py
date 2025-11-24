import strawberry
from typing import List, Optional
from datetime import datetime
from models.confession import Confession, Comment
from models.earlyAccess import EarlyAccess
from graphql_types.confession import ConfessionType
from graphql_types.comment import CommentType
from graphql_types.early_access import EarlyAccessType
from graphql_types.health import HealthStatus


@strawberry.type
class Query:
    @strawberry.field
    def hello(self) -> str:
        return "Hello World"

    @strawberry.field
    async def health(self) -> HealthStatus:
        return HealthStatus(status="ok", time=datetime.now())

    @strawberry.field
    async def confessions(self) -> List[ConfessionType]:
        confessions = await Confession.find_all().to_list()

        # Fetch only comment counts for efficiency
        for confession in confessions:
            comments_list = await Comment.find(Comment.confessionId == confession.id).to_list()
            confession.comments = comments_list

        return [ConfessionType.from_model(c, include_comments=False) for c in confessions]
    
    @strawberry.field
    async def confessions_by_category(self, category: str) -> List[ConfessionType]:
                
        if (category == "all"):
            confessions = await Confession.find_all().to_list()
        else:
            confessions = await Confession.find(Confession.category == category).to_list()


        # Fetch only comment counts for efficiency
        for confession in confessions:
            comments_list = await Comment.find(Comment.confessionId == confession.id).to_list()
            confession.comments = comments_list

        return [ConfessionType.from_model(c, include_comments=False) for c in confessions]

    @strawberry.field
    async def confession(self, confession_id: str) -> Optional[ConfessionType]:
        confession = await Confession.get(confession_id)
        if confession:
            # Fetch comments for this confession
            comments_list = await Comment.find(Comment.confessionId == confession.id).to_list()
            confession.comments = comments_list
            return ConfessionType.from_model(confession, include_comments=True)
        return None
    
    @strawberry.field
    async def comments_by_confession(self, confession_id: str) -> List[CommentType]:
        """Fetch comments for a specific confession - allows lazy loading"""
        comments_list = await Comment.find(Comment.confessionId == confession_id).to_list()
        return [CommentType.from_model(c) for c in comments_list]

    @strawberry.field
    async def comments(self) -> List[CommentType]:
        comments_list = await Comment.find_all().to_list()
        return [CommentType.from_model(c) for c in comments_list]

    @strawberry.field
    async def comment(self, comment_id: str) -> Optional[CommentType]:
        comment = await Comment.get(comment_id)
        return CommentType.from_model(comment) if comment else None

    @strawberry.field
    async def early_access(self) -> List[EarlyAccessType]:
        early_access = await EarlyAccess.find_all().to_list()
        return [EarlyAccessType.from_model(ea) for ea in early_access]

    @strawberry.field
    async def early_access_by_id(self, early_access_id: str) -> Optional[EarlyAccessType]:
        early_access = await EarlyAccess.get(early_access_id)
        return EarlyAccessType.from_model(early_access) if early_access else None
