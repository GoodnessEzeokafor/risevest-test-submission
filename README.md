
# RISEVEST SENIOR BACKEND TEST SUBMISSION

---

## Table of Contents
1. [Task Overview](#task-overview)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Submission Evaluation](#submission-evaluation)
5. [Notes](#notes)

---

## Task Overview

This submission is for the Risevest Senior Backend Test. The task involves creating a backend application that meets certain requirements and follows best practices.

[Learn more about the task](https://github.com/risevest/senior-backend-test)

---

## Project Structure

The project is divided into two main sections:

### Shared

- **Location:** `src/shared`
- **Purpose:** Contains data transfer objects (DTOs), types, and enums used across different modules

### Modules

- **Location:** `src/modules`
- **Purpose:** Houses the core functionalities and features of the application

---

## Getting Started

To begin working with the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/GoodnessEzeokafor/risevest-test-submission.git
   ```

2. Install dependencies:
   ```bash
   npm i
   ```

3. Set up environment variables:
   ```bash
   cp .env.sample .env
   ```
   Edit `.env` file with your configuration details

4. Start the server:
   ```bash
   npm run start:dev
   ```

---

## Submission Evaluation

To assess the submission, refer to these resources:

1. **Live API:** 
   [https://risevest-test-submission-production.up.railway.app](https://risevest-test-submission-production.up.railway.app)

2. **Source Code:**
   [GitHub Repository](https://github.com/GoodnessEzeokafor/risevest-test-submission)

3. **API Documentation:**
   [Postman Documentation](https://documenter.getpostman.com/view/24047717/2sA2xpU9fv)

---

## Optimized Query

This SQL query is used in the `TopPost` service:

```sql
WITH latest_comments AS (
    SELECT posts."userId", posts.id AS postId, MAX(comments."createdAt") AS latestCommentTime
    FROM posts
    LEFT JOIN comments ON posts.id = comments."postId"
    GROUP BY posts."userId", posts.id
),
user_posts_count AS (
    SELECT posts."userId", COUNT(*) AS postCount
    FROM posts
    GROUP BY posts."userId"
),
ranked_users AS (
    SELECT u.id, u."fullName", p.title, c.comment, uc.postCount,
           ROW_NUMBER() OVER (ORDER BY uc.postCount DESC) AS rank
    FROM users u
    JOIN posts p ON u.id = p."userId"
    JOIN latest_comments lc ON p.id = lc.postId
    JOIN comments c ON lc.postId = c."postId" AND lc.latestCommentTime = c."createdAt"
    JOIN user_posts_count uc ON u.id = uc."userId"
)
SELECT id, "fullName", title, "comment"
FROM ranked_users
WHERE rank <= 3;
```

---

## Testing

Tests are located in each controller folder. Run tests using:

```bash
npm run test
```

---

## Notes

* This submission uses NestJS modules instead of Uncle Bob's clean architecture principles, prioritizing simplicity over complexity.
* Database queries are optimized using select statements and eager loading techniques.
