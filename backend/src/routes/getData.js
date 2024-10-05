const express = require("express");
const { body, validationResult } = require("express-validator");
const qs = require("qs");
const formatStarData = require("../services/formatStarData");
const axios = require('axios')


const router = express.Router()

router.get('/api/getStarData', [], 

    async (req, res) => {

        const {ra, dec, searchRadius, magLimit} = req.query
        const url = "https://gea.esac.esa.int/tap-server/tap/sync";
        console.log("Requestesd")
        console.log(ra, dec, searchRadius, magLimit)
        const query = `
          SELECT TOP 1000
        gaia_source.source_id,
        gaia_source.ra,   -- Include RA
        gaia_source.dec,
        gaia_source.parallax,
        gaia_source.distance_gspphot,  
        gaia_source.phot_g_mean_mag,   
        gaia_source.bp_rp              
      FROM gaiadr3.gaia_source
      WHERE 1=CONTAINS(
        POINT('ICRS', gaia_source.ra, gaia_source.dec), 
        CIRCLE('ICRS', ${ra}, ${dec}, ${searchRadius}))
      AND gaia_source.phot_g_mean_mag <= ${magLimit} 
      AND gaia_source.parallax IS NOT NULL
      ORDER BY gaia_source.distance_gspphot ASC
      `;

      try {
       
        const response = await axios.post(
          url,
          qs.stringify({
            query,
            request: "doQuery",
            lang: "ADQL", 
            format: "json",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
    
        const formatted = formatStarData(response.data.data)

       return res.status(200).send({"message": "Fetch sucessful !", "data": JSON.stringify(formatted)})
        
       

      } catch (error) {
        console.error(`Error: ${error.message}`);
        if (error.response) {
          return  res.status(error.response.status).send({"error": error.response.data})
        
        }
      }
    }
)

module.exports = { getStarDataRouter: router };