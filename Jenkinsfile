pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        jdk 'JDK-17'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        APP_NAME = 'food-delivery-partner-portal'
        SPRING_PROFILES_ACTIVE = 'test'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Environment & Tool Validation') {
            steps {
                echo 'Validating build runtime environment and tools...'
                sh 'java -version'
                sh 'mvn -version'
                sh 'git --version'
            }
        }

        stage('Compile') {
            steps {
                echo 'Compiling Java source files...'
                sh 'mvn clean compile -DskipTests'
            }
        }

        stage('Unit & Slice Testing') {
            steps {
                echo 'Executing JUnit 5 and slice test suites...'
                sh 'mvn test'
            }
            post {
                always {
                    junit testResults: 'target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        stage('Package Artifact') {
            steps {
                echo 'Packaging production Spring Boot executable JAR...'
                sh 'mvn package -DskipTests'
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts and test reports...'
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true, allowEmptyArchive: false
            }
        }
    }

    post {
        success {
            echo 'Continuous Integration Pipeline completed successfully! Ready for deployment gates.'
        }
        failure {
            echo 'Build failed! Please inspect compilation errors or test failures above.'
        }
        always {
            cleanWs deleteDirs: true, notFailBuild: true
        }
    }
}
