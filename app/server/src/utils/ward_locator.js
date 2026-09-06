// import { query } from "../config/db.js";

// const findWardFromLocation = async (lat, lng) => {
//     const findWardQuery = `
//         SELECT id, name, palika_id
//         FROM wards
//         WHERE ST_Contains(geojson_polygon, ST_SetSRID(ST_Point($1, $2), 4326))
//         LIMIT 1
//     `;

// //     const findWardQuery = `
// // SELECT id, name, palika_id
// // FROM wards
// // WHERE ST_Contains(geojson_polygon, ST_SetSRID(ST_Point($1, $2), 4326))
// // ORDER BY ST_Area(geojson_polygon) ASC, name::int ASC
// // LIMIT 1;
// //     `;
//     const result = await query(findWardQuery, [lng, lat]); // Note: lng first in POINT()
// console.log("Detected ward:", result.rows[0]);
//     return result.rows[0] || null;
// }

// export {findWardFromLocation};

// import { query } from "../config/db.js";

// const findWardFromLocation = async (lat, lng) => {
  
//     const findWardQuery = `
//  SELECT id, name, palika_id
// FROM wards
// WHERE ST_Contains(geojson_polygon, ST_SetSRID(ST_Point($1, $2), 4326))

// LIMIT 1;

// `;
//         const result = await query(findWardQuery, [lng, lat]); // Note: lng first in POINT()
        
//         return result.rows[0] || null;
//     }
    
//     export {findWardFromLocation};

// import { query } from "../config/db.js";

// const findWardFromLocation = async (lat, lng) => {
// const findWardQuery = `
//   SELECT id, name, palika_id
//   FROM wards
//   WHERE ST_Intersects(
//     ST_ForceRHR(ST_Multi(geojson_polygon)), 
//     ST_SetSRID(ST_Point($1, $2), 4326)
//   )
//   LIMIT 1;
// `;
// const result = await query(findWardQuery, [lng, lat]);


//     return result.rows[0] || null;
// }

// export { findWardFromLocation };


import { query } from "../config/db.js";

const findWardFromLocation = async (lat, lng) => {
  const findWardQuery = `
    SELECT id, name, palika_id,
           ST_Area(geojson_polygon::geography) as area,
           ST_Distance(geojson_polygon::geography, 
                       ST_SetSRID(ST_Point($1, $2), 4326)::geography) as distance
    FROM wards
    WHERE ST_Intersects(
      ST_ForceRHR(ST_Multi(geojson_polygon)), 
      ST_SetSRID(ST_Point($1, $2), 4326)
    )
    ORDER BY distance ASC, area ASC
    LIMIT 1;
  `;
  
  const result = await query(findWardQuery, [lng, lat]);
  return result.rows[0] || null;
}

export { findWardFromLocation };



