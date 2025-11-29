-- Enable Realtime for Ticket System Tables
-- Run this in your Supabase SQL Editor

begin;

-- 1. Add tables to the supabase_realtime publication
alter publication supabase_realtime add table ticket_comments;
alter publication supabase_realtime add table bids;
alter publication supabase_realtime add table tickets;

-- 2. Verify replication identity (usually 'default' is fine, but 'full' ensures all columns are sent)
alter table ticket_comments replica identity full;
alter table bids replica identity full;
alter table tickets replica identity full;

commit;
