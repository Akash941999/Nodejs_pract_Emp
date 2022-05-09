const router = require('express').Router();
const verify = require('./verifyToken');
const employeeModel = require('../models/User2');
const Authors = require('../models/authors');
const Books = require('../models/books');
//const pcRel = require('../model/relation');


const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



router.post('/addemp',verify , upload.single('employeeImage'), async (req,res)=>{


    const employee = await employeeModel.create({
        name: req.body.name,
        department:req.body.department,
        salary: req.body.salary,
        post: req.body.post,
        employeeImage: req.file.path 
    });
    try{
        res.send({employee:employee});

    }catch(err){
        res.status(400).send(err);
    }

});

router.get('/listofEmployees',verify,async function(req,res,next){

    employeeModel.find({post:"employee"},await function(err,response){
      if(err)
      res.send(err);
      else
      res.send({status: 200,resultfound:response.length, employee: response});
    });
      
  });

router.get('/listofAdmins',verify,async function(req,res,next){

    employeeModel.find({post:"admin"},await function(err,response){
      if(err)
      res.send(err);
      else
      res.send({admin: response});
    });
      
  });

router.put('/updateEmployeeImage',verify, upload.single('employeeImage'),async function(req,res,next){
    const id=req.query.userId ;
    const image = req.file.path; 
    employeeModel.findByIdAndUpdate(id,{employeeImage: image},await function(err,response){
      if(err)
      res.send(err);
      else
      res.send({status: 200,  employee: response});
    });
      
  });

router.delete('/deleteEmp',verify,async function(req,res,next){
    const id=req.query.userId ;
    employeeModel.findByIdAndDelete(id, await function(err,response){
      if(err)
      res.send(err);
      else
      res.send({status: 200,  employee: response});
    });
      
  });

//   router.post('/addempimage',verify, async (req,res,next)=>{


//     const user = await employeeModel.create({
//         name: req.body.name,
//         department:req.body.department,
//         salary: req.body.salary,
//         post: req.body.post
//     });
//     try{
//         res.send(user);

//     }catch(err){
//         res.status(400).send(err);
//     }


// });



router.post('/registerAuthor',async function(req, res) {

  //Adding new Author
  var authors1 = await Authors.create({
	  name: req.body.name,
	  age: req.body.age,
    books: req.body.books_id
    
  })


  // var authors = new Authors({
	//   name: req.body.name,
	//   age: req.body.age,
  //   books: req.body.books_id
    
  // })
  try{
          res.send({author:authors1});
    
      }catch(err){
          res.status(400).send(err);
      }
  
});

//Register
 router.post('/registerBook', async(req, res)=> {

  const books1 = await Books.create({
    name:req.body.name,
    page:req.body.page
  });
  try{
      res.send({books: books1});

  }catch(err){
      res.status(400).send(err);
  }

});

router.get('/searchAuthor',async(req,res,next)=>{
  const authorname=req.query.name;
    Authors.aggregate([
        {
            '$match': {
              'name': authorname 
            }
          },
          {
            $lookup : {from : "books",localField:"books",foreignField:"_id",as:"books_detail"}
          },
          {
            $project : {"books" : 0, "__v" : 0,"books_detail.__v" : 0 }
          }


      ],await function (err, result) {
        if (err) {
            console.log(err);
            return;
        }    
        res.send(result);
        
    }); 
  });


router.get('/authorsForBook',async(req,res,next)=>{
  const bookname=req.query.name;
    Books.aggregate([
        {
            '$match': {
              'name': bookname
              
            }
          },
          {
            $lookup : {from : "authors",localField:"_id",foreignField:"books",as:"authors_detail"}
          },
          {
            $project : {"__v" : 0, "authors_detail.books" : 0, "authors_detail.__v" : 0 }
          }


      ],await function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        //console.log(result);
        res.send(result);
    });
      
      
  });

  router.get('/bookslist',async(req,res,next)=> {

    try {
      const { page = 1,limit =10} = req.query;
      const bookslist = await Books.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
      res.status(200).json({total : bookslist.length, bookslist});
      
    } catch (error) {
      res.status(500).json({
        error 
      });
      
    }

//     var options = {
//       offset:   1, 
//       limit:    3
//   };
//   Books.paginate({}, options).then(await function(err,result) {

//     // res.send('bookslist', { 
//     //   records: result.docs,
//     //   current: result.offset,
//     //   pages: Math.ceil(result.total / result.limit) });

//     if(err)
//     res.send(err)
//     else{
//     res.json(result2);
//     }

// });

 });
      


module.exports = router;