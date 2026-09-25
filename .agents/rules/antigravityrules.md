---
trigger: always_on
---

# Global Assistant Rules (Frontend - Feature-Based React)

# Tech Stack
- **Frontend:** React with TypeScript.
- **API Client:** Axios (configured in `src/api/`).
- **State Management:** Context API and Custom Hooks.

## 1. Project Architecture & Directory Structure
- **Root Directory:** All logic must reside inside `src/`.
- **Global Folders (Shared Kernel):** Folders at the root of `src/` (outside `features/`) are for global, reusable logic:
  - `src/api/`: Centralized Axios instance, interceptors, and auth token management.
  - `src/constants/`: Global variables (e.g., `API_BASE_URL = 'http://back:20/'`).
  - `src/components/`: Generic UI components (Buttons, Inputs, Modals) used by multiple features.
  - `src/hooks/`: Utility hooks (e.g., `useLocalStorage`, `useDebounce`) without business logic.
  - `src/services/`: Cross-cutting API services used globally.
  - `src/utils/`: Pure helper functions.

- **Feature Modules (src/features/):** Domain-specific logic (e.g., `dashboard`, `inventory`).
  - Each feature folder is self-contained and must include: `components/`, `hooks/`, `services/`, and `types/`.
  - **Barrel Export:** Every feature **MUST** have an `index.js` or `index.ts` file to act as the public API.
  - **Clean Page Pattern:** Pages/App should only import from the feature's `index.js`. Deep imports (e.g., `features/dashboard/hooks/useX`) are forbidden.

## 2. API Communication Workflow
- **Service Pattern:** Within `src/features/[feature-name]/services/`, use the centralized Axios instance from `src/api/`.
- **URL Handling:** Do not hardcode full URLs. Use the established shorthand by appending the endpoint to the instance (e.g., `api.get('user/')`).
- **Readability:** Prioritize semantic and legible service calls.

## 3. Agent Workflow (Mandatory Protocol) ️
- **Analysis Phase:** Before writing code, present an "Implementation Plan".
- **Content:** List of files, logic summary, and potential side effects.
- **Confirmation:** Wait for explicit approval before proceeding.
- **Diff Mode:** Clearly show added/removed lines during proposals.

## 4. Git & Commit Strategy
- **"Nothing to Hide" Policy:** Small, frequent, and atomic commits.
- **Trigger:** Propose a commit immediately after each small unit of work is verified.
- **Format:** Use Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`).

## 5. Coding Standards
- **Naming:** `camelCase` (vars/funcs), `PascalCase` (Components/Interfaces), `UPPER_SNAKE_CASE` (constants).
- **Prohibitions:** No short names (a, b, c) or generic names (data, info, temp). Use domain names (e.g., `isStatsLoading`).
- **Strict Typing:** No `any` type allowed. Every prop, state, and function return must be typed.

## 6. Testing & Debugging
- **Debug:** Identify the root cause before suggesting fixes. No `console.log` in final code.
- **Format:** Handle JSON responses: `{ success: boolean, data: {}, error_code: string, message: string }`.