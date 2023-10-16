module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
    },
    "extends": [
        // "eslint:recommended",
        "plugin:react/recommended",
        "airbnb",
        "plugin:prettier/recommended",
        "plugin:import/typescript",
        "prettier",

        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:react-hooks/recommended",
    ],
    "overrides": [
        {
            "env": {
                "node": true,
            },
            "files": [
                ".eslintrc.{js,cjs}",
            ],
            "parserOptions": {
                "sourceType": "script",
            },
        },
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": "latest",
        "sourceType": "module",
    },
    "plugins": [
        "react",
        "@typescript-eslint",
        "prettier",
        "react-hooks",
        "no-autofix",
    ],
    rules: {
        "array-bracket-spacing": "warn",
        "comma-dangle": [
          "error",
          {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
            functions: "never",
          },
        ],
        eqeqeq: "warn",
        "consistent-return": "warn",
        "no-underscore-dangle": [
          "error",
          { allow: ["_moddle", "_bpmnFactory", "_getPaletteEntries", "_decision", "_definitions"] },
        ],
        "no-multiple-empty-lines": "error",
        "no-use-before-define": "off",
        "no-restricted-syntax": "off",
        "no-prototype-builtins": "off",
        "no-nested-ternary": "warn",
        "object-curly-spacing": "warn",
        "react/require-default-props": "off",
        "react/jsx-filename-extension": [1, { extensions: [".ts", ".tsx"] }],
        "react/prop-types": "off",
        "react/jsx-wrap-multilines": "off",
        "react/jsx-one-expression-per-line": "off",
        "jsx-a11y/alt-text": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/label-has-for": "off",
        "jsx-a11y/no-autofocus": "warn",
        "jsx-a11y/no-noninteractive-tabindex": "warn",
        "jsx-a11y/anchor-is-valid": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "no-unused-vars": "off",
        "import/no-extraneous-dependencies": [
          "error",
          {
            devDependencies: [
              "**/*.stor@(y|ies).@(js|jsx|ts|tsx)",
              "**/*.stor@(y|ies).mock.@(js|jsx|ts|tsx)",
              "**/__tests__/**/*.@(js|jsx|ts|tsx)",
              "**/*.@(test|spec).@(js|jsx|ts|tsx)",
              "src/stories/**.@(js|jsx|ts|tsx)",
              "**/*.mock.@(js|jsx|ts|tsx)",
              "src/actRender.ts",
              "**/src/setupTests.ts",
              "src/vite.config.ts",
            ],
          },
        ],
        "import/no-unresolved": "off",
        "import/prefer-default-export": "off", // Allow single Named-export
        "import/extensions": 0, // TODO
        // "import/extensions": [
        //   "error",
        //   "ignorePackages",
        //   {
        //     ts: "never",
        //     tsx: "never",
        //   },
        // ],
        "prettier/prettier": "off",
        "react-hooks/rules-of-hooks": "error", // Проверяем правила хуков
        "react-hooks/exhaustive-deps": "error", // Проверяем зависимости эффекта
    
        // note you must disable the base rule as it can report incorrect errors
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "no-param-reassign": [
          "error",
          {
            props: true,
            ignorePropertyModificationsForRegex: ["^draft"],
            ignorePropertyModificationsFor: ["acc"],
          },
        ],
    
        // require or disallow use of semicolons instead of ASI
        semi: ["error", "always"],
    
        // enforce spacing before and after semicolons
        "semi-spacing": ["error", { before: false, after: true }],
    
        // Enforce location of semicolons
        // https://eslint.org/docs/rules/semi-style
        "semi-style": ["error", "last"],
        "react/function-component-definition": 0, // TODO
        "default-param-last": 0, // TODO
        "no-useless-backreference": 0, // TODO
        "react/no-unstable-nested-components": 0, // TODO
        "react/destructuring-assignment": 0, // TODO
        "react/no-unused-prop-types": 0, // TODO
        "react/jsx-no-useless-fragment": 0, // TODO
        "no-dupe-else-if": 0, // TODO
        "class-methods-use-this": 0, // TODO
        "no-restricted-exports": 0, // TODO
        "no-unsafe-optional-chaining": 0, // TODO
      },
};
