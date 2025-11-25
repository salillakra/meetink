from datetime import datetime
import os
from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Request, Cookie, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from auth.config import configure_oauth
from jose import jwt, JWTError
from datetime import datetime, timedelta

from models.user import User

router = APIRouter()
oauth = OAuth()

configure_oauth(oauth) # Configure OAuth providers

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




# Auth

@router.get("/auth/login/google")
async def login(request: Request):
    try:
        redirect_uri = "http://localhost:8000/auth/callback/google"
        return await oauth.google.authorize_redirect(request, redirect_uri) # pyright: ignore[reportOptionalMemberAccess]
    except Exception as e:
        # Better error handling for OAuth failures
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"OAuth configuration error: {str(e)}. Please check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables."
        )



SECRET = os.getenv("JWT_SECRET", "supersecretvalue")

def create_jwt(user_id: str):
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")


@router.get("/auth/callback/google")
async def callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request) # type: ignore
    except Exception as e:
        # Handle OAuth errors (expired code, invalid grant, etc.)
        error_msg = str(e)
        if "invalid_grant" in error_msg or "authorization_pending" in error_msg:
            # Redirect to home with simple error notification for expired codes
            return RedirectResponse(url="http://localhost:3000/?error=oauth_expired")
        elif "access_denied" in error_msg:
            # User denied access
            return RedirectResponse(url="http://localhost:3000/auth/error?error=access_denied")
        else:
            # Other OAuth errors - redirect to error page with details
            return RedirectResponse(
                url=f"http://localhost:3000/auth/error?error=oauth_failed&details={error_msg[:100]}"
            )
    
    try:
        # Fetch user info directly instead of parsing ID token
        resp = await oauth.google.get('https://www.googleapis.com/oauth2/v2/userinfo', token=token) # type: ignore
        userinfo = resp.json()

        user = await User.find_one(User.email == userinfo["email"])
        if not user:
            user = User(
                email=userinfo["email"],
                name=userinfo.get("name"),
                picture=userinfo.get("picture"),
                provider="google",
                provider_id=userinfo["id"]
            )
            await user.insert()

        jwt_token = create_jwt(str(user.id))

        response = RedirectResponse(url="http://localhost:3000/auth/success")
        response.set_cookie(
            key="access_token",
            value=jwt_token,
            httponly=True,
            secure=False,
            samesite="lax"
        )
        return response
    except Exception as e:
        # Database or user creation errors
        return RedirectResponse(
            url=f"http://localhost:3000/auth/error?error=server_error&details={str(e)[:100]}"
        )


@router.get("/auth/me")
async def get_current_user(access_token: str | None = Cookie(None)):
    """Get current authenticated user details"""
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(access_token, SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "picture": user.picture,
            "provider": user.provider,
            "role": user.role,
            "created_at": user.created_at.isoformat()
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/auth/logout")
async def logout():
    """Logout user by clearing cookie"""
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie(key="access_token")
    return response
