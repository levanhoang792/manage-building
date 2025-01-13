# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

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

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
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
├── public/                # Static assets (không qua xử lý của Vite)
│   ├── favicon.ico
│   └── images/
├── src/                   # Thư mục chính chứa mã nguồn
│   ├── assets/            # Tài nguyên tĩnh như ảnh, font, v.v.
│   ├── components/        # Các component tái sử dụng
│   │   ├── Button.jsx
│   │   └── Header.jsx
│   ├── pages/             # Các trang chính trong ứng dụng
│   │   ├── Home.jsx
│   │   └── About.jsx
│   ├── layouts/           # Các layout chung
│   │   └── MainLayout.jsx
│   ├── hooks/             # Custom hooks
│   │   └── useAuth.js
│   ├── context/           # React Context API
│   │   └── AuthContext.jsx
│   ├── utils/             # Hàm tiện ích chung
│   │   └── formatDate.js
│   ├── styles/            # File CSS hoặc Tailwind (nếu có)
│   │   ├── index.css
│   │   └── variables.css
│   ├── App.jsx            # Component gốc của ứng dụng
│   ├── main.jsx           # File entry chính
│   └── vite-env.d.ts      # Khai báo types cho Vite (nếu dùng TypeScript)
├── .gitignore             # Danh sách các file/thư mục không đẩy lên git
├── index.html             # Template chính của ứng dụng
├── package.json           # Thông tin về dự án và dependencies
├── vite.config.js         # Cấu hình Vite
└── README.md              # Hướng dẫn và mô tả dự án
```