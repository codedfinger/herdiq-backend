pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'docker-login', passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USERNAME')]) {
            def dockerImageName = 'tare-backend'
            def dockerImageTag = 'latest'
            
            // Build the Docker image
            def dockerImage = docker.build("${dockerImageName}:${dockerImageTag}", '.')

            // Tag the Docker image
            dockerImage.tag("${DOCKER_HUB_USERNAME}/${dockerImageName}:${dockerImageTag}")

            // Push the Docker image
            docker.withRegistry("https://index.docker.io/v1/", DOCKER_HUB_USERNAME, DOCKER_HUB_PASSWORD) {
              dockerImage.push()
            }
          }
        }
      }
    }
  }
}
