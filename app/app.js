import express from 'express'

const app = express();

app.use(express.json());

app.get("/", (_req, res)=>{
    // responde con un json que tendra status
    res.json({status: "ok", service: "Hola Microservicio"});
});

export default app;