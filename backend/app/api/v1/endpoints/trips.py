from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date, datetime
from enum import Enum

router = APIRouter()

class TripTheme(str, Enum):
    ADVENTURE = "adventure"
    BEACH = "beach"
    CULTURAL = "cultural"
    LUXURY = "luxury"
    BACKPACKING = "backpacking"
    FAMILY = "family"
    HONEYMOON = "honeymoon"
    ROAD_TRIP = "road_trip"
    FOOD = "food"
    NIGHTLIFE = "nightlife"
    SHOPPING = "shopping"
    WILDLIFE = "wildlife"
    WELLNESS = "wellness"
    PHOTOGRAPHY = "photography"
    RELIGIOUS = "religious"
    EDUCATIONAL = "educational"
    BUSINESS = "business"

class BudgetLevel(str, Enum):
    BUDGET = "budget"
    MID_RANGE = "mid_range"
    LUXURY = "luxury"

class TravelerType(str, Enum):
    SOLO = "solo"
    COUPLE = "couple"
    FAMILY = "family"
    FRIENDS = "friends"
    BUSINESS = "business"

class ActivityPreference(BaseModel):
    name: str
    interest_level: int = Field(..., ge=1, le=5, description="Interest level from 1 (low) to 5 (high)")

class TripRequest(BaseModel):
    destination: str
    start_date: date
    end_date: date
    budget: float
    budget_level: BudgetLevel = BudgetLevel.MID_RANGE
    travelers: int = 1
    traveler_type: TravelerType = TravelerType.SOLO
    themes: List[TripTheme] = []
    interests: List[ActivityPreference] = []
    preferred_accommodation_types: List[str] = []
    preferred_transportation: List[str] = []
    dietary_restrictions: List[str] = []
    accessibility_needs: List[str] = []
    special_requests: Optional[str] = None

class TripDayPlan(BaseModel):
    date: date
    activities: List[dict]
    estimated_cost: float

class TripPlanResponse(BaseModel):
    id: str
    destination: str
    start_date: date
    end_date: date
    total_estimated_cost: float
    daily_plans: List[TripDayPlan]
    summary: str
    created_at: datetime
    updated_at: datetime

@router.post("/plan", response_model=TripPlanResponse)
async def plan_trip(trip_request: TripRequest):
    """
    Generate a personalized trip plan based on user preferences.
    """
    # This is a placeholder implementation
    # In a real implementation, this would call the AI service to generate the plan
    
    # Validate dates
    if trip_request.start_date >= trip_request.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Calculate trip duration
    duration = (trip_request.end_date - trip_request.start_date).days + 1
    
    # Generate a sample response (in a real app, this would come from an AI service)
    trip_plan = {
        "id": "trip_123456",
        "destination": trip_request.destination,
        "start_date": trip_request.start_date,
        "end_date": trip_request.end_date,
        "total_estimated_cost": trip_request.budget * 0.9,  # 90% of budget used
        "daily_plans": [],
        "summary": f"A {duration}-day trip to {trip_request.destination} with a {trip_request.budget_level} budget, focusing on {', '.join([theme.value for theme in trip_request.themes])}.",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Add sample daily plans
    for day in range(duration):
        current_date = trip_request.start_date + timedelta(days=day)
        trip_plan["daily_plans"].append({
            "date": current_date,
            "activities": [
                {
                    "time": "09:00",
                    "name": f"Breakfast at a local cafe",
                    "duration": 60,
                    "cost": 15.0,
                    "location": "Downtown"
                },
                {
                    "time": "10:30",
                    "name": f"{trip_request.destination} City Tour",
                    "duration": 180,
                    "cost": 45.0,
                    "location": "City Center"
                },
                {
                    "time": "14:00",
                    "name": "Lunch at a local restaurant",
                    "duration": 90,
                    "cost": 25.0,
                    "location": "Main Square"
                },
                {
                    "time": "16:00",
                    "name": "Free time to explore",
                    "duration": 120,
                    "cost": 0.0,
                    "location": ""
                },
                {
                    "time": "19:30",
                    "name": "Dinner at a recommended restaurant",
                    "duration": 120,
                    "cost": 40.0,
                    "location": "Riverside District"
                }
            ],
            "estimated_cost": 125.0
        })
    
    return trip_plan

@router.get("/{trip_id}", response_model=TripPlanResponse)
async def get_trip(trip_id: str):
    """
    Get details of a specific trip by ID.
    """
    # In a real implementation, this would fetch the trip from the database
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Not implemented yet"
    )

@router.get("/user/{user_id}", response_model=List[TripPlanResponse])
async def get_user_trips(user_id: str):
    """
    Get all trips for a specific user.
    """
    # In a real implementation, this would fetch trips from the database
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Not implemented yet"
    )

@router.post("/{trip_id}/book")
async def book_trip(trip_id: str):
    """
    Book activities and accommodations for a trip.
    """
    # In a real implementation, this would handle the booking process
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Not implemented yet"
    )
