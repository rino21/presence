// pipeline {

//     agent any

//     environment {

//         REGISTRY = "registry.gitlab.com"

//         REGISTRY_IMAGE = "registry.gitlab.com/victorino.hairun/presence"

//         PATH_COMPOSE = "/home/rino/project/presence"

//         REGISTRY_USER = credentials('registry-user')

//         REGISTRY_PASSWORD = credentials('registry-password')
//     }

//     stages {

//         // =========================================================
//         // BUILD FRONT
//         // =========================================================
//         stage('Build Front Staging') {

//             when {
//                 branch 'main'
//                 changeset "presence-front/**/*"
//             }

//             steps {

//                 sh '''
//                     set -e

//                     echo "$REGISTRY_PASSWORD" | docker login $REGISTRY \
//                     -u "$REGISTRY_USER" \
//                     --password-stdin

//                     docker build \
//                     -t $REGISTRY_IMAGE/staging/front:dev \
//                     -f presence-front/Dockerfile \
//                     presence-front/

//                     docker push \
//                     $REGISTRY_IMAGE/staging/front:dev

//                     docker logout $REGISTRY
//                 '''
//             }
//         }

//         // =========================================================
//         // BUILD API
//         // =========================================================
//         stage('Build API Staging') {

//             when {
//                 branch 'main'
//                 changeset "presence-api/**/*"
//             }

//             steps {

//                 sh '''
//                     set -e

//                     echo "$REGISTRY_PASSWORD" | docker login $REGISTRY \
//                     -u "$REGISTRY_USER" \
//                     --password-stdin

//                     docker build \
//                     -t $REGISTRY_IMAGE/staging/api:dev \
//                     -f presence-api/Dockerfile \
//                     presence-api/

//                     docker push \
//                     $REGISTRY_IMAGE/staging/api:dev

//                     docker logout $REGISTRY
//                 '''
//             }
//         }

//         // =========================================================
//         // DEPLOY
//         // =========================================================
//         stage('Deploy Staging') {

//             when {
//                 branch 'main'
//             }

//             steps {

//                 sh '''
//                     set -e

//                     echo "$REGISTRY_PASSWORD" | docker login $REGISTRY \
//                     -u "$REGISTRY_USER" \
//                     --password-stdin

//                     # Copier docker compose
//                     cp docker-compose-dev.yml \
//                     $PATH_COMPOSE/docker-compose.yml

//                     # Aller dans dossier
//                     cd $PATH_COMPOSE

//                     # Pull nouvelles images
//                     docker compose -f docker-compose.yml pull

//                     # Restart containers
//                     docker compose -f docker-compose.yml up -d

//                     docker logout $REGISTRY
//                 '''
//             }
//         }
//     }
// }

pipeline {
    agent any

    environment {
        REGISTRY = "registry.gitlab.com"
        REGISTRY_IMAGE = "registry.gitlab.com/victorino.hairun/presence"
        PATH_COMPOSE = "/home/rino/project/presence"
        REGISTRY_USER = credentials('registry-user')
        REGISTRY_PASSWORD = credentials('registry-password')
    }

    stages {
        // =========================================================
        // CHECK CHANGES (Nouveau stage obligatoire)
        // =========================================================
        stage('Check Changes') {
            steps {
                script {
                    // Récupérer les fichiers modifiés dans le dernier commit
                    def changedFiles = sh(script: "git diff --name-only HEAD~1 HEAD", returnStdout: true).trim()
                    def filesList = changedFiles.split('\n')
                    
                    // Initialiser les variables d'environnement
                    env.BUILD_FRONT = 'false'
                    env.BUILD_API = 'false'
                    env.DEPLOY_STAGING = 'false'
                    
                    // Vérifier les changements
                    for (file in filesList) {
                        if (file.startsWith('presence-front/') || file == 'Jenkinsfile') {
                            env.BUILD_FRONT = 'true'
                            env.DEPLOY_STAGING = 'true'
                        }
                        if (file.startsWith('presence-api/') || file == 'Jenkinsfile') {
                            env.BUILD_API = 'true'
                            env.DEPLOY_STAGING = 'true'
                        }
                        if (file == 'docker-compose-dev.yml') {
                            env.DEPLOY_STAGING = 'true'
                        }
                    }
                    
                    echo "Build Front: ${env.BUILD_FRONT}"
                    echo "Build API: ${env.BUILD_API}"
                    echo "Deploy: ${env.DEPLOY_STAGING}"
                }
            }
        }

        // =========================================================
        // BUILD FRONT
        // =========================================================
        stage('Build Front Staging') {
            when {
                branch 'main'
                environment name: 'BUILD_FRONT', value: 'true'
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
                    docker push $REGISTRY_IMAGE/staging/front:dev
                    docker logout $REGISTRY
                '''
            }
        }

        // =========================================================
        // BUILD API
        // =========================================================
        stage('Build API Staging') {
            when {
                branch 'main'
                environment name: 'BUILD_API', value: 'true'
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
                    docker push $REGISTRY_IMAGE/staging/api:dev
                    docker logout $REGISTRY
                '''
            }
        }

        // =========================================================
        // DEPLOY
        // =========================================================
        stage('Deploy Staging') {
            when {
                branch 'main'
                environment name: 'DEPLOY_STAGING', value: 'true'
            }
            steps {
                sh '''
                    set -e
                    echo "$REGISTRY_PASSWORD" | docker login $REGISTRY \
                    -u "$REGISTRY_USER" \
                    --password-stdin
                    # Copier docker compose
                    cp docker-compose-dev.yml $PATH_COMPOSE/docker-compose.yml
                    # Aller dans dossier
                    cd $PATH_COMPOSE
                    # Pull nouvelles images
                    docker compose -f docker-compose.yml pull
                    # Restart containers
                    docker compose -f docker-compose.yml up -d
                    docker logout $REGISTRY
                '''
            }
        }
    }
}