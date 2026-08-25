const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req,res, next)).catch((error) => next(error));
    }
}

export {asyncHandler} 

/* method: 1;
const asyncHandler = (requestHandler) => {
     return (req,res,next) => {

          // let st = requestHandler(req,res,next);
          // st.then((result)=>{console.log("controller execute successfully");})   //ye  line na likhe too bhi kaam chal jayega
          // st.catch((err)=>{next(err);});
          
          // let st = requestHandler(req,res,next);
          // st.catch((err)=>{next(err);});
          
          // st ki jarurat nhi hai;
          requestHandler(req,res,next).catch((err)=>{next(err);});
                   
          // st jaruri nhi ki ek promise written kare, isliye hum promise keyword ko add kr dete hai jisse ye confirm hota hai ki promise return karega;
          Promise.resolve(requestHandler(req,res,next)).catch((err)=>{next(err);});
     };
}
*/