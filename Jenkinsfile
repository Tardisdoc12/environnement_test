pipeline {
    agent any

    environment {
        DB_HOST = credentials('db-host')
        DB_USER = credentials('db-user')
        DB_PASSWORD = credentials('db-password')
        DB_NAME = credentials('db-name')

    }

    stages {
        stage('Build') {
            steps {
                bat 'npm install Back/'
            }
        }
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
    }
}
