-- Add thingsboard_device_id column to doors table
ALTER TABLE doors
ADD COLUMN thingsboard_device_id VARCHAR(255) NULL AFTER lock_status,
ADD COLUMN thingsboard_access_token VARCHAR(255) NULL AFTER thingsboard_device_id;

-- Add index for faster lookups
CREATE INDEX idx_thingsboard_device_id ON doors(thingsboard_device_id); 