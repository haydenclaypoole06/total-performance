CREATE TABLE public.project_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  vehicle text NOT NULL,
  current_modifications text,
  request text NOT NULL,
  budget text,
  timeframe text
);

GRANT INSERT ON public.project_inquiries TO anon;
GRANT ALL ON public.project_inquiries TO service_role;

ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit inquiries"
ON public.project_inquiries
FOR INSERT
TO anon
WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(email) BETWEEN 3 AND 255
  AND (phone IS NULL OR char_length(phone) <= 40)
  AND char_length(vehicle) BETWEEN 1 AND 150
  AND (current_modifications IS NULL OR char_length(current_modifications) <= 2000)
  AND char_length(request) BETWEEN 1 AND 3000
  AND (budget IS NULL OR char_length(budget) <= 100)
  AND (timeframe IS NULL OR char_length(timeframe) <= 100)
);