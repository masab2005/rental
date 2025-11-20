import{
    createStaffService 
} from '../models/staffModel.js';

const handerResponse = (res,status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
}

