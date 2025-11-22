import strawberry
from datetime import datetime


@strawberry.type
class HealthStatus:
    status: str
    time: datetime
