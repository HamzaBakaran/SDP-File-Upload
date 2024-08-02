# File Upload System

This project is a cloud-based file upload system developed as a part of the senior design project at International Burch University. It provides a user-friendly interface for uploading, organizing, and managing files, integrated with AWS S3 for reliable storage.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)


## Project Overview

This file upload system streamlines file management and storage by leveraging modern technology for efficient functionality. The backend is built with Java Spring Boot, and the frontend is developed using React.

## Features
- **File Upload:** Users can upload files of various formats and sizes.
- **File Organization:** Users can organize files into folders or categories.
- **Search Functionality:** Users can search for files using filters or keywords.
- **User Authentication:** User authentication and authorization mechanisms control access to files.
- **Responsive UI:** The application is accessible across different devices and screen sizes.

## Technology Stack

- **Frontend:** React, TypeScript, React Bootstrap
- **Backend:** Java Spring Boot, Spring Security, AWS SDK for Java
- **Database:** MySQL
- **Storage:** AWS S3


## Setup and Installation

### Prerequisites
- Java JDK 11 or higher
- Node.js and npm
- Docker and Docker Compose
- MySQL

### Backend Setup
1. Clone the repository:
    ```sh
    git clone https://github.com/HamzaBakaran/SDP-File-Upload.git
      
    cd SDP-File-Upload/

    ```
3. Update application.properties with your MySQL and AWS S3 credentials.
4. Build the project:
    ```sh
    ./mvnw clean install
    ```
5. Run the backend server:
    ```sh
    java -jar target/SDP-File-Upload-0.0.1-SNAPSHOT.jar
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```sh
    cd /ui
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Build the project:
    ```sh
    npm run dev
    ```

## Usage
- Access the frontend application on http://localhost:5173/
- Use the application to upload, organize, search, and manage files.

## API Endpoints
The backend provides the following API endpoints:

- `POST /api/auth/login`: User login.
- `POST /api/auth/register`: User registration.
- `GET /api/s3/download`: Download a file.
- `POST /api/s3/upload`: Upload a file.
- `DELETE /api/s3/delete`: Delete a file.


