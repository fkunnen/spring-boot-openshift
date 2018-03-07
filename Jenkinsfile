def version

pipeline {
    agent { label 'master' }
    stages {
        stage('Build App') {
            steps {
                git branch: 'master', url: 'https://github.com/fkunnen/spring-boot-openshift.git'
                script {
                    version = sh(returnStdout: true, script: "git rev-list HEAD --count").trim()
                    sh "./gradlew clean build"
                }
            }
        }
        stage('Test') {
            steps {
                sh "./gradlew test"
                step([$class: 'JUnitResultArchiver', testResults: '**/test-results/test/TEST-*.xml'])
            }
        }
        stage('Create Image Builder') {
            when {
                expression {
                    openshift.withCluster() {
                        openshift.withProject(env.DEV_PROJECT) {
                            return !openshift.selector("bc", "sbo").exists();
                        }
                    }
                }
            }
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject(env.DEV_PROJECT) {
                            openshift.newBuild("--name=sbo", "--strategy=docker", "--binary=true")
                        }
                    }
                }
            }
        }
        stage('Build Image') {
            steps {

                script {
                    openshift.withCluster() {
                        openshift.withProject(env.DEV_PROJECT) {
                            openshift.selector("bc", "sbo").startBuild("--from-dir=.", "--wait=true")
                        }
                    }
                }
            }
        }
        stage('Create DEV') {
            when {
                expression {
                    openshift.withCluster() {
                        openshift.withProject(env.DEV_PROJECT) {
                            return !openshift.selector('dc', 'sbo').exists()
                        }
                    }
                }
            }
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject(env.DEV_PROJECT) {
                            def app = openshift.newApp("sbo:latest")
                            app.narrow("svc").expose();

                            def dc = openshift.selector("dc", "sbo")
                            while (dc.object().spec.replicas != dc.object().status.availableReplicas) {
                                sleep 10
                            }
                            openshift.set("triggers", "dc/sbo", "--manual")
                        }
                    }
                }
            }
        }
        stage('Deploy DEV') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject(env.DEV_PROJECT) {
                            openshift.selector("dc", "sbo").rollout().latest();
                        }
                    }
                }
            }
        }
        stage('Promote to STAGE?') {
            steps {
                timeout(time:15, unit:'MINUTES') {
                    input message: "Promote to STAGE?", ok: "Promote"
                }

                script {
                    openshift.withCluster() {
                        openshift.tag("${env.DEV_PROJECT}/sbo:latest", "${env.STAGE_PROJECT}/sbo:${version}")
                    }
                }
            }
        }
        stage('Deploy STAGE') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject(env.STAGE_PROJECT) {
                            if (openshift.selector('dc', 'sbo').exists()) {
                                openshift.selector('dc', 'sbo').delete()
                                openshift.selector('svc', 'sbo').delete()
                                openshift.selector('route', 'sbo').delete()
                            }

                            openshift.newApp("sbo:${version}").narrow("svc").expose()
                        }
                    }
                }
            }
        }
    }
}