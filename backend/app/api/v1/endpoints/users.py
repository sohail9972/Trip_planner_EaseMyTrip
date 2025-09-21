from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional

router = APIRouter()

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None

# Mock database
fake_users_db = {}

@router.get("/me", response_model=UserBase)
async def read_users_me(current_user: UserBase = Depends(get_current_user)):
    """
    Get current user information.
    """
    return current_user

@router.get("/{user_id}", response_model=UserBase)
async def read_user(user_id: str):
    """
    Get a specific user by ID.
    """
    if user_id not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return fake_users_db[user_id]

@router.put("/me", response_model=UserBase)
async def update_user_me(
    user_update: UserUpdate,
    current_user: UserBase = Depends(get_current_user)
):
    """
    Update current user information.
    """
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    # In a real app, you would save this to the database
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_me(current_user: UserBase = Depends(get_current_user)):
    """
    Delete current user.
    """
    # In a real app, you would delete the user from the database
    return {"detail": "User deleted successfully"}
