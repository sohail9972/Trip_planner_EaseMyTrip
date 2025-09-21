from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class Destination(BaseModel):
    id: str
    name: str
    country: str
    description: str
    image_url: Optional[str] = None
    popularity: int
    best_time_to_visit: str
    average_cost_per_day: float
    
class DestinationSearch(BaseModel):
    query: str
    limit: int = 10
    
class PopularDestinationQuery(BaseModel):
    limit: int = 10
    country: Optional[str] = None

# Mock data
mock_destinations = [
    {
        "id": "1",
        "name": "Goa",
        "country": "India",
        "description": "Famous for its beaches, nightlife, and Portuguese heritage.",
        "image_url": "https://example.com/goa.jpg",
        "popularity": 95,
        "best_time_to_visit": "November to February",
        "average_cost_per_day": 3500.0
    },
    {
        "id": "2",
        "name": "Jaipur",
        "country": "India",
        "description": "The Pink City known for its rich history and majestic forts.",
        "image_url": "https://example.com/jaipur.jpg",
        "popularity": 90,
        "best_time_to_visit": "October to March",
        "average_cost_per_day": 4000.0
    },
    {
        "id": "3",
        "name": "Kerala",
        "country": "India",
        "description": "God's Own Country with backwaters, beaches, and hill stations.",
        "image_url": "https://example.com/kerala.jpg",
        "popularity": 92,
        "best_time_to_visit": "September to March",
        "average_cost_per_day": 3800.0
    }
]

@router.get("/{destination_id}", response_model=Destination)
async def get_destination(destination_id: str):
    """
    Get details of a specific destination by ID.
    """
    for dest in mock_destinations:
        if dest["id"] == destination_id:
            return dest
    raise HTTPException(status_code=404, detail="Destination not found")

@router.post("/search", response_model=List[Destination])
async def search_destinations(search: DestinationSearch):
    """
    Search for destinations by name, description, or other attributes.
    """
    query = search.query.lower()
    results = [
        dest for dest in mock_destinations 
        if (query in dest["name"].lower() or 
            query in dest["description"].lower() or
            query in dest["country"].lower())
    ]
    return results[:search.limit]

@router.get("/popular", response_model=List[Destination])
async def get_popular_destinations(limit: int = 10, country: Optional[str] = None):
    """
    Get a list of popular destinations, optionally filtered by country.
    """
    results = mock_destinations
    if country:
        results = [d for d in results if d["country"].lower() == country.lower()]
    
    # Sort by popularity and limit results
    results.sort(key=lambda x: x["popularity"], reverse=True)
    return results[:limit]

@router.get("/{destination_id}/activities")
async def get_destination_activities(destination_id: str):
    """
    Get popular activities for a specific destination.
    """
    # In a real app, this would come from a database
    activities = {
        "1": [
            {"id": "a1", "name": "Beach Hopping", "duration": 6, "price_range": "500-1500"},
            {"id": "a2", "name": "Water Sports at Baga Beach", "duration": 3, "price_range": "1000-3000"},
            {"id": "a3", "name": "Fort Aguada Visit", "duration": 2, "price_range": "200-500"}
        ],
        "2": [
            {"id": "a4", "name": "Amber Fort Tour", "duration": 3, "price_range": "800-2000"},
            {"id": "a5", "name": "City Palace Visit", "duration": 2, "price_range": "500-1500"},
            {"id": "a6", "name": "Elephant Ride", "duration": 1, "price_range": "1000-2000"}
        ],
        "3": [
            {"id": "a7", "name": "Backwater Cruise", "duration": 8, "price_range": "2000-5000"},
            {"id": "a8", "name": "Ayurvedic Massage", "duration": 2, "price_range": "1500-4000"},
            {"id": "a9", "name": "Tea Plantation Tour", "duration": 4, "price_range": "1000-2500"}
        ]
    }
    
    if destination_id not in activities:
        raise HTTPException(status_code=404, detail="No activities found for this destination")
    
    return activities[destination_id]
