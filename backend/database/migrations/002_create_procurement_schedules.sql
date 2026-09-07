CREATE TABLE procurement_schedules (
    id SERIAL PRIMARY KEY,

    procurement_center_id INTEGER NOT NULL,

    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    capacity INTEGER NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_schedule_procurement_center
        FOREIGN KEY (procurement_center_id)
        REFERENCES procurement_centers(id)
        ON DELETE CASCADE,

    CONSTRAINT schedule_capacity_check
        CHECK (capacity > 0),

    CONSTRAINT schedule_time_check
        CHECK (end_time > start_time),

    CONSTRAINT unique_procurement_schedule
        UNIQUE (
            procurement_center_id,
            schedule_date,
            start_time,
            end_time
        )
);

CREATE INDEX idx_schedules_center
    ON procurement_schedules(procurement_center_id);

CREATE INDEX idx_schedules_date
    ON procurement_schedules(schedule_date);

CREATE INDEX idx_schedules_status
    ON procurement_schedules(status);

CREATE INDEX idx_schedules_center_date
    ON procurement_schedules(procurement_center_id, schedule_date);