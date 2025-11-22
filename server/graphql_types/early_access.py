import strawberry
from datetime import datetime
from models.earlyAccess import EarlyAccess


@strawberry.type
class EarlyAccessType:
    id: str
    email: str
    name: str
    created_at: datetime

    @staticmethod
    def from_model(early_access: EarlyAccess) -> "EarlyAccessType":
        return EarlyAccessType(
            id=str(early_access.id),
            email=early_access.email,
            name=early_access.name,
            created_at=early_access.createdAt,
        )
