import express, {Request,Response} from 'express';
const bodyParser = require('body-parser');
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Validate the url query
  function isValidURL(url:string):boolean{
    let urlPattern:RegExp = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+       // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+  // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+        // validate query string
      '(\\#[-a-z\\d_]*)?$','i'          // validate fragment locator
    ); 
    return urlPattern.test(url);
  } 
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredImage); might be useful]

  /**************************************************************************** */
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get("/filteredimage",async(req:Request,res:Response)=>{
      let image_url:string = req.query.image_url;
  
      // Validate the image_url query
      if(!isValidURL(image_url)){
        res.status(422).send("The Image URL is not valid!");
      }else{
        // Call filterImageFromURL(image_url) to filter the image
        const filteredImage:string = await filterImageFromURL(image_url);
        // Send the resulting file in the response
        res.sendFile(filteredImage);
  
        // Deletes any files on the server on finish of the response
        res.on("finish",()=>{
          deleteLocalFiles([filteredImage]);
        });
      }
    });

  //! END @TODO1



  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();