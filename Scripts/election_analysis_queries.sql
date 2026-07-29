-- ==============================================================================
-- PROJECT: ATLIQ TAMIL NADU ELECTION ANALYSIS (2021 vs 2026)
-- DATABASE: SQLite / PostgreSQL
-- DESCRIPTION: Core analytical queries for election insights.
-- ==============================================================================

-- =========================================================
-- QUERY 1: State-Wide Party Seat Tally Comparison (2021 vs 2026)
-- =========================================================
WITH Winners2021 AS (
    SELECT ac_number, party AS party_name
    FROM (
        SELECT ac_number, party, votes,
        ROW_NUMBER() OVER (PARTITION BY ac_number ORDER BY votes DESC) as rk
        FROM fact_results_2021
    ) WHERE rk=1
),
Winners2026 AS (
    SELECT ac_number, party AS party_name
    FROM (
        SELECT ac_number, party, votes,
        ROW_NUMBER() OVER (PARTITION BY ac_number ORDER BY votes DESC) as rk
        FROM fact_results_2026
    ) WHERE rk=1
),
AllUniqueParties AS (
    SELECT DISTINCT party_name FROM Winners2021
    UNION
    SELECT DISTINCT party_name FROM Winners2026
)
SELECT 
    AUP.party_name AS Party,
    SUM(CASE WHEN W21.ac_number IS NOT NULL THEN 1 ELSE 0 END) AS Seats_2021,
    SUM(CASE WHEN W26.ac_number IS NOT NULL THEN 1 ELSE 0 END) AS Seats_2026
FROM AllUniqueParties AUP
LEFT JOIN Winners2021 W21 ON AUP.party_name = W21.party_name
LEFT JOIN Winners2026 W26 ON AUP.party_name = W26.party_name
GROUP BY AUP.party_name
ORDER BY Seats_2026 DESC, Seats_2021 DESC, Party ASC;

-- =========================================================
-- QUERY 2: Regional Seat Distribution (2026)
-- =========================================================
WITH Winners2026 AS (
    SELECT ac_number, party
    FROM (
        SELECT ac_number, party, votes,
        ROW_NUMBER() OVER (PARTITION BY ac_number ORDER BY votes DESC) as rk
        FROM fact_results_2026
    ) WHERE rk=1
)
SELECT 
    c.region AS Region,
    w.party AS Party,
    COUNT(w.ac_number) AS Seats_Won
FROM Winners2026 w
JOIN dim_constituency c ON w.ac_number = c.ac_number
GROUP BY c.region, w.party
ORDER BY c.region, Seats_Won DESC;

-- =========================================================
-- QUERY 3: Top 10 Closest Contests (Lowest Winning Margins)
-- =========================================================
WITH RankedResults AS (
    SELECT 
        ac_number, candidate, party, votes,
        ROW_NUMBER() OVER (PARTITION BY ac_number ORDER BY votes DESC) as rk
    FROM fact_results_2026
)
SELECT 
    c.ac_number AS AC_No,
    c.constituency AS Constituency,
    c.district AS District,
    w.party AS Winner_Party,
    r.party AS RunnerUp_Party,
    (w.votes - r.votes) AS Winning_Margin
FROM RankedResults w
JOIN RankedResults r ON w.ac_number = r.ac_number AND r.rk = 2
JOIN dim_constituency c ON w.ac_number = c.ac_number
WHERE w.rk = 1
ORDER BY Winning_Margin ASC
LIMIT 10;

-- =========================================================
-- QUERY 4: Flipped Constituencies (Seat Swings from 2021 to 2026)
-- =========================================================
WITH Winners2021 AS (
    SELECT ac_number, party AS winner_2021
    FROM (
        SELECT ac_number, party, 
        ROW_NUMBER() OVER (PARTITION BY ac_number ORDER BY votes DESC) as rk
        FROM fact_results_2021
    ) WHERE rk=1
),
Winners2026 AS (
    SELECT ac_number, party AS winner_2026
    FROM (
        SELECT ac_number, party, 
        ROW_NUMBER() OVER (PARTITION BY ac_number ORDER BY votes DESC) as rk
        FROM fact_results_2026
    ) WHERE rk=1
)
SELECT 
    c.ac_number AS AC_No,
    c.constituency AS Constituency,
    c.region AS Region,
    w21.winner_2021 AS Party_2021,
    w26.winner_2026 AS Party_2026
FROM dim_constituency c
JOIN Winners2021 w21 ON c.ac_number = w21.ac_number
JOIN Winners2026 w26 ON c.ac_number = w26.ac_number
WHERE w21.winner_2021 <> w26.winner_2026;

-- =========================================================
-- QUERY 5: Reserved Category Performance (GEN vs SC vs ST)
-- =========================================================
WITH Winners2026 AS (
    SELECT ac_number, party
    FROM (
        SELECT ac_number, party, votes,
        ROW_NUMBER() OVER (PARTITION BY ac_number ORDER BY votes DESC) as rk
        FROM fact_results_2026
    ) WHERE rk=1
)
SELECT 
    c.reserved AS Category,
    w.party AS Winning_Party,
    COUNT(w.ac_number) AS Seats_Won
FROM Winners2026 w
JOIN dim_constituency c ON w.ac_number = c.ac_number
GROUP BY c.reserved, w.party
ORDER BY c.reserved, Seats_Won DESC;

-- =========================================================
-- QUERY 6: Pre-Poll Alliance Performance
-- =========================================================
WITH PartyAlliance AS (
    SELECT ac_number, party, votes,
    CASE 
        WHEN party IN ('DMK', 'INC', 'VCK', 'CPI', 'CPI(M)', 'IUML') THEN 'DMK+ Alliance'
        WHEN party IN ('AIADMK', 'BJP', 'PMK', 'DMDK', 'AMMK') THEN 'AIADMK+ Alliance'
        WHEN party = 'TVK' THEN 'TVK'
        WHEN party = 'NTK' THEN 'NTK'
        ELSE 'Others / Independents'
    END AS Alliance,
    ROW_NUMBER() OVER (PARTITION BY ac_number ORDER BY votes DESC) as rk
    FROM fact_results_2026
)
SELECT 
    Alliance,
    COUNT(ac_number) AS Total_Seats_Won
FROM PartyAlliance
WHERE rk=1
GROUP BY Alliance
ORDER BY Total_Seats_Won DESC;

-- =========================================================
-- QUERY 7: Third-Party Vote Splitting / Spoiler Seats
-- =========================================================
WITH RankedResults AS (
    SELECT ac_number, candidate, party, votes,
    ROW_NUMBER() OVER (PARTITION BY ac_number ORDER BY votes DESC) as rk
    FROM fact_results_2026
),
MarginCalc AS (
    SELECT 
        w.ac_number,
        (w.votes - r.votes) AS margin
    FROM RankedResults w
    JOIN RankedResults r ON w.ac_number = r.ac_number AND r.rk = 2
    WHERE w.rk = 1
),
ThirdFourthVotes AS (
    SELECT 
        ac_number,
        SUM(votes) AS combined_3rd_4th_votes
    FROM RankedResults
    WHERE rk IN (3, 4)
    GROUP BY ac_number
)
SELECT 
    c.ac_number AS AC_No,
    c.constituency AS Constituency,
    c.region AS Region,
    m.margin AS Winning_Margin,
    tf.combined_3rd_4th_votes AS Votes_3rd_4th_Candidates
FROM MarginCalc m
JOIN ThirdFourthVotes tf ON m.ac_number = tf.ac_number
JOIN dim_constituency c ON m.ac_number = c.ac_number
WHERE tf.combined_3rd_4th_votes > m.margin
ORDER BY m.margin ASC;
