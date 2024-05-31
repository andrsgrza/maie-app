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
            when {
                branch 'main'
            }
            steps {
                sh 'docker run -dp 127.0.0.1:3000:3000 maie-app-img'
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
