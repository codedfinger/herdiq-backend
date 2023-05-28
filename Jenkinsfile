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
          def dockerHubUsername = credentials('docker-login')  // Assuming you have Jenkins credentials set for Docker Hub username

          // Tag the Docker image
          sh "docker tag ${dockerImageName}:${dockerImageTag} ${dockerHubUsername}/${dockerImageName}:${dockerImageTag}"
        }
      }
    }

    stage('Push') {
      steps {
        script {
          def dockerImageName = 'tare-backends'
          def dockerImageTag = 'latest'
          def dockerHubUsername = credentials('docker-hub-username')  // Assuming you have Jenkins credentials set for Docker Hub username
          def dockerHubPassword = credentials('docker-hub-password')  // Assuming you have Jenkins credentials set for Docker Hub password

          // Authenticate with Docker Hub
          sh "docker login -u ${dockerHubUsername} -p ${dockerHubPassword}"

          // Push the Docker image to Docker Hub
          sh "docker push ${dockerHubUsername}/${dockerImageName}:${dockerImageTag}"
        }
      }
    }
  }
}
