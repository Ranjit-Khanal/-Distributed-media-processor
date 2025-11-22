-- PostgreSQL Indexes for Distributed Media Library
-- This file contains additional indexes for query optimization

-- Fulltext search indexes (already created in migrations, but documented here)
-- CREATE INDEX media_files_name_fulltext_idx ON media_files USING gin(to_tsvector('english', name));
-- CREATE INDEX tags_name_fulltext_idx ON tags USING gin(to_tsvector('english', name));

-- Additional composite indexes for common query patterns

-- Index for filtering by user and type
CREATE INDEX IF NOT EXISTS media_files_user_type_idx ON media_files(user_id, type);

-- Index for filtering by user and status
CREATE INDEX IF NOT EXISTS media_files_user_status_idx ON media_files(user_id, status);

-- Index for filtering by type and status (for admin queries)
CREATE INDEX IF NOT EXISTS media_files_type_status_idx ON media_files(type, status);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS media_files_created_at_desc_idx ON media_files(created_at DESC);

-- Index for size-based queries
CREATE INDEX IF NOT EXISTS media_files_size_idx ON media_files(size);

-- Index for metadata queries (if frequently queried)
CREATE INDEX IF NOT EXISTS media_metadata_width_height_idx ON media_metadata(width, height);

-- Index for video duration queries
CREATE INDEX IF NOT EXISTS media_metadata_duration_idx ON media_metadata(duration) WHERE duration IS NOT NULL;

-- Partial index for pending media (for queue processing)
CREATE INDEX IF NOT EXISTS media_files_pending_idx ON media_files(id, created_at) WHERE status = 'pending';

-- Partial index for failed media (for monitoring)
CREATE INDEX IF NOT EXISTS media_files_failed_idx ON media_files(id, created_at, error_message) WHERE status = 'failed';

