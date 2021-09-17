import {body} from "express-validator"


export const uploadVideoValidation = [
    body('title').exists().isString().withMessage('Title is required'),
    body('description').exists().isString().withMessage('Description is required'),
]

export const addBookmarkValidation = [
    body('time').exists().isFloat().withMessage('Time is required'),  
    body('text').exists().isString().withMessage('Text is required'),
]

 