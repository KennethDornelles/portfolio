-- Migration: Add category and proficiencyLevel to technologies
-- Also fix icons to use emojis instead of placeholder URLs

-- Step 1: Add new columns
ALTER TABLE technologies 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Other',
ADD COLUMN IF NOT EXISTS "proficiencyLevel" INTEGER DEFAULT 75;

-- Step 2: Update existing technologies with proper categories and emojis
UPDATE technologies SET 
  category = 'Database',
  icon = '🐘',
  "proficiencyLevel" = 90
WHERE LOWER(name) = 'postgresql';

UPDATE technologies SET 
  category = 'Frontend',
  icon = '⚛️',
  "proficiencyLevel" = 95
WHERE LOWER(name) = 'react';

UPDATE technologies SET 
  category = 'Backend',
  icon = '🟢',
  "proficiencyLevel" = 90
WHERE LOWER(name) LIKE '%node%' OR LOWER(name) = 'nodejs';

UPDATE technologies SET 
  category = 'Backend',
  icon = '🏰',
  "proficiencyLevel" = 90
WHERE LOWER(name) LIKE '%nest%';

UPDATE technologies SET 
  category = 'Other',
  icon = '📘',
  "proficiencyLevel" = 95
WHERE LOWER(name) = 'typescript';

UPDATE technologies SET 
  category = 'DevOps',
  icon = '🐳',
  "proficiencyLevel" = 85
WHERE LOWER(name) = 'docker';

UPDATE technologies SET 
  category = 'Frontend',
  icon = '🅰️',
  "proficiencyLevel" = 95
WHERE LOWER(name) = 'angular';

UPDATE technologies SET 
  category = 'Frontend',
  icon = '💚',
  "proficiencyLevel" = 70
WHERE LOWER(name) LIKE '%vue%';

UPDATE technologies SET 
  category = 'Frontend',
  icon = '▲',
  "proficiencyLevel" = 80
WHERE LOWER(name) LIKE '%next%';

UPDATE technologies SET 
  category = 'Database',
  icon = '🐬',
  "proficiencyLevel" = 85
WHERE LOWER(name) = 'mysql';

UPDATE technologies SET 
  category = 'Database',
  icon = '🍃',
  "proficiencyLevel" = 80
WHERE LOWER(name) LIKE '%mongo%';

UPDATE technologies SET 
  category = 'Database',
  icon = '🔴',
  "proficiencyLevel" = 75
WHERE LOWER(name) = 'redis';

UPDATE technologies SET 
  category = 'Backend',
  icon = '🚂',
  "proficiencyLevel" = 85
WHERE LOWER(name) = 'express';

UPDATE technologies SET 
  category = 'Backend',
  icon = '🐍',
  "proficiencyLevel" = 70
WHERE LOWER(name) = 'python';

UPDATE technologies SET 
  category = 'DevOps',
  icon = '☸️',
  "proficiencyLevel" = 70
WHERE LOWER(name) = 'kubernetes';

UPDATE technologies SET 
  category = 'DevOps',
  icon = '⚙️',
  "proficiencyLevel" = 85
WHERE LOWER(name) LIKE '%github%' OR LOWER(name) LIKE '%ci%cd%';

UPDATE technologies SET 
  category = 'Mobile',
  icon = '📱',
  "proficiencyLevel" = 75
WHERE LOWER(name) LIKE '%react native%';

UPDATE technologies SET 
  category = 'Mobile',
  icon = '🦋',
  "proficiencyLevel" = 60
WHERE LOWER(name) = 'flutter';

UPDATE technologies SET 
  category = 'Cloud',
  icon = '☁️',
  "proficiencyLevel" = 80
WHERE LOWER(name) IN ('aws', 'azure', 'gcp');

UPDATE technologies SET 
  category = 'Other',
  icon = '🔧',
  "proficiencyLevel" = 85
WHERE LOWER(name) = 'git';

UPDATE technologies SET 
  category = 'Other',
  icon = '📦',
  "proficiencyLevel" = 80
WHERE LOWER(name) = 'prisma';

UPDATE technologies SET 
  category = 'Other',
  icon = '🌍',
  "proficiencyLevel" = 85
WHERE LOWER(name) = 'graphql';

UPDATE technologies SET 
  category = 'Other',
  icon = '🔌',
  "proficiencyLevel" = 90
WHERE LOWER(name) LIKE '%rest%' OR LOWER(name) = 'api';

-- Step 3: Set default emoji for any remaining technologies without proper icons
UPDATE technologies 
SET icon = '⚡'
WHERE icon IS NULL 
   OR icon LIKE '%icon-url%'
   OR icon LIKE '%http%'
   OR LENGTH(icon) > 10;

-- Done!
SELECT name, icon, category, "proficiencyLevel" FROM technologies ORDER BY category, name;
