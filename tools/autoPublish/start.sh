#/bin/bash
root=$(cd "$(dirname "$0")";pwd)

engine_version=3.5.2
cocoscreator=/Applications/CocosCreator/Creator/${engine_version}/CocosCreator.app/Contents/MacOS/CocosCreator
echo ${cocoscreator}

projectDir=${root}/../../
echo ${projectDir}

configPath=${root}/buildConfig_web-desktop.json
echo ${configPath}

# echo "${cocoscreator} --project ${projectDir} --build ${configPath}";

${cocoscreator} --project ${prjectDir} --build ${configPath}