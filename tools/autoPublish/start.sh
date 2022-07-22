#/bin/bash
root=$(cd "$(dirname "$0")";pwd)

updateUtilPath=${root}/../copyJson
${updateUtilPath}/start.sh

engine_version=3.5.2
cocoscreator=/Applications/CocosCreator/Creator/${engine_version}/CocosCreator.app/Contents/MacOS/CocosCreator
echo "cocoscreator : ${cocoscreator}"

projectDir=${root}/../../
echo "projectDir : ${projectDir}"

configPath=${root}/buildConfig_web-desktop.json
echo "buildconfigPath : ${configPath}"

#build web-desktop
${cocoscreator} --project ${projectDir} --build ${configPath}

#remove remote dir
removeShell=/Users/stevengerrard/workspace/cocos/creator/3D/android_packer/android_packer_server/assets/tools/removeRemoteDir.sh

expect ${removeShell} 192.168.5.225 root mohukeji@2019.com /root/nodejs-project/generate-nft-skin/assets/*

#copy to http server
project=${root}/../../build/web-desktop
http_server_dir=root@192.168.5.225:/root/nodejs-project/generate-nft-skin/assets/
`sshpass -p "mohukeji@2019.com" scp -r ${project} ${http_server_dir}`