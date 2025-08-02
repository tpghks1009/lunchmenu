from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Location(BaseModel):
    latitude: float
    longitude: float

class Restaurant(BaseModel):
    id: int
    name: str
    category: str
    distance: Optional[float] = None
    location: Location
    rating: float
    description: str
    image: str
    address: str
    priceRange: str

class RestaurantDetail(Restaurant):
    phone: str
    openingHours: str
    menu: List[dict]
    reviews: List[dict]

class HistoryItem(BaseModel):
    restaurant_id: int
    timestamp: datetime

class HistoryRequest(BaseModel):
    restaurant_id: int

class HistoryResponse(BaseModel):
    id: int
    restaurant_id: int
    restaurant_name: str
    restaurant_category: str
    selected_at: str 