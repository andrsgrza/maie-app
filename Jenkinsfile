pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                docker build -t MAIE-APP-IMG Dockerfile .
            }
        }
        stage('Test') {
            steps {
                echo "running tests..."
            }
        }
        stage('Start') {
            when {
                branch 'main'
            }
            steps {
                docker run -dp 127.0.0.1:3000:3000 MAIE-APP-IMG
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed'
        }
        success {
            echo 'Pipeline succeeded'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}