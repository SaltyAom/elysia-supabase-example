import { createClient } from '@supabase/supabase-js'

const { supabase_url, supabase_service_role } = process.env

export const supabase = createClient(supabase_url!, supabase_service_role!)
