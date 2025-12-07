const mysqlcon = require('../config/db');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const fs = require('fs');
const getAISummary = require('../config/openAIapi');

module.exports.firstOpenAIApi = async(req, res)=>{
    try{

        const openai = new OpenAI({
  apiKey: process.env.apikey,
});

const response = await openai.responses.create({
  model: "gpt-5-nano",
  input: "write something about AI",
  store: true,
});

// response.then((result) => console.log(result.output_text));
console.log(response.output_text);

return res.status(200).json({
    message : response
})

    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}


// module.exports.hit = async(req, res)=>{
//     try{
//         const file = req.file;
        
        
//         const resultDocumentInsert = await mysqlcon( "INSERT INTO documents (original_name, file_path, file_type) VALUES (?,?,?)",[file.originalname, file.path, file.mimetype] );

//         // Read PDF file as buffer
//         const fileBuffer = fs.readFileSync(file.path);


//         const data = await pdfParse(fileBuffer);
//         let text = data.text;
       
//         // let summary = require('../config/openAIapi')
//         const summary = await getAISummary(text)
        
        
//         let resultSummaryInsert = await mysqlcon( "INSERT INTO summaries (document_id, summary) VALUES (?,?)",
//       [resultDocumentInsert.insertId, summary] );


//         return res.status(200).json({
//              message: "Summary generated",
//       summary,
//         })

//     }catch(error){
//         return res.status(500).json({
//             message : error.message
//         })
//     }
// }

module.exports.generateAIDocSummary = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

       
        const resultDocumentInsert = await mysqlcon(
            "INSERT INTO documents (original_name, file_path, file_type) VALUES (?,?,?)",
            [file.originalname, file.path, file.mimetype]
        );

        if (!resultDocumentInsert || !resultDocumentInsert.insertId) {
            return res.status(500).json({
                message: "Document insert failed"
            });
        }

       
        let fileBuffer;
        try {
            fileBuffer = fs.readFileSync(file.path);
        } catch (err) {
            return res.status(500).json({
                message: "Error reading file",
                error: err.message
            });
        }

       
        const data = await pdfParse(fileBuffer);

        if (!data || !data.text) {
            return res.status(400).json({
                message: "Could not extract text from PDF"
            });
        }

        let text = data.text.trim();

        if (text.length === 0) {
            return res.status(400).json({
                message: "PDF contains no readable text"
            });
        }

       
        let summary;
        try {
            summary = await getAISummary(text);
        } catch (err) {
            return res.status(500).json({
                message: "AI summary generation failed",
                error: err.message
            });
        }

        if (!summary) {
            return res.status(500).json({
                message: "Summary returned empty"
            });
        }

       
        const resultSummaryInsert = await mysqlcon(
            "INSERT INTO summaries (document_id, summary) VALUES (?,?)",
            [resultDocumentInsert.insertId, summary]
        );

        if (!resultSummaryInsert) {
            return res.status(500).json({
                message: "Failed to insert summary into database"
            });
        }

        return res.status(200).json({
            message: "Summary generated",
            summary
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
