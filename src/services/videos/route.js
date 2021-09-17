import { Router } from "express";
import multer from "multer";
import createError from "http-errors";
import  fs from "fs-extra"

import {join} from "path"
import { writeFileToPublicDirectory } from "../../../utils/fs-utils.js";


const videosJSONFilePath = join(process.cwd(),'src/services/videos/videos.json')

const route = Router();

route.get("/", async (req, res, next) => {
  try {
    res.send([]);
  } catch (error) {
    next(createError(400, error.message));
  }
});

route.post("/", multer().single("video"), async (req, res, next) => {
  try {
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
  } catch (error) {
    next(createError(400, error.message));
  }
});

export default route;
