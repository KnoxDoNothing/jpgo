const B=import.meta.env.BASE_URL;
const img=(n:string)=>`<img src="${B}fx/${n}.png" alt="" draggable="false">`;
export const ART:Record<string,string>={sprout:img('s1'),cloud:img('s2'),guardian:img('s3'),noface:img('s4'),jiji:img('s5'),calcifer:img('s6'),kiki:img('s7'),mei:img('s8'),chihiro:img('s9'),blue:img('s10')};
