-- Cập nhật bảng door_requests để thêm trường reason
ALTER TABLE door_requests
    ADD COLUMN reason TEXT AFTER processed_at;