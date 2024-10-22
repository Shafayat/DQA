### Strategy Outline

To design a scalable dynamic question assignment system for different regions with varying cycle lengths, we need to ensure that the solution efficiently assigns questions from a pre-determined question set to users based on the current cycle. This requires proper time management, user segmentation by region, and database management for optimal question storage and retrieval.

### Solution Architecture

1. **Time-Based Cycles**: 
   - Use a job scheduler like `node-cron` to ensure that every week (or based on configurable cycle duration), new questions are assigned.
   - For each region, maintain a separate cycle counter that increments based on the cycle duration, ensuring that each region gets a question from its corresponding set.

2. **Data Modeling**: 
   - Use MongoDB for its scalability, flexibility, and ease of handling document-based data.
   - Store questions in a collection, with each question mapped to a specific region.
   - Track each region’s current cycle in a separate collection, allowing different regions to follow different schedules without interfering with each other.

3. **Question Assignment**: 
   - Assign questions to users by querying the correct region's question and current cycle. This ensures all users in the same region receive the same question for that cycle.
   
4. **API Layer**: 
   - Expose an API to fetch the current question for a user based on their region. This can be done through an endpoint that takes the user's region as input and returns the question for the current cycle.

### Key Components
1. **Region-specific Question Assignment**: Each region has a different set of questions, and all users in the same region will receive the same question.
2. **Configurable Cycle Duration**: The duration of each cycle can be adjusted as per requirements.
3. **Time Management**: A scheduler updates the current question based on time.
4. **Scalability**: MongoDB’s ability to scale and shard collections will allow the system to handle millions of users across the globe.

---

### File Structure

```
/question-rotation-system
  |-- .env # shouldn't be include in git, I added it for ease of setup
  |-- app.js
  |-- config/
      |-- db.js
      |-- cron.js
  |-- models/
      |-- question.model.js
      |-- cycle.model.js
  |-- routes/
      |-- question.routes.js
  |-- controllers/
      |-- question.controller.js
  |-- package.json
  |-- README.md
```

### Explanation of Strategy

1. **Database Design**: 
   - `Question` collection stores the set of questions for each region.
   - `Cycle` collection tracks the current cycle and last cycle update for each region. This allows for independent cycle management for each region.
  
2. **Cycle Update**: 
   - The `cron` job runs at 7 PM every Monday in SGT (Singapore Time) and increments the cycle for each region, ensuring that users get the next question in the cycle.
  
3. **API Design**: 
   - App can request the current question for a specific region through the `/api/question/:region` endpoint.
   - Admin can inset question set for a region through the `/api/question` endpoint.
   - The backend queries the `Cycle` collection to get the current cycle and then fetches the corresponding question from the `Question` collection.

### Pros
- **Scalable**: MongoDB can handle large datasets and supports sharding for horizontal scaling.
- **Modular**: The cycle management is separate from the question data, making it easy to change the logic if needed.
- **Configurable**: The cycle duration is configurable for each region, allowing flexibility.

### Cons
- **Cron-based Updates**: Using `cron` requires that the server is always running, and this solution relies on the accuracy of scheduled jobs.


### HOW TOSETUP?

---

### Prerequisites:
- **Node.js** (v14 or higher)
- **MongoDB** (local or hosted like MongoDB Atlas)


### Installation:

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd <repo-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   Create a `.env` file in the root directory and add the following variables:

   ```
   DB_HOST='<your-mongodb-host>'
   DB_PORT=<your-mongodb-port>
   DB_NAME='<your-database-name>'
   APP_PORT=3000   # optional, defaults to 3000
   ```

4. **Set up MongoDB**:
   Ensure that MongoDB is running (either locally or on a service like MongoDB Atlas). You can create a new MongoDB database and note its URI for the `.env` file.

---

### Running the Application:

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Access the API**:
   The server should now be running on `http://localhost:5000` (or the port you configured).

---

### API Endpoints:

- **Insert Question Set**:
  - **POST** `/api/question`
  - **Body**: 
    ```json
    {
      "region": "US",
      "questions": ["What is your favorite color?", "What is your dream job?", "What is your hobby?"]
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Question set inserted successfully.",
      "questionSet": {
        "_id": "60d6beed6e10f13e84984817",
        "region": "US",
        "questionSet": [
          "What is your favorite color?",
          "What is your dream job?",
          "What is your hobby?"
        ],
        "__v": 0
      }
    }
    ```

- **Get Current Question for a Region**:
  - **GET** `/api/question/:region`
  - **Example**: `/api/question/US`
  - **Response** (example):
    ```json
    {
      "question": "What is your favorite color?"
    }
    ```

---

### Additional Setup:
- **Cron Job for Question Rotation**:
  - The system uses a cron job to rotate questions every 7 days at Monday 7 PM SGT.
  - The cron job is located in `config/cron.js` and can be modified if needed.

---

### Notes:

- **Error Handling**: Ensure that MongoDB is running and that the environment variables are correctly configured.
- **Scalability**: The system is designed to handle a high number of users and can be scaled with MongoDB's distributed architecture.

---