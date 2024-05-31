apk add binutils-gold curl gnupg libgcc linux-headers python git openssl openssh lcms2-dev libpng-dev autoconf automake
curl -s "https://gitlab.com/api/v4/projects/9905046/repository/files/gitlab%2Fsetup_key.sh/raw?ref=master&private_token=FjCQxPFMNXJwmaomMoKi" 2>&1 | sh
ssh-keyscan -t rsa gitlab.com >> ~/.ssh/known_hosts

NODE_ENV=""
echo "** Backend npm i started"
npm i
# npm run format
# npm run lint:fix
echo "** Backend test cases started"
npm test
cd web
echo "** Frontend npm i started"
npm i
# npm run lint:fix
echo "** Frontend test cases started"
npm test
cd ..
# mkdir coverage
node coverage_output.js

cp coverage/** /mnt/artifacts/ -R
