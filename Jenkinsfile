pipeline {
    agent any

    environment {
        DB_HOST = credentials('db-host')
        DB_USER = credentials('db-user')
        DB_PASSWORD = credentials('db-password')
        DB_NAME = credentials('db-name')
        API_URL = credentials('API_URL')
    }

    stages {
        stage('Build') {
            steps {
                dir('Back'){
                    bat 'npm install'
                }
                dir('front'){
                    bat 'npm install'
                }
            }
        }
        stage('Test') {
           steps {
               dir('Back'){
                    bat 'npm test'
               }
               dir('front'){
                    bat 'npm test'
               }
            }
        }
    }
}
