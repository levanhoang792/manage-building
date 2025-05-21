# Node.js Server

This is an independent Node.js server project with @ import pattern.

## Setup

1. Install dependencies:

```
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development
```

## Running the Server

### Development mode

```
npm run dev
```

### Production mode

```
npm start
```

## API Endpoints

- `GET /`: Welcome message
- `GET /api/hello`: Sample API endpoint
- `GET /api/info/project`: Project information
- `GET /api/info/paths`: Project paths

### Door Lock API Endpoints

- `GET /api/buildings/:buildingId/floors/:floorId/doors/:id/lock-history`: Get door lock history
  - **Description**: Retrieves the history of door lock status changes
  - **Authentication**: Required (JWT token)
  - **Permission**: `door.lock.view`
  - **URL Parameters**:
    - `buildingId`: ID of the building
    - `floorId`: ID of the floor
    - `id`: ID of the door
  - **Query Parameters**:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
    - `startDate`: Filter by start date (ISO format)
    - `endDate`: Filter by end date (ISO format)
    - `sortBy`: Field to sort by (default: 'created_at')
    - `sortOrder`: Sort order (asc/desc, default: 'desc')
  - **Response**: JSON object containing:
    - `data`: Array of door lock history records
    - `total`: Total number of records
    - `page`: Current page number
    - `limit`: Items per page
    - `door`: Detailed door information

- `PUT /api/buildings/:buildingId/floors/:floorId/doors/:id/lock`: Update door lock status
  - **Description**: Changes the lock status of a door
  - **Authentication**: Required (JWT token)
  - **Permission**: `door.lock.manage`
  - **URL Parameters**:
    - `buildingId`: ID of the building
    - `floorId`: ID of the floor
    - `id`: ID of the door
  - **Request Body**:
    - `lock_status`: New lock status ('open' or 'closed')
    - `reason`: Optional reason for the status change
    - `request_id`: Optional request ID if the change is due to a request
  - **Response**: JSON object containing the updated door information

- `GET /api/buildings/:buildingId/floors/:floorId/doors/:id/lock-reports`: Get door access reports
  - **Description**: Generates reports about door access patterns
  - **Authentication**: Required (JWT token)
  - **Permission**: `door.lock.view`
  - **URL Parameters**:
    - `buildingId`: ID of the building
    - `floorId`: ID of the floor (can be 'all' to include all floors)
    - `id`: ID of the door (can be 'all' to include all doors)
  - **Query Parameters**:
    - `report_type`: Type of report to generate (default: 'summary')
      - `summary`: General summary of door access events
      - `frequency`: Frequency of door access events over time
      - `user_activity`: Door access events by user
      - `time_analysis`: Analysis of door access patterns by time of day
      - `door_comparison`: Comparison of access patterns across different doors
    - `start_date`: Filter by start date (ISO format)
    - `end_date`: Filter by end date (ISO format)
    - `group_by`: Group frequency data by time period (default: 'day')
      - Options: 'hour', 'day', 'week', 'month', 'year'
    - `format`: Output format (default: 'json')
      - Options: 'json', 'csv'
  - **Response**: 
    - For JSON format: JSON object containing the report data
    - For CSV format: CSV file download with the report data

## Project Structure

```
nodejs/
├── src/
│   ├── config/
│   │   └── app.js
│   ├── controllers/
│   │   └── helloController.js
│   ├── middleware/
│   │   └── logger.js
│   ├── routes/
│   │   ├── index.js
│   │   └── info.js
│   ├── utils/
│   │   └── pathExample.js
│   └── index.js
├── .env
├── .gitignore
├── jsconfig.json
├── package.json
└── README.md
```

## @ Import Pattern

This project uses the `@/` symbol for imports to make the code more readable and maintainable. For example:

```javascript
// Instead of relative imports like this:
const logger = require('../middleware/logger');

// We use @/ imports like this:
const logger = require('@/src/middleware/logger');
```

### Accessing Root Directory

You can use `@/` to access files in the root directory:

```javascript
// Import package.json from root
const packageInfo = require('@/package.json');

// Get path to a file in the project
const path = require('path');
const rootPath = path.join(require('@/'), 'some-file.js');
```

The following aliases are configured:

- `@/` - Points to the project root directory
- `@/src` - Points to the `src` directory
- `@/src/routes` - Points to the `src/routes` directory
- `@/src/middleware` - Points to the `src/middleware` directory
- `@/src/controllers` - Points to the `src/controllers` directory
- `@/src/config` - Points to the `src/config` directory
- `@/src/utils` - Points to the `src/utils` directory

To add more aliases:

1. Update the `_moduleAliases` section in `package.json`
2. Update the `paths` section in `jsconfig.json`

## Expanding the Project

Feel free to expand this project by adding:

- Models
- Database connections
- Authentication
- More controllers and routes
- etc.
