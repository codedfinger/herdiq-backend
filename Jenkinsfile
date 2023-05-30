pipeline {
  agent any

  stages {

    stage('Checkout') {
      steps {
        // Checkout the repository
        checkout scm
      }
    }

    stage('Build') {
      steps {
        // Checkout your repository from GitHub
        checkout scm
        
        // Load environment variables
        withCredentials([
          string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
          string(credentialsId: 'MONGO_LOCAL_CONN_URL', variable: 'MONGO_LOCAL_CONN_URL'),
          string(credentialsId: 'MONGO_LOCAL_CONN_URL_PROD', variable: 'MONGO_LOCAL_CONN_URL_PROD'),
          string(credentialsId: 'MAIL_USERNAME', variable: 'MAIL_USERNAME'),
          string(credentialsId: 'MAIL_PASSWORD', variable: 'MAIL_PASSWORD'),
          string(credentialsId: 'OAUTH_CLIENTID', variable: 'OAUTH_CLIENTID'),
          string(credentialsId: 'OAUTH_CLIENT_SECRET', variable: 'OAUTH_CLIENT_SECRET'),
          string(credentialsId: 'OAUTH_REFRESH_TOKEN', variable: 'OAUTH_REFRESH_TOKEN')


        ]) {
          // Build and push Docker image, using environment variables
          sh '''
            docker build \
              --build-arg JWT_SECRET=$JWT_SECRET \
              --build-arg MONGO_LOCAL_CONN_URL=$MONGO_LOCAL_CONN_URL \
              --build-arg MONGO_LOCAL_CONN_URL_PROD=$MONGO_LOCAL_CONN_URL_PROD \
              --build-arg MAIL_USERNAME=$MAIL_USERNAME \
              --build-arg MAIL_PASSWORD=$MAIL_PASSWORD \
              --build-arg OAUTH_CLIENTID=$OAUTH_CLIENTID \
              --build-arg OAUTH_CLIENT_SECRET=$OAUTH_CLIENT_SECRET \
              --build-arg OAUTH_REFRESH_TOKEN=$OAUTH_REFRESH_TOKEN \
              --no-cache -t codedfingers/tare-backend:v1.0 \
              .
              
            docker push codedfingers/tare-backend:v1.0
          '''
        }
      }
    }

    stage('Tag') {
      steps {
        script {
          def dockerImageName = 'tare-backend'
          def dockerImageTag = 'v1.0'
          def dockerHubCredentials = credentials('docker-login')  // Replace 'docker-login' with the correct credentials ID

          // Tag the Docker image
          sh "docker tag ${dockerImageName}:${dockerImageTag} ${dockerHubCredentials.username}/${dockerImageName}:${dockerImageTag}"
        }
      }
    }

     stage('Push') {
      steps {
         withDockerRegistry([credentialsId: "docker-login", url: "https://index.docker.io/v1/"]) {
              sh "sudo docker push codedfingers/tare-backend:v1.0"
          }
      }
    }
  }
}
