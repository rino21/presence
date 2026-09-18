pipeline {

    agent any

    environment {

        REGISTRY = "ghcr.io" // ghcr.io/OWNER/IMAGE_NAME:TAG

        REGISTRY_IMAGE = "ghcr.io/rino21/presence"

        REGISTRY_USER = credentials('registry-user')

        REGISTRY_PASSWORD = credentials('registry-password')

        SSH_KEY = credentials('ssh-private-key')
        
        DEPLOYEMENT_USER = "rino"
        
        DEPLOYEMENT_IP = "192.168.40.137"

        PATH_COMPOSE = "/home/rino/project/presence"
    }

    stages {

        // =========================================================
        // BUILD FRONT
        // =========================================================
        stage('Build Front Staging') {

            when {
                anyOf{
                    changeset "presence-front/**"
                    changeset "Jenkinsfile"
                }
            }

            steps {

                sh '''
                    set -e

                    echo "$REGISTRY_PASSWORD" | docker login $REGISTRY \
                    -u "$REGISTRY_USER" \
                    --password-stdin

                    docker build \
                    -t $REGISTRY_IMAGE/staging/front:dev \
                    -f presence-front/Dockerfile \
                    presence-front/

                    docker push \
                    $REGISTRY_IMAGE/staging/front:dev

                    docker logout $REGISTRY
                '''
            }
        }

        // =========================================================
        // BUILD API
        // =========================================================
        stage('Build API Staging') {

            when {
                anyOf {
                    changeset "presence-api/**"
                    changeset "Jenkinsfile"
                }
            }

            steps {

                sh '''
                    set -e

                    echo "$REGISTRY_PASSWORD" | docker login $REGISTRY \
                    -u "$REGISTRY_USER" \
                    --password-stdin

                    docker build \
                    -t $REGISTRY_IMAGE/staging/api:dev \
                    -f presence-api/Dockerfile \
                    presence-api/

                    docker push \
                    $REGISTRY_IMAGE/staging/api:dev

                    docker logout $REGISTRY
                '''
            }
        }

        // =========================================================
        // DEPLOY
        // =========================================================
        stage('Deploy Staging') {

            // when {
            //     branch 'main'
            // }

            steps {
                sshagent(credentials: ['ssh-private-key']) {
                    sh """
                        scp -o StrictHostKeyChecking=no docker-compose-dev.yml \\
                            ${DEPLOYEMENT_USER}@${DEPLOYEMENT_IP}:${PATH_COMPOSE}/docker-compose.yml

                        ssh -o StrictHostKeyChecking=no \\
                            ${DEPLOYEMENT_USER}@${DEPLOYEMENT_IP} '
                                set -e
                                cd ${PATH_COMPOSE}
                                echo "'\$REGISTRY_PASSWORD'" | docker login "'\$REGISTRY'" -u "'\$REGISTRY_USER'" --password-stdin
                                docker compose -f docker-compose.yml pull
                                docker compose -f docker-compose.yml up -d
                                docker logout "'\$REGISTRY'"
                            '
                    """
                }
            }
        }
    }
}
