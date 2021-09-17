import express from "express"

import cors from "cors"

 

import videosRoute from "./services/videos/route.js"

import errorHandler from "./errorHandler.js"

import { publicFolderPath } from "../utils/fs-utils.js"

const server = express()


const PORT = 3001



server.use(cors())

server.use(express.static(publicFolderPath))

server.use(express.json())

server.use("/videos",videosRoute)

server.use(errorHandler)

server.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))


server.on("error",(error)=>console.log(`Server is crushed :  ${error}`))