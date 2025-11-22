from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def api_root():
    """Root endpoint with API information"""
    return {
        "message": "FastAPI server is running - Use /graphql for GraphQL queries",
        "port": 8000,
        "graphql_endpoint": "/graphql"
    }
