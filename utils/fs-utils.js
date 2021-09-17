
import path from "path"

import fs from "fs-extra"

import uniqid from "uniqid"

export const publicFolderPath = path.join(process.cwd(),'public')


export const writeFileToPublicDirectory = async (file) => {
    try {
        // extracting name and extension from filename
        const [name,extension] = file.originalname.split(".") // m5-d4-debrief.mp4 => ['m5-d4-debrief','mp4']
        const id = uniqid()
        const newFileName = `${id}.${extension}`
        // where we will write file
        const filePath = path.join(publicFolderPath,newFileName) // users/myname/projectname/public/m5-d4-debrief.mp4
        // first parameter is path second parameter is file data
        await fs.writeFile(filePath,file.buffer)  
        const url = `http://localhost:3001/${newFileName}`

        return {url,id}

    } catch (error) {
        throw error
    }
     
}