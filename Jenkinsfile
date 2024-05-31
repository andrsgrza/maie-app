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
                sh 'docker build -t maie-app-img -f Dockerfile .'
            }
        }
        stage('Test') {
            steps {
                echo "running tests..."
            }
        }
        stage('Start') {
            steps {
                sh 'docker run -p 3001:8080 maie-app-img'
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
