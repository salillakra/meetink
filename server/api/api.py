from datetime import datetime
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

@router.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "API is healthy"}    



@router.get("/ping")
def pingServer():
    """Ping endpoint to check server status"""
    return {"status": "pong", "time": datetime.now().isoformat()}