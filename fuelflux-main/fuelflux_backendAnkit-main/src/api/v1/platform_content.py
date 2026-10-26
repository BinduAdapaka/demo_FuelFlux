from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timezone
from beanie import PydanticObjectId
import structlog

from src.db.models.platform_content import PlatformStatistics, PlatformTestimonial
from src.db.models.user import User
from src.api.v1.admin import get_current_admin, write_audit_log

log = structlog.get_logger()

router = APIRouter(tags=["platform-content"])

# ─── Schemas ─────────────────────────────────────────────────────────────────

class PlatformStatsUpdate(BaseModel):
    fuel_stations: Optional[int] = None
    active_vehicles: Optional[int] = None
    total_transactions: Optional[int] = None
    connected_users: Optional[int] = None
    liters_telemetered_millions: Optional[float] = None
    uptime_percentage: Optional[float] = None
    checkout_speed_sec: Optional[float] = None
    hero_headline: Optional[str] = None
    hero_subheadline: Optional[str] = None


class TestimonialCreate(BaseModel):
    author: str = Field(..., min_length=2)
    role: str = Field(..., min_length=2)
    company: str = Field(..., min_length=2)
    quote: str = Field(..., min_length=10)
    highlight: str = Field(..., min_length=2)
    stars: int = Field(5, ge=1, le=5)
    initials: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool = True
    display_order: int = 0


class TestimonialUpdate(BaseModel):
    author: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    quote: Optional[str] = None
    highlight: Optional[str] = None
    stars: Optional[int] = Field(None, ge=1, le=5)
    initials: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


def _testimonial_dict(t: PlatformTestimonial) -> dict:
    return {
        "id": str(t.id),
        "author": t.author,
        "role": t.role,
        "company": t.company,
        "quote": t.quote,
        "highlight": t.highlight,
        "stars": t.stars,
        "initials": t.initials or "".join([w[0].upper() for w in t.author.split()[:2]]),
        "avatar_url": t.avatar_url,
        "is_active": t.is_active,
        "display_order": t.display_order,
        "created_at": t.created_at.isoformat() if t.created_at else None,
        "updated_at": t.updated_at.isoformat() if t.updated_at else None,
    }


def _stats_dict(s: PlatformStatistics) -> dict:
    return {
        "id": str(s.id),
        "fuel_stations": s.fuel_stations,
        "active_vehicles": s.active_vehicles,
        "total_transactions": s.total_transactions,
        "connected_users": s.connected_users,
        "liters_telemetered_millions": s.liters_telemetered_millions,
        "uptime_percentage": s.uptime_percentage,
        "checkout_speed_sec": s.checkout_speed_sec,
        "hero_headline": s.hero_headline,
        "hero_subheadline": s.hero_subheadline,
        "updated_at": s.updated_at.isoformat() if s.updated_at else None,
    }


# ─── Public Endpoints ────────────────────────────────────────────────────────

@router.get("/platform/stats")
async def get_public_stats():
    """Public platform statistics for landing page and apps."""
    stats = await PlatformStatistics.find_one()
    if not stats:
        stats = PlatformStatistics()
        await stats.insert()
    return {"success": True, "stats": _stats_dict(stats)}


@router.get("/platform/testimonials")
async def get_public_testimonials():
    """Public list of active testimonials for landing page."""
    testimonials = await PlatformTestimonial.find(
        PlatformTestimonial.is_active == True
    ).sort("display_order", "-created_at").to_list()
    return {"success": True, "testimonials": [_testimonial_dict(t) for t in testimonials]}


# ─── Admin Endpoints ─────────────────────────────────────────────────────────

@router.get("/admin/platform/stats")
async def admin_get_platform_stats(admin: User = Depends(get_current_admin)):
    """Admin endpoint to view platform statistics along with live DB counts."""
    stats = await PlatformStatistics.find_one()
    if not stats:
        stats = PlatformStatistics()
        await stats.insert()

    # Also compute real live database counts for comparison
    from src.db.models.pump import Pump
    from src.db.models.vehicle import Vehicle
    from src.db.models.transaction import Transaction

    live_pumps = await Pump.count()
    live_vehicles = await Vehicle.count()
    live_transactions = await Transaction.count()
    live_users = await User.count()

    return {
        "success": True,
        "data": {
            "stats": _stats_dict(stats),
            "live_database_counts": {
                "pumps": live_pumps,
                "vehicles": live_vehicles,
                "transactions": live_transactions,
                "users": live_users,
            }
        }
    }


@router.put("/admin/platform/stats")
async def admin_update_platform_stats(
    payload: PlatformStatsUpdate,
    admin: User = Depends(get_current_admin)
):
    """Admin endpoint to update platform-wide public statistics."""
    stats = await PlatformStatistics.find_one()
    if not stats:
        stats = PlatformStatistics()

    update_dict = payload.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        if val is not None:
            setattr(stats, field, val)

    stats.updated_at = datetime.now(timezone.utc)
    await stats.save()

    await write_audit_log(
        admin,
        action="PLATFORM_STATS_UPDATED",
        target_type="PlatformStatistics",
        target_id=str(stats.id),
        metadata=update_dict
    )

    log.info("Platform statistics updated by admin", admin=admin.email, updates=update_dict)

    return {
        "success": True,
        "message": "Platform statistics updated successfully",
        "data": {"stats": _stats_dict(stats)}
    }


@router.get("/admin/platform/testimonials")
async def admin_get_testimonials(admin: User = Depends(get_current_admin)):
    """Admin endpoint to retrieve all testimonials (active + inactive)."""
    testimonials = await PlatformTestimonial.find_all().sort("display_order", "-created_at").to_list()
    return {
        "success": True,
        "data": {"testimonials": [_testimonial_dict(t) for t in testimonials]}
    }


@router.post("/admin/platform/testimonials")
async def admin_create_testimonial(
    payload: TestimonialCreate,
    admin: User = Depends(get_current_admin)
):
    """Admin endpoint to create a new testimonial."""
    initials = payload.initials or "".join([w[0].upper() for w in payload.author.split()[:2]])
    testimonial = PlatformTestimonial(
        author=payload.author,
        role=payload.role,
        company=payload.company,
        quote=payload.quote,
        highlight=payload.highlight,
        stars=payload.stars,
        initials=initials,
        avatar_url=payload.avatar_url,
        is_active=payload.is_active,
        display_order=payload.display_order,
    )
    await testimonial.insert()

    await write_audit_log(
        admin,
        action="TESTIMONIAL_CREATED",
        target_type="PlatformTestimonial",
        target_id=str(testimonial.id),
        metadata={"author": testimonial.author, "company": testimonial.company}
    )

    return {
        "success": True,
        "message": f"Testimonial from '{testimonial.author}' created successfully",
        "data": {"testimonial": _testimonial_dict(testimonial)}
    }


@router.put("/admin/platform/testimonials/{testimonial_id}")
async def admin_update_testimonial(
    testimonial_id: str,
    payload: TestimonialUpdate,
    admin: User = Depends(get_current_admin)
):
    """Admin endpoint to update an existing testimonial."""
    try:
        oid = PydanticObjectId(testimonial_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid testimonial ID format")

    testimonial = await PlatformTestimonial.get(oid)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    update_dict = payload.model_dump(exclude_unset=True)
    for field, val in update_dict.items():
        if val is not None:
            setattr(testimonial, field, val)

    testimonial.updated_at = datetime.now(timezone.utc)
    await testimonial.save()

    await write_audit_log(
        admin,
        action="TESTIMONIAL_UPDATED",
        target_type="PlatformTestimonial",
        target_id=str(testimonial.id),
        metadata=update_dict
    )

    return {
        "success": True,
        "message": f"Testimonial '{testimonial.author}' updated successfully",
        "data": {"testimonial": _testimonial_dict(testimonial)}
    }


@router.delete("/admin/platform/testimonials/{testimonial_id}")
async def admin_delete_testimonial(
    testimonial_id: str,
    admin: User = Depends(get_current_admin)
):
    """Admin endpoint to delete a testimonial."""
    try:
        oid = PydanticObjectId(testimonial_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid testimonial ID format")

    testimonial = await PlatformTestimonial.get(oid)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    author_name = testimonial.author
    await testimonial.delete()

    await write_audit_log(
        admin,
        action="TESTIMONIAL_DELETED",
        target_type="PlatformTestimonial",
        target_id=str(oid),
        metadata={"author": author_name}
    )

    return {
        "success": True,
        "message": f"Testimonial from '{author_name}' deleted successfully"
    }
