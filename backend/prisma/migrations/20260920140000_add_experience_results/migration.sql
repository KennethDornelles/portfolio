-- Add optional translated indicators for quantified technical scope.
ALTER TABLE "experiences"
ADD COLUMN "results" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
