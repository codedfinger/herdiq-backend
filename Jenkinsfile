pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        script {
          def dockerImageName = 'tare-backend'
          def dockerImageTag = 'latest'

          // Build the Docker image
          sh "docker build -t ${dockerImageName}:${dockerImageTag} ."
        }
      }
    }

    stage('Tag') {
      steps {
        script {
          def dockerImageName = 'tare-backend'
          def dockerImageTag = 'latest'
          def dockerHubUsername = credentials('docker-hub-username')  // Assuming you have Jenkins credentials set for Docker Hub username

          // Tag the Docker image
          sh "docker tag ${dockerImageName}:${dockerImageTag} ${dockerHubCredentials.username}/${dockerImageName}:${dockerImageTag}"
        }
      }
    }

     stage('Push') {
      steps {
        script {
          def dockerImageName = 'tare-backend'
          def dockerImageTag = 'latest'
          def dockerHubCredentials = credentials('docker-login')  // Replace 'docker-login' with the correct credentials ID

          // Authenticate with Docker Hub
          sh "docker login -u ${dockerHubCredentials.username} -p ${dockerHubCredentials.password}"

          // Push the Docker image to Docker Hub
          sh "docker push ${dockerHubCredentials.username}/${dockerImageName}:${dockerImageTag}"
        }
      }
    }
  }
}
