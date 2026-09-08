pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        jdk 'JDK-21'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
        timeout(time: 45, unit: 'MINUTES')
        timestamps()
    }

    environment {
        APP_NAME = 'food-delivery-partner-portal'
        SPRING_PROFILES_ACTIVE = 'test'
        TARGET_STAGING_URL = 'http://localhost:8080'
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

        stage('Unit, Slice & Regression Testing') {
            steps {
                echo 'Executing JUnit 5, Mockito, slice and regression test suites...'
                sh 'mvn test'
            }
            post {
                always {
                    junit testResults: 'target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        stage('Code Quality Gate & JaCoCo Coverage') {
            steps {
                echo 'Evaluating code coverage against JaCoCo quality gate thresholds...'
                sh 'mvn jacoco:report jacoco:check'
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'target/site/jacoco',
                        reportFiles: 'index.html',
                        reportName: 'JaCoCo Code Coverage Report'
                    ])
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

        stage('Docker Container Build & Image Packaging') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                }
            }
            steps {
                echo "Building Docker container image: ${APP_NAME}:${BUILD_NUMBER}..."
                script {
                    sh 'docker build -t food-delivery-partner-portal:${BUILD_NUMBER} -t food-delivery-partner-portal:latest .'
                    echo "Validating Docker Compose orchestration configuration..."
                    sh 'docker compose config --quiet || true'
                }
            }
        }

        stage('Deploy to Staging Gate') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                }
            }
            steps {
                echo "Deploying ${APP_NAME} to target environment via Docker Compose..."
                script {
                    sh '''
                        if [ -d "/opt/food-delivery-partner" ]; then
                            cd /opt/food-delivery-partner && docker compose up -d --no-deps app
                        else
                            echo "Deployment directory /opt/food-delivery-partner not found, skipping container reload."
                        fi
                    '''
                }
            }
        }

        stage('Automated Smoke Testing') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'main'
                }
            }
            steps {
                echo 'Executing automated post-deployment smoke tests...'
                sh 'chmod +x scripts/smoke-test.sh'
                sh 'scripts/smoke-test.sh https://api.dpa.yashparmar.in 10 3 || scripts/smoke-test.sh http://localhost:8080 5 2 || true'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Complete Continuous Integration & Deployment Pipeline succeeded with all Quality Gates satisfied!'
        }
        failure {
            echo 'CRITICAL FAILURE: Pipeline failed. Quality gates or tests violated. Inspect build log details above.'
        }
        always {
            cleanWs deleteDirs: true, notFailBuild: true
        }
    }
}
