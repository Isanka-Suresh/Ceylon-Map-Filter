-- Migration: Create Places Table
-- Description: Stores extracted Google Maps places with a unique constraint on place_id to prevent duplicates.

CREATE TABLE IF NOT EXISTS public.places (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    place_id text NOT NULL UNIQUE,
    name text NOT NULL,
    address text,
    phone text,
    website text,
    rating double precision,
    review_count bigint,
    latitude double precision,
    longitude double precision,
    category text,
    search_keyword text,
    search_location text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- The UNIQUE constraint on place_id automatically creates a unique btree index.

-- Create indexes for common filtering and analytical queries
CREATE INDEX IF NOT EXISTS places_category_idx ON public.places (category);
CREATE INDEX IF NOT EXISTS places_search_location_idx ON public.places (search_location);
CREATE INDEX IF NOT EXISTS places_search_keyword_idx ON public.places (search_keyword);
