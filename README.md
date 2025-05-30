# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)
  uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast
  Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
    languageOptions: {
        // other options...
        parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
        },
    },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or
  `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
    // Set the react version
    settings: {react: {version: '18.3'}},
    plugins: {
        // Add the react plugin
        react,
    },
    rules: {
        // other rules...
        // Enable its recommended rules
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
    },
})
```

```plaintext
project-root/
├── public/
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/
│   ├── components/         # Các component dùng chung
│   │   ├── Button.tsx
│   │   └── Header.tsx
│   ├── layouts/
│   │   └── MainLayout.tsx
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── components/
│   │   │   │   └── HeroSection.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useFetchData.ts
│   │   │   ├── Home.tsx
│   │   │   └── Home.module.css
│   │   ├── About/
│   │   │   ├── components/
│   │   │   │   └── TeamSection.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useTeamData.ts
│   │   │   ├── About.tsx
│   │   │   └── About.module.css
│   ├── hooks/             # Hooks dùng chung
│   │   └── useAuth.ts
│   ├── context/           # Context API
│   │   └── AuthContext.tsx
│   ├── utils/             # Hàm tiện ích
│   │   └── formatDate.ts
│   ├── types/             # Định nghĩa type, interface toàn cục
│   │   └── index.d.ts
│   ├── styles/
│   │   ├── index.css
│   │   └── variables.css
│   ├── api/               # Thư mục quản lý API và React Query
│   │   ├── client.ts      # Cấu hình axios/fetch hoặc các client gọi API
│   │   ├── queryClient.ts # Cấu hình React Query Client
│   │   ├── hooks/        # Hooks sử dụng React Query
│   │   │   ├── useUserData.ts
│   │   │   └── useProductData.ts
│   │   └── services/     # Các service API
│   │       ├── userService.ts
│   │       └── productService.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.json          # Cấu hình TypeScript
├── .gitignore
├── index.html
├── package.json
├── vite.config.ts         # Cấu hình Vite với TypeScript
└── README.md
```

- React Hook Form (Form Validation)
    - [React Hook Form](https://react-hook-form.com/)
    - [React Hook Form - Examples](https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/#heading-how-to-integrate-zod-for-schema-validation)

- Zod (Schema Validation)
    - [Zod](https://zod.dev/?id=table-of-contents)

- React Query (Data Fetching)
    - [React Query](https://react-query.tanstack.com/)
    - [React Query - Examples](https://www.freecodecamp.org/news/react-query-tutorial/)

- Build Bundle
    - NodeJS: `v22.11.0`
    - `npm install`
    - `npm run build`