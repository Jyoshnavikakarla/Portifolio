/*
# Extend portfolio schema for cinematic lab redesign

## Overview
Adds new fields to the projects table to support the enhanced project storytelling:
- slug: URL-friendly identifier
- long_description: extended project description for detail modal
- architecture: JSONB storing architecture flow data (nodes and connections)

Also adds an education table entry for sort_order support (already exists).

## Changes
1. ALTER TABLE projects: add slug, long_description, architecture columns
2. Backfill slug for existing projects based on title
*/

-- Add new columns to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS long_description text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS architecture jsonb;

-- Backfill slugs for existing projects
UPDATE projects SET slug = 'disaster-response' WHERE title = 'Disaster Response Coordination Platform' AND slug IS NULL;
UPDATE projects SET slug = 'live-drawing-webcam' WHERE title = 'Live Drawing on Webcam Feed' AND slug IS NULL;
UPDATE projects SET slug = 'movie-finder' WHERE title = 'Movie Finder Application' AND slug IS NULL;

-- Add architecture data for existing projects
UPDATE projects SET architecture = '{
  "nodes": [
    {"id": "react", "label": "React", "level": 0},
    {"id": "api", "label": "Backend / API", "level": 1},
    {"id": "db", "label": "MongoDB", "level": 2},
    {"id": "jwt", "label": "JWT Auth", "level": 1},
    {"id": "maps", "label": "Interactive Maps", "level": 1}
  ],
  "connections": [
    {"from": "react", "to": "api"},
    {"from": "api", "to": "db"},
    {"from": "jwt", "to": "api"},
    {"from": "maps", "to": "react"}
  ]
}'::jsonb WHERE title = 'Disaster Response Coordination Platform';

UPDATE projects SET architecture = '{
  "nodes": [
    {"id": "webcam", "label": "Webcam", "level": 0},
    {"id": "capture", "label": "Frame Capture", "level": 1},
    {"id": "opencv", "label": "OpenCV", "level": 2},
    {"id": "numpy", "label": "NumPy Processing", "level": 3},
    {"id": "overlay", "label": "Drawing Overlay", "level": 4}
  ],
  "connections": [
    {"from": "webcam", "to": "capture"},
    {"from": "capture", "to": "opencv"},
    {"from": "opencv", "to": "numpy"},
    {"from": "numpy", "to": "overlay"}
  ]
}'::jsonb WHERE title = 'Live Drawing on Webcam Feed';

UPDATE projects SET architecture = '{
  "nodes": [
    {"id": "search", "label": "Search", "level": 0},
    {"id": "api", "label": "OMDB API", "level": 1},
    {"id": "response", "label": "Response", "level": 2},
    {"id": "render", "label": "Render", "level": 3}
  ],
  "connections": [
    {"from": "search", "to": "api"},
    {"from": "api", "to": "response"},
    {"from": "response", "to": "render"}
  ]
}'::jsonb WHERE title = 'Movie Finder Application';

-- Add long descriptions
UPDATE projects SET long_description = 'A real-time crisis coordination platform built to broadcast emergency alerts and streamline public communication during natural disasters. The system features JWT-based authentication, interactive map-based notifications, and a 3D visualization dashboard for situational awareness.' WHERE title = 'Disaster Response Coordination Platform';

UPDATE projects SET long_description = 'A real-time computer vision application that enables users to draw directly over a live webcam feed. Using OpenCV for frame processing and NumPy for array operations, the application supports brush controls, color selection, eraser functionality, and undo operations.' WHERE title = 'Live Drawing on Webcam Feed';

UPDATE projects SET long_description = 'A responsive movie discovery application that retrieves dynamic movie information through the OMDB API. Users can search for movies, view ratings, plot summaries, posters, and filter results through a clean, responsive interface.' WHERE title = 'Movie Finder Application';
