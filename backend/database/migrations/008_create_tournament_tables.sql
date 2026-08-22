
-- CyberChess
-- Migration 008: Tournament system
-- ============================================================

-- ============================================================
-- 1. Tournaments
-- ============================================================

CREATE TABLE chess_tournaments (
    tournament_id INT AUTO_INCREMENT PRIMARY KEY,

    tournament_name VARCHAR(100) NOT NULL,
    tournament_description TEXT NULL,

    -- Tournament format:
    -- swiss         - Swiss system
    -- round_robin   - everyone plays everyone
    -- knockout      - elimination bracket
    -- groups_knockout - groups followed by knockout
    tournament_format VARCHAR(30) NOT NULL,

    -- Tournament status:
    -- draft       - being configured
    -- registration - registration is open
    -- upcoming    - registration closed, tournament hasn't started
    -- active      - tournament is currently running
    -- finished    - tournament has finished
    -- cancelled   - tournament was cancelled
    tournament_status VARCHAR(20) NOT NULL DEFAULT 'draft',

    registration_start DATETIME NULL,
    registration_end DATETIME NULL,

    start_at DATETIME NULL,
    end_at DATETIME NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_chess_tournaments_status (tournament_status),
    INDEX idx_chess_tournaments_start_at (start_at),
    INDEX idx_chess_tournaments_end_at (end_at),
    INDEX idx_chess_tournaments_format (tournament_format)
);


-- ============================================================
-- 2. Tournament participants
-- ============================================================

CREATE TABLE chess_tournament_participants (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,

    tournament_id INT NOT NULL,
    user_id INT NOT NULL,

    -- Optional starting position / seed.
    seed INT NULL,

    -- Participant status:
    -- registered - registered for tournament
    -- active     - currently participating
    -- eliminated  - eliminated
    -- finished   - completed tournament
    -- withdrawn  - withdrew from tournament
    participant_status VARCHAR(20) NOT NULL DEFAULT 'registered',

    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_chess_tournament_participant (
        tournament_id,
        user_id
    ),

    INDEX idx_chess_tournament_participants_tournament (
        tournament_id
    ),

    INDEX idx_chess_tournament_participants_user (
        user_id
    ),

    CONSTRAINT fk_chess_tournament_participants_tournament
        FOREIGN KEY (tournament_id)
        REFERENCES chess_tournaments (tournament_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_chess_tournament_participants_user
        FOREIGN KEY (user_id)
        REFERENCES chess_users (user_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 3. Tournament stages
-- ============================================================

CREATE TABLE chess_tournament_stages (
    stage_id INT AUTO_INCREMENT PRIMARY KEY,

    tournament_id INT NOT NULL,

    stage_name VARCHAR(100) NOT NULL,

    -- Stage type:
    -- swiss
    -- round_robin
    -- group
    -- knockout
    stage_type VARCHAR(20) NOT NULL,

    -- Order in which stages are played.
    stage_order INT NOT NULL DEFAULT 1,

    -- Optional group identifier.
    -- Useful for tournaments such as:
    -- Group A, Group B, Group C, etc.
    group_code VARCHAR(20) NULL,

    stage_status VARCHAR(20) NOT NULL DEFAULT 'pending',

    start_at DATETIME NULL,
    end_at DATETIME NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_chess_tournament_stages_tournament (
        tournament_id
    ),

    INDEX idx_chess_tournament_stages_order (
        tournament_id,
        stage_order
    ),

    INDEX idx_chess_tournament_stages_type (
        stage_type
    ),

    CONSTRAINT fk_chess_tournament_stages_tournament
        FOREIGN KEY (tournament_id)
        REFERENCES chess_tournaments (tournament_id)
        ON DELETE CASCADE
);


-- ============================================================
-- 4. Tournament matches
-- ============================================================

CREATE TABLE chess_tournament_matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,

    tournament_id INT NOT NULL,
    stage_id INT NOT NULL,

    -- Round inside the current stage.
    -- Examples:
    -- Swiss round 1, 2, 3...
    -- Knockout round 1 = quarterfinals, etc.
    round_number INT NOT NULL DEFAULT 1,

    -- Position of the match inside the round.
    match_number INT NOT NULL DEFAULT 1,

    player1_participant_id INT NULL,
    player2_participant_id INT NULL,

    -- Result in points.
    -- 1.0 = win
    -- 0.5 = draw
    -- 0.0 = loss
    player1_score DECIMAL(3,1) NULL,
    player2_score DECIMAL(3,1) NULL,

    winner_participant_id INT NULL,

    -- Match status:
    -- scheduled
    -- active
    -- finished
    -- cancelled
    match_status VARCHAR(20) NOT NULL DEFAULT 'scheduled',

    started_at DATETIME NULL,
    finished_at DATETIME NULL,

    -- For knockout brackets.
    -- The winner of this match can be transferred
    -- to the next match.
    next_match_id INT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_chess_tournament_matches_tournament (
        tournament_id
    ),

    INDEX idx_chess_tournament_matches_stage (
        stage_id
    ),

    INDEX idx_chess_tournament_matches_round (
        stage_id,
        round_number
    ),

    INDEX idx_chess_tournament_matches_player1 (
        player1_participant_id
    ),

    INDEX idx_chess_tournament_matches_player2 (
        player2_participant_id
    ),

    INDEX idx_chess_tournament_matches_winner (
        winner_participant_id
    ),

    CONSTRAINT fk_chess_tournament_matches_tournament
        FOREIGN KEY (tournament_id)
        REFERENCES chess_tournaments (tournament_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_chess_tournament_matches_stage
        FOREIGN KEY (stage_id)
        REFERENCES chess_tournament_stages (stage_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_chess_tournament_matches_player1
        FOREIGN KEY (player1_participant_id)
        REFERENCES chess_tournament_participants (participant_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_chess_tournament_matches_player2
        FOREIGN KEY (player2_participant_id)
        REFERENCES chess_tournament_participants (participant_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_chess_tournament_matches_winner
        FOREIGN KEY (winner_participant_id)
        REFERENCES chess_tournament_participants (participant_id)
        ON DELETE SET NULL,

    CONSTRAINT fk_chess_tournament_matches_next
        FOREIGN KEY (next_match_id)
        REFERENCES chess_tournament_matches (match_id)
        ON DELETE SET NULL
);