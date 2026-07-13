pipeline {
    agent {
        label 'electronix'
    }

    stages {
        stage('Provision Node.js Runtime') {
            steps {
                sh '''
                    if ! command -v node &> /dev/null; then
                        sudo apt-get update -y
                        sudo apt-get install -y curl
                        curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
                        sudo bash nodesource_setup.sh
                        sudo apt-get install -y nodejs
                        rm -f nodesource_setup.sh
                    fi

                    node -v
                    echo "Node.js is installed successfully ✅"
                '''
            }
        }
    }
}