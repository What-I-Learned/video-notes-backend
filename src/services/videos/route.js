import { Router } from "express";
import multer from "multer";
import createError from "http-errors";
import  fs from "fs-extra"
import {uploadVideoValidation,addBookmarkValidation} from "./validation.js"
import uniqid from "uniqid"
import {fileIsRequired} from "../../middlewares/fileIsRequired.js"
import {validationResult} from "express-validator"
import {join} from "path"
import { writeFileToPublicDirectory } from "../../../utils/fs-utils.js";


const videosJSONFilePath = join(process.cwd(),'src/services/videos/videos.json')

const route = Router();

route.get("/", async (req, res, next) => {
  try {
    const videosArray = await fs.readJSON(videosJSONFilePath)
    res.send(videosArray);
  } catch (error) {
    next(createError(400, error.message));
  }
});

route.get("/:id", async (req, res, next) => {
    try {
      const videosArray = await fs.readJSON(videosJSONFilePath)
      const videoIndex  = videosArray.findIndex(video=>video.id===req.params.id) // if found returns index else returns -1
      if(videoIndex==-1){ // not found
         next(createError(404, {message:'Video not found'}));
      }
      else{
          const video = videosArray[videoIndex]
          res.send(video)
      }
    } catch (error) {
      next(createError(400, error.message));
    }
  });

route.post("/", multer().single("video"),fileIsRequired,uploadVideoValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(createError(400, {message:'Upload video validation is failed', errors: errors.array() }));
    }
    else{
        const { url, id } = await  writeFileToPublicDirectory(req.file);
        const {title,description} = req.body;
        const video = {
            id,
            title,
            description,
            url,
            bookmarks:[],
            createdAt: new Date()
        }
        const videosArray = await fs.readJSON(videosJSONFilePath)
        videosArray.push(video)
        await fs.writeJSON(videosJSONFilePath, videosArray)
        res.send({ url, id,title,description });
    }
  } catch (error) {
    next(createError(400, error.message));
  }
});

route.put("/:id/bookmark",addBookmarkValidation,async (req,res,next)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          next(createError(400, {message:'Bookmark validation is failed', errors: errors.array() }));
          
        }


        const videosArray = await fs.readJSON(videosJSONFilePath)
        /**
         *  find video by id 
         *  if video is not found return 404
         *  else add bookmark to video (pusth to bookmarks array)
         */
        const videoIndex  = videosArray.findIndex(video=>video.id===req.params.id) // if found returns index else returns -1
        if(videoIndex==-1){ // not found
           next(createError(404, {message:'Video not found'}));
        }
        else{

            const {time,text} = req.body;
            const bookmark = {time,text,createdAt:new Date(),id:uniqid()}
            videosArray[videoIndex].bookmarks.push(bookmark)
            await fs.writeJSON(videosJSONFilePath, videosArray)
            res.status(201).send(bookmark)
        }
    } catch (error) {
        next(createError(400, error.message));
    }
})
export default route;
