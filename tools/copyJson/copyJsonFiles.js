const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname,'config.json'),"utf-8");
const config = JSON.parse(content);
const otm_project_path = config.otm_project;
const project_path = path.join(__dirname,"../../");

const copy_files = {
    "Suit.json":true,
    "Skin.json":true,
    "HeroSkin.json":true
}

function main() {
    svnUpdate();
    execI18nHelperFile();
    copyJsonFiles();
    copyDTSFile();
    copySpineFile();
}

function svnUpdate() {
    const msg = child_process.execSync(`cd ${config.svn_path} && svn up`,{"encoding":"utf-8"});
    console.log("svnUpdate():",msg);
}

function execI18nHelperFile() {
    const i18nHelperPath = path.join(otm_project_path,"tools","i18nhelper");
    const msg = child_process.execSync(`cd ${i18nHelperPath} && ./start.sh`,{"encoding":"utf-8"});
    console.log("execI18nHelperFile():",msg);
}

function copyJsonFiles() {
    const json_files_to = path.join(project_path,"assets","resources","json");
    const json_files_from = path.join(otm_project_path,"tools","excel2json","output");
    Object.keys(copy_files).forEach(fileName=>{
        const fromFile = path.join(json_files_from,fileName);
        const toFile = path.join(json_files_to,fileName);
        const msg = child_process.execSync(`cp ${fromFile} ${toFile}`,{"encoding":"utf-8"})
        console.log("copyJsonFiles():",msg);
    });    
}

function copyDTSFile() {
    const declare_file_to = path.join(project_path,"declarations");
    const declare_file_from = path.join(otm_project_path,"declare");
    const fromFile = path.join(declare_file_from,'MHData.d.ts');
    const toFile = path.join(declare_file_to,'MHData.d.ts');
    const msg = child_process.execSync(`cp ${fromFile} ${toFile}`,{"encoding":"utf-8"})
    console.log("copyDTSFile():",msg);
}

function copySpineFile() {
    const spine_file_to = path.join(project_path,"assets","resources","spine");
    const spine_file_from = path.join(config.svn_path,"美术","NFT","Spine","Suits");
    const msg = child_process.execSync(`cp -a ${spine_file_from}/* ${spine_file_to}`,{"encoding":"utf-8"});
    console.log("copySpineFile():",msg);
}

main();