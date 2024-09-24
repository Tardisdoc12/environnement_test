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
                dir('Back'){
                    bat 'npm install'
                }
            }
        }
        stage('Test') {
           steps {
               dir('Back'){
                    bat 'npm test'
               }
            }
        }
    }
}
