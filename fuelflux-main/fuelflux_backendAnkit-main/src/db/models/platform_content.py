from beanie import Document
from datetime import datetime, timezone
from typing import Optional

class PlatformStatistics(Document):
    fuel_stations: int = 450
    active_vehicles: int = 2850
    total_transactions: int = 84200
    connected_users: int = 12500
    liters_telemetered_millions: float = 15.4
    uptime_percentage: float = 99.98
    checkout_speed_sec: float = 1.8
    hero_headline: Optional[str] = "The Autonomous Operating System for Modern Petroleum Retail"
    hero_subheadline: Optional[str] = "Next-generation forecourt automation, real-time IoT wet-stock telemetry, and high-frequency ANPR fleet recognition unified in one mission-critical platform."
    updated_at: datetime = datetime.now(timezone.utc)

    class Settings:
        name = "platform_statistics"


class PlatformTestimonial(Document):
    author: str
    role: str
    company: str
    quote: str
    highlight: str
    stars: int = 5
    initials: str
    avatar_url: Optional[str] = None
    is_active: bool = True
    display_order: int = 0
    created_at: datetime = datetime.now(timezone.utc)
    updated_at: datetime = datetime.now(timezone.utc)

    class Settings:
        name = "platform_testimonials"


INITIAL_TESTIMONIALS = [
    {
        "author": "Arun Mehta",
        "role": "Owner & Managing Director",
        "company": "Bharat Petroleum Cluster",
        "quote": "FuelFlux completely streamlined our operations. We sync inventory refills across 4 stations, audit employee check-ins effortlessly, and manage client credit tabs in one console. Incredible architecture!",
        "highlight": "Synced 4 Stations",
        "stars": 5,
        "initials": "AM",
        "is_active": True,
        "display_order": 1,
    },
    {
        "author": "Sandra Collins",
        "role": "VP of Logistics",
        "company": "Apex Fuel Carriers",
        "quote": "As a Logistics Director, coordinating driver rosters and tanker dispatch routes was chaotic. With the unified dashboard operations, fuel supply schedules became predictive. A master-class in SaaS UI.",
        "highlight": "Predictive Tanker Dispatch",
        "stars": 5,
        "initials": "SC",
        "is_active": True,
        "display_order": 2,
    },
    {
        "author": "Gautam Krishnan",
        "role": "Managing Director",
        "company": "GK Gas Networks",
        "quote": "The ANPR loyalty dashboard increased return-rates by 18% in the first three months. Our business clients love the automatic plate recognition and credit invoices. Clean interface and responsive support.",
        "highlight": "+18% Loyalty Retention",
        "stars": 5,
        "initials": "GK",
        "is_active": True,
        "display_order": 3,
    },
    {
        "author": "Rajesh Patel",
        "role": "Operations Lead",
        "company": "Reliance Logistics Network",
        "quote": "The wet-stock audit alerts alone saved us over \u20b94.5 Lakhs in prevented tank leakage within 60 days. The continuous telemetry and automatic shut-off triggers give our team 100% peace of mind.",
        "highlight": "Saved \u20b94.5L Leak Loss",
        "stars": 5,
        "initials": "RP",
        "is_active": True,
        "display_order": 4,
    },
    {
        "author": "Elena Rostova",
        "role": "Fleet & Retail Operations Head",
        "company": "TransGlobal Energy",
        "quote": "Managing employee shift check-ins, cash reconciliation, and dispenser CRM on a single dashboard has reduced our end-of-day audit time from 3 hours to less than 15 minutes per site.",
        "highlight": "Audit Time: 3h \u2192 15m",
        "stars": 5,
        "initials": "ER",
        "is_active": True,
        "display_order": 5,
    },
]


async def seed_platform_content():
    """Seed default statistics and testimonials if empty."""
    stats_count = await PlatformStatistics.count()
    if stats_count == 0:
        default_stats = PlatformStatistics()
        await default_stats.insert()

    testi_count = await PlatformTestimonial.count()
    if testi_count == 0:
        for t in INITIAL_TESTIMONIALS:
            testi = PlatformTestimonial(**t)
            await testi.insert()
