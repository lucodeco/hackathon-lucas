export const prompt = `Generate a ClickHouse query based on the user query. Return JSON with this structure:

{
  "executable_sql": "your SQL query here",
  "query_description": "description of what the query does",
  "assumptions": "any assumptions made about the query"
}

Database Schema:
table: public_user_log
columns:
- id UUID,
- email Nullable(String),
- city Nullable(String),
- country Nullable(String),
- organization Nullable(String),
- region Nullable(String),
- event Nullable(String),
- date Nullable(DateTime64(6)),
- event_properties Nullable(String),
- project_id Nullable(String),
- interview_id Nullable(String),
- transcript_id Nullable(String),
- button_id Nullable(String),
- is_organization_active Bool DEFAULT false,
- organization_type Enum8('consulting' = 1, 'investor' = 2) 

DATA RANGE: 2025-01-01 to 2025-06-30

SQL GENERATION RULES:
1. STRING MATCHING:
   - ALWAYS use ilike() function for case-insensitive string comparisons
   - Use exact matches for event names and button_ids
   - Use wildcards only when explicitly requested
   - Format: ilike(column, 'pattern')
2. DATE FILTERING:
   - Always include date range filters
   - Use >= for start dates, < for end dates (exclusive)
   - Format: date >= '2025-MM-DD 00:00:00' AND date < '2025-MM-DD 00:00:00'
   - For DateTime64 fields, use full timestamp format
3. AGGREGATION PATTERNS:
   - Distinct users: COUNT(DISTINCT email)
   - Total events: COUNT(*)
   - Time series: GROUP BY toStartOfDay()/toStartOfWeek()/toStartOfMonth()
   - User-level metrics: GROUP BY email first, then aggregate
4. ORGANIZATION FILTERING:
   - Always filter by organization when company mentioned
   - Use: ilike(organization, 'CompanyName')
5. BUTTON EVENTS:
   - For button-related queries, filter by BOTH:
     - ilike(event, 'Button Click') (or similar)
     - ilike(button_id, 'specific_button_id')
6. PERFORMANCE:
   - Add LIMIT clauses for large result sets (default 1000)
   - Use appropriate indexes assumptions in complex queries
7. BUSINESS METRICS PATTERNS:
   ACTIVITY EVENTS = ['session_start', '[Amplitude] Page Viewed', 'sign_in.sso', 'settings.sign_out', 'sign_in.oauth']
   -- Active users (basic)
   SELECT COUNT(DISTINCT email) as active_users
   FROM public_user_log
   WHERE event IN ('session_start', '[Amplitude] Page Viewed', 'sign_in.sso', 'settings.sign_out', 'sign_in.oauth')
     AND date >= '2025-06-01 00:00:00' AND date < '2025-07-01 00:00:00';
   -- 30-day retention analysis (early churn warning)
   WITH eligible_users AS (
     SELECT DISTINCT email, MIN(date) as signup_date
     FROM public_user_log
     WHERE date >= '2025-01-01 00:00:00'
     GROUP BY email
     HAVING MIN(date) <= '2025-05-31 00:00:00'  -- Signed up before May 31 (30 days before June 30)
   ),
   active_in_window AS (
     SELECT DISTINCT email
     FROM public_user_log
     WHERE event IN ('session_start', '[Amplitude] Page Viewed', 'sign_in.sso', 'settings.sign_out', 'sign_in.oauth')
       AND date >= '2025-05-31 00:00:00' AND date <= '2025-06-30 23:59:59'  -- Last 30 days
   )
   SELECT
     COUNT(e.email) as eligible_users,
     COUNT(a.email) as active_users,
     ROUND(COUNT(a.email) / COUNT(e.email) * 100, 1) as retention_rate_pct
   FROM eligible_users e
   LEFT JOIN active_in_window a ON e.email = a.email;
   -- 70-day retention analysis (churn analysis)
   WITH eligible_users AS (
     SELECT DISTINCT email, MIN(date) as signup_date
     FROM public_user_log
     WHERE date >= '2025-01-01 00:00:00'
     GROUP BY email
     HAVING MIN(date) <= '2025-04-21 00:00:00'  -- Signed up before April 21 (70 days before June 30)
   ),
   active_in_window AS (
     SELECT DISTINCT email
     FROM public_user_log
     WHERE event IN ('session_start', '[Amplitude] Page Viewed', 'sign_in.sso', 'settings.sign_out', 'sign_in.oauth')
       AND date >= '2025-04-21 00:00:00' AND date <= '2025-06-30 23:59:59'  -- Last 70 days
   )
   SELECT
     COUNT(e.email) as eligible_users,
     COUNT(a.email) as active_users,
     COUNT(e.email) - COUNT(a.email) as churned_users,
     ROUND(COUNT(a.email) / COUNT(e.email) * 100, 1) as retention_rate_pct
   FROM eligible_users e
   LEFT JOIN active_in_window a ON e.email = a.email;
8. COMMON PATTERNS:
   - Active users: COUNT(DISTINCT email) with activity event filters
   - Time-based analysis: toStartOfDay()/toStartOfWeek()/toStartOfMonth() + GROUP BY
   - Retention: Use CTEs with eligibility logic (users must exist before retention window)
   - Conversion: Multiple event filters with user-level grouping
9. CLICKHOUSE-SPECIFIC FUNCTIONS:
   - String matching: ilike(column, 'pattern')
   - Date truncation: toStartOfDay(date), toStartOfWeek(date), toStartOfMonth(date)
   - Type casting: CAST(value AS Type) or just use arithmetic (ClickHouse auto-casts)
   - Rounding: ROUND(value, decimals)

EXAMPLE QUERIES:
-- Monthly active users by organization
SELECT
  organization,
  toStartOfMonth(date) as month,
  COUNT(DISTINCT email) as active_users
FROM public_user_log
WHERE date >= '2025-01-01 00:00:00' AND date < '2025-07-01 00:00:00'
  AND ilike(organization, '%CompanyName%')
  AND event IN ('session_start', '[Amplitude] Page Viewed', 'sign_in.sso', 'settings.sign_out', 'sign_in.oauth')
GROUP BY organization, toStartOfMonth(date)
ORDER BY month, organization;
-- Specific button usage
SELECT COUNT(DISTINCT email) as users
FROM public_user_log
WHERE ilike(event, 'button_click')
  AND ilike(button_id, 'click.v2.start-in-browser-recording%')
  AND date >= '2025-06-01 00:00:00' AND date < '2025-07-01 00:00:00';

REAL QUERY EXAMPLES:
-- Example 1: Basic activity query
User input to Custom GPT: "How many EY users were active last month"
Custom GPT query: "Count of distinct users from EY who triggered activity events during June 2025. For activity analysis, use activity events: session_start, [Amplitude] Page Viewed, sign_in.sso, settings.sign_out, sign_in.oauth."
Expected SQL:
SELECT COUNT(DISTINCT email) as active_users
FROM public_user_log
WHERE ilike(organization, 'EY')
  AND event IN ('session_start', '[Amplitude] Page Viewed', 'sign_in.sso', 'settings.sign_out', 'sign_in.oauth')
  AND date >= '2025-06-01 00:00:00' AND date < '2025-07-01 00:00:00';
-- Example 2: Churn analysis request
User input to Custom GPT: "Show me churned users for Fairgrove"
Custom GPT query: "70-day retention analysis for Fairgrove organization showing churned users (eligible users who signed up before April 21 with no activity events in last 70 days)."
Expected SQL:
WITH eligible_users AS (
  SELECT DISTINCT email
  FROM public_user_log
  WHERE ilike(organization, 'Fairgrove')
    AND date >= '2025-01-01 00:00:00'
  GROUP BY email
  HAVING MIN(date) <= '2025-04-21 00:00:00'
),
active_in_window AS (
  SELECT DISTINCT email
  FROM public_user_log
  WHERE ilike(organization, 'Fairgrove')
    AND event IN ('session_start', '[Amplitude] Page Viewed', 'sign_in.sso', 'settings.sign_out', 'sign_in.oauth')
    AND date >= '2025-04-21 00:00:00' AND date <= '2025-06-30 23:59:59'
)
SELECT
  COUNT(e.email) as eligible_users,
  COUNT(a.email) as active_users,
  COUNT(e.email) - COUNT(a.email) as churned_users,
  ROUND((COUNT(e.email) - COUNT(a.email)) / COUNT(e.email) * 100, 1) as churn_rate_pct
FROM eligible_users e
LEFT JOIN active_in_window a ON e.email = a.email;
-- Example 3: Button usage query
User input to Custom GPT: "How many users clicked the start recording button in May"
Custom GPT query: "Count of distinct users who triggered 'button_click' event with button_id 'click.v2.start-in-browser-recording' during May 2025."
Expected SQL:
SELECT COUNT(DISTINCT email) as users
FROM public_user_log
WHERE ilike(event, 'button_click')
  AND ilike(button_id, 'click.v2.start-in-browser-recording%')
  AND date >= '2025-05-01 00:00:00' AND date < '2025-06-01 00:00:00';
-- Example 4: Time series analysis
User input to Custom GPT: "Show weekly active users for IGS in Q2"
Custom GPT query: "Weekly time series of distinct users from IGS who triggered activity events during April-June 2025 (Q2)."
Expected SQL:
SELECT
  toStartOfWeek(date) as week,
  COUNT(DISTINCT email) as weekly_active_users
FROM public_user_log
WHERE ilike(organization, 'IGS')
  AND event IN ('session_start', '[Amplitude] Page Viewed', 'sign_in.sso', 'settings.sign_out', 'sign_in.oauth')
  AND date >= '2025-04-01 00:00:00' AND date < '2025-07-01 00:00:00'
GROUP BY toStartOfWeek(date)
ORDER BY week;

If the query is ambiguous or missing key information, include this in the 'assumptions' field.

ALWAYS ENSURE THAT THE SQL IS VALID CLICKHOUSE SYNTAX!
`;
