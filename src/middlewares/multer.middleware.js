import multer from "multer";
/*
  Multer:-
    -> What it is: A backend tool (middleware) for your Node.js server.
    -> Role: The Receiver. It grabs the incoming file from the user's request and opens it up so your server can read it.
    -> Storage: Temporary store, if cloudinary pr successfully upload than use fs.unlink() to delete temporary file.
    -> It is required because standard Node.js backends cannot read raw file data streams out of the box.
    -> Multer ka role: Multer ek "Translator" hai. Ye multipart/form-data (binary stream) ko decode karta hai aur use req.file ya req.files mein badal deta hai 
    -> taaki aapka code use access kar sake varna aapka server us file koo direct access he nhi kr sakta tha.
*/

// By default, Multer, file ka naam ek same ya  random string (bina extension ke)bhi rakh deta hai taki files overlap na hon.
//  Lekin agar aapko pura control chahiye ki file disk (hard drive) par kahan aur kis naam se save hogi,
//  toh aap multer.diskStorage() ka use karte hain. Iske andar do main functions hote hain destination, filename:

/*destination function work:-
  Kaam: Yeh function Multer ko batata hai ki file ko kis folder mein rakhna hai.
  Parameters:
  req: Jo data user ne bheja hai (Express request).
  file: Jo file upload ho rahi hai uski details.
  cb (Callback): Yeh ek return function hai jiske zariye hum Multer ko final result batate hain.
  Callback ke pehle parameter mein hum error pass karte hain. Yahan null ka matlab hai "no error".
  Dusre parameter mein humne path diya hai "./public/temp". it means uploaded files automatically is temporary folder mein chali jayengi.
*/

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "./public/temp") 
  },
  
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
});   
 
//  Bilkul nahi. Aapko sirf upload.fields import karke route mein use karna hai. Baaki ka sara kaam—file ko disk par save karna,
//  uska path nikalna, aur req.files object banana—ye sab Multer library apne andar handle karti hai.
// Multer ka pura maqsad hi ye hai ki aapko req.files mile. Agar wo req.files nahi banata, toh Multer use karne ka koi fayda hi nahi hota. 
// Isliye, usne ye kaam "By Default" apne engine mein rakha hai.
  
export const upload = multer(
  {storage: storage}
); 



/*
Kaam: Upar aapne jo poori storage ki setting (rules) banayi thi, wo aapne is multer() function ke andar daal di.
Ab yeh upload ek Middleware ban chuka hai.
Export: export lagane ka fayda yeh hai ki ab aap is upload variable ko apne kisi bhi route file mein import kar sakte ho.
 (Example: router.post("/register", upload.single("avatar"), registerUser)) 

//  Browser -> Multer (Parses/Saves to Temp) -> Controller (Reads Temp Path) -> Cloudinary (Uploads) -> Database (Saves URL).
*/