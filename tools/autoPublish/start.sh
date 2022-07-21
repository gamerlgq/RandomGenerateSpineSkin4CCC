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

${cocoscreator} --project ${projectDir} --build ${configPath}