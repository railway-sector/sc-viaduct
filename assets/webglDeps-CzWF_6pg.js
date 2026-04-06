import{oN as l,qK as u,dc as m,Hd as b,Gj as x,hl as y,m1 as j}from"./index-BOLJ83wX.js";import{e as F}from"./ShaderCompiler-G2XYGDs6.js";import{e as v}from"./ProgramTemplate-CuGXy226.js";function c(r){const{options:e,value:n}=r;return typeof e[n]=="number"}function p(r){let e="";for(const n in r){const o=r[n];if(typeof o=="boolean")o&&(e+=`#define ${n}
`);else if(typeof o=="number")e+=`#define ${n} ${o.toFixed()}
`;else if(typeof o=="object")if(c(o)){const{value:t,options:f,namespace:s}=o,a=s?`${s}_`:"";for(const i in f)e+=`#define ${a}${i} ${f[i].toFixed()}
`;e+=`#define ${n} ${a}${t}
`}else{const t=o.options;let f=0;for(const s in t)e+=`#define ${t[s]} ${(f++).toFixed()}
`;e+=`#define ${n} ${t[o.value]}
`}}return e}export{l as BufferObject,u as FramebufferObject,m as Program,b as ProgramCache,x as Renderbuffer,F as ShaderCompiler,y as Texture,j as VertexArrayObject,v as createProgram,p as glslifyDefineMap};
