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