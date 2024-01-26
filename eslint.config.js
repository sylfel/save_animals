import tsParser from '@typescript-eslint/parser'
import tsEsLintPlugin from '@typescript-eslint/eslint-plugin'
import js from '@eslint/js'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    js.configs.recommended,
    // tsEsLintPlugin.configs.recommended,
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 12,
                sourceType: 'module',
            },
        },
        files: ['**/*.js', '**/*.ts'],
        plugins: {
            tsEsLintPlugin,
        },
        rules: {
            'no-unused-vars': 'off',
            'tsEsLintPlugin/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_' },
            ],
            // to enforce using type for object type definitions, can be type or interface
            'tsEsLintPlugin/consistent-type-definitions': ['error', 'type'],
        },

        // env: {
        //     browser: true,
        //     es2021: true,
        // },
    },
]
