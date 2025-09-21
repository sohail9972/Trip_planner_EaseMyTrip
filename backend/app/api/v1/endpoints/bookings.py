from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Optional
from enum import Enum

router = APIRouter()

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    UPI = "upi"
    NET_BANKING = "net_banking"
    WALLET = "wallet"

class BookingItem(BaseModel):
    type: str  # hotel, flight, activity, etc.
    item_id: str
    name: str
    quantity: int = 1
    price: float
    date: date
    time: Optional[str] = None
    details: Optional[dict] = None

class CreateBooking(BaseModel):
    trip_id: str
    items: List[BookingItem]
    payment_method: PaymentMethod
    contact_info: dict
    special_requests: Optional[str] = None

class BookingResponse(BaseModel):
    id: str
    user_id: str
    trip_id: str
    items: List[BookingItem]
    status: BookingStatus
    payment_status: PaymentStatus
    total_amount: float
    currency: str = "INR"
    created_at: datetime
    updated_at: datetime

# Mock database
mock_bookings = {}
mock_booking_counter = 1

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: CreateBooking, current_user: dict = Depends(get_current_user)):
    """
    Create a new booking for activities, accommodations, etc.
    """
    global mock_booking_counter
    
    # In a real app, you would validate the booking details
    # and process the payment
    
    booking_id = f"book_{mock_booking_counter}"
    mock_booking_counter += 1
    
    # Calculate total amount
    total_amount = sum(item.price * item.quantity for item in booking.items)
    
    # Create booking record
    booking_record = {
        "id": booking_id,
        "user_id": current_user.email,  # Using email as user ID in this mock
        "trip_id": booking.trip_id,
        "items": [item.dict() for item in booking.items],
        "status": BookingStatus.CONFIRMED,
        "payment_status": PaymentStatus.PAID,  # In a real app, this would depend on payment processing
        "payment_method": booking.payment_method,
        "total_amount": total_amount,
        "currency": "INR",
        "contact_info": booking.contact_info,
        "special_requests": booking.special_requests,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Store booking (in a real app, this would be in a database)
    mock_bookings[booking_id] = booking_record
    
    # In a real app, you would:
    # 1. Process payment
    # 2. Send confirmation email
    # 3. Update inventory
    # 4. Any other post-booking actions
    
    return booking_record

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    """
    Get details of a specific booking.
    """
    if booking_id not in mock_bookings:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking = mock_bookings[booking_id]
    
    # In a real app, you would verify the user has permission to view this booking
    if booking["user_id"] != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
    
    return booking

@router.get("/trip/{trip_id}", response_model=List[BookingResponse])
async def get_trip_bookings(trip_id: str, current_user: dict = Depends(get_current_user)):
    """
    Get all bookings for a specific trip.
    """
    # In a real app, you would query the database for bookings for this trip
    # and verify the user has permission to view them
    
    # This is a mock implementation that returns all bookings for the current user
    user_bookings = [
        booking for booking in mock_bookings.values() 
        if booking["user_id"] == current_user.email and booking["trip_id"] == trip_id
    ]
    
    return user_bookings

@router.post("/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    """
    Cancel a booking.
    """
    if booking_id not in mock_bookings:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking = mock_bookings[booking_id]
    
    # Verify user has permission to cancel this booking
    if booking["user_id"] != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this booking")
    
    # Check if booking can be cancelled
    if booking["status"] == BookingStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Booking is already cancelled")
    
    if booking["status"] == BookingStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot cancel a completed booking")
    
    # Update booking status
    booking["status"] = BookingStatus.CANCELLED
    booking["updated_at"] = datetime.utcnow()
    
    # In a real app, you would also:
    # 1. Process refund if applicable
    # 2. Update inventory
    # 3. Send cancellation email
    
    return booking
