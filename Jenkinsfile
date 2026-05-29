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
        // BUILD FRONT
        // =========================================================
        stage('Build Front Staging') {

            // when {
            //     allOf {
            //         branch 'main'

            //         changeset "presence-front/**"
            //     }
            // }

            steps {

                script {

                    sh """
                        echo \$REGISTRY_PASSWORD | docker login ${REGISTRY} \
                        -u \$REGISTRY_USER \
                        --password-stdin

                        docker build \
                        -t ${REGISTRY_IMAGE}/staging/front:dev \
                        -f presence-front/Dockerfile \
                        presence-front/

                        docker push ${REGISTRY_IMAGE}/staging/front:dev
                    """
                }
            }
        }

        // =========================================================
        // BUILD API
        // =========================================================
        stage('Build API Staging') {

            // when {
            //     allOf {
            //         branch 'main'

            //         changeset "presence-api/**"
            //     }
            // }

            steps {

                script {

                    sh """
                        echo \$REGISTRY_PASSWORD | docker login ${REGISTRY} \
                        -u \$REGISTRY_USER \
                        --password-stdin

                        docker build \
                        -t ${REGISTRY_IMAGE}/staging/api:dev \
                        -f presence-api/Dockerfile \
                        presence-api/

                        docker push ${REGISTRY_IMAGE}/staging/api:dev
                    """
                }
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

                sh """
                    # Creation dossier
                    mkdir -p ${PATH_COMPOSE}

                    # Copier docker compose
                    cp docker-compose-dev.yml \
                    ${PATH_COMPOSE}/docker-compose.yml

                    # Aller dans dossier
                    cd ${PATH_COMPOSE}

                    # Pull nouvelles images
                    docker compose pull

                    # Restart containers
                    docker compose up -d
                """
            }
        }

    }
}
