/** Web Mercator helpers for the project map (OpenStreetMap tiles, 256 px). */
export type Point={lat:number;lon:number};
export const validPoint=(value:unknown):value is Point=>!!value&&typeof value==='object'&&Number.isFinite((value as Point).lat)&&Number.isFinite((value as Point).lon)&&Math.abs((value as Point).lat)<=85&&Math.abs((value as Point).lon)<=180;
export function project(point:Point,zoom:number){const scale=256*2**zoom;const sin=Math.sin(point.lat*Math.PI/180);return {x:(point.lon+180)/360*scale,y:(0.5-Math.log((1+sin)/(1-sin))/(4*Math.PI))*scale}}
/** Largest zoom (≤ 15) that fits every point in the viewport, centred on their bounds. */
export function fit(points:Point[],width:number,height:number,padding=40){
 if(!points.length)return {zoom:5,center:{lat:46.6,lon:2.4}};
 const lats=points.map(p=>p.lat),lons=points.map(p=>p.lon);
 const center={lat:(Math.min(...lats)+Math.max(...lats))/2,lon:(Math.min(...lons)+Math.max(...lons))/2};
 for(let zoom=15;zoom>=3;zoom--){const xs=points.map(p=>project(p,zoom).x),ys=points.map(p=>project(p,zoom).y);if(Math.max(...xs)-Math.min(...xs)<=width-padding*2&&Math.max(...ys)-Math.min(...ys)<=height-padding*2)return {zoom,center}}
 return {zoom:3,center};
}
/** Réponse de la Base Adresse Nationale (GeoJSON) : premier résultat avec ses coordonnées. */
export function banPoint(body:unknown):Point&{label:string}|null{
 const feature=(body as any)?.features?.[0],coordinates=feature?.geometry?.coordinates;
 if(!Array.isArray(coordinates)||coordinates.length<2)return null;
 const point={lon:Number(coordinates[0]),lat:Number(coordinates[1])};
 return validPoint(point)?{...point,label:String(feature.properties?.label||'')}:null;
}
/** Ancien format de réponse (service canadien), conservé pour les tests: first street/municipality hit with a point geometry. */
export function geogratisPoint(rows:unknown):Point&{label:string}|null{
 if(!Array.isArray(rows))return null;
 for(const row of rows){const coordinates=(row as any)?.geometry?.coordinates;if(Array.isArray(coordinates)&&coordinates.length>=2){const point={lon:Number(coordinates[0]),lat:Number(coordinates[1])};if(validPoint(point))return {...point,label:String((row as any).title||'')}}}
 return null;
}
