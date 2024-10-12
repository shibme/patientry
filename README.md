# Patientry

Patientry is a demo web application designed to manage patient information demonstrating the use of FastAPI with SQLite and a simple frontend using HTML, CSS, and JavaScript.

## Features

- Add new patients
- Edit existing patient information
- List all patients
- Search patients by name

## Technologies Used

- **Backend**: FastAPI
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite with SQLAlchemy
- **Others**: Bootstrap for styling

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/Patientry.git
    cd Patientry
    ```

2. Create a virtual environment and activate it:
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```

3. Install the required dependencies:
    ```sh
    pip install -r app/requirements.txt
    ```

4. Run the application:
    ```sh
    uvicorn app.main:app --reload --port 8888
    ```

5. Open your browser and navigate to `http://127.0.0.1:8888`.

## Project Structure

```plaintext
Patientry/
├── app/
│   ├── frontend/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
├── .gitignore
├── .dockerignore
└── README.md
```

## API Endpoints

- `POST /api/patients/`: Create a new patient
- `GET /api/patients/`: Get list of all patients
- `GET /api/patients/?name={name}`: Search patients by name
- `GET /api/patients/{patient_id}`: Get a specific patient by ID
- `PUT /api/patients/{patient_id}`: Update a patient's information
- `DELETE /api/patients/{patient_id}`: Delete a patient

## Alternative ways to run the application

You can also run the application using Docker. To do this, follow the steps below:
```sh
docker run --rm --name patientry --pull always -v $PWD/data/:/app/data/ -p 8888:8888 ghcr.io/shibme/patientry:latest
```

This will start the application in a Docker container and you can access it by navigating to `http://localhost:8888` in your browser.