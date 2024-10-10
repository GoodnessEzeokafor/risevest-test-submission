# RISEVEST SENIOR BACKEND TEST SUBMISSION

---

## Task 
[Risevest Senior Backend Test](https://github.com/risevest/senior-backend-test)


### Shared

- **Where to Find**: `src/shared`
- **What It Does**: Contains dto, types, enums that are shared across the different modules

### Modules

- **Where to Find**: `src/modules`
- **What It Does**: The module folder contains the functionalities and features


## Getting Around the Codebase

To easily navigate through the different parts of the codebase, you can follow these links:

- [Modules](src/modules)
- [Shared](src/shared)


This structure is designed to make it easier for you to understand and navigate through the codebase, providing a clear and organized overview.

### Getting Started with the Application

Follow these simple steps to set up and run the application:

1. **Clone the Repository**: First, you need to clone the repository to your local machine. Open your terminal and run the following command:

   ```bash
   git clone https://github.com/GoodnessEzeokafor/risevest-test-submission.git
   ```

2. **Install Dependencies**: Once the repository is cloned, navigate into the project directory and install the necessary packages. You can do this by running:

   ```bash
   npm i
   ```

3. **Configure Environment Variables**: Before running the application, you'll need to set up your environment variables. Copy the sample environment file and create a new `.env` file by running:

   ```bash
   cp .env.sample .env
   ```

   Then, open the `.env` file and fill in your specific configuration details.

4. **Start the Server**: Finally, you're ready to start the server. Run the following command to start the application in development mode:
   ```bash
   npm run start:dev
   ```

Now, your application should be up and running! You can access it through your web browser or any API client at the address provided in the terminal.

### Submission Evaluation

To evaluate my submission, you can access the following resources:

1. **Live API**: You can interact with the deployed API directly by visiting the [Live URL](https://risevest-test-submission-production.up.railway.app). This will allow you to see the application in action and test its functionality.

2. **Source Code**: The complete source code for this submission is available on [GitHub](https://github.com/GoodnessEzeokafor/risevest-test-submission). You can review the code, run it locally, or contribute to the project if you wish.

3. **API Documentation**: For detailed information on the API endpoints, including request and response formats, you can refer to the [Postman Documentation](https://documenter.getpostman.com/view/24047717/2sA2xpU9fv). This documentation provides a comprehensive guide to understanding and using the API effectively.



- **Optimized Query**
  Used in [TopPost](src/modules/post/post.service.ts)

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

### Run test

- Tests are stored in each controller folder

```
npm run test
```

These resources should provide you with a comprehensive view of my submission, allowing you to assess its quality and functionality.
