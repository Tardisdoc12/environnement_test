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
                if (isUnix()) {
                    sh 'npm install'
                } else {
                    bat 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
                if (isUnix()) {
                    sh 'npm install'
                } else {
                    bat 'npm install'
                }
            }
        }
    }
}