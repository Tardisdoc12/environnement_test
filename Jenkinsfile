pipeline {
    agent any

    environment {
        DB_HOST = credentials('db-host')
        DB_USER = credentials('db-user')
        DB_PASSWORD = credentials('db-password')
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}