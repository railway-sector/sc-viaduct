import{oN as d,qK as l,cJ as m,Hd as b,Gj as x,g$ as y,m1 as g}from"./index-Ex_c6sx0.js";import{e as F}from"./ShaderCompiler-G2XYGDs6.js";import{e as O}from"./ProgramTemplate-DoE5xhIL.js";function c(r){const{options:e,value:n}=r;return typeof e[n]=="number"}function $(r){let e="";for(const n in r){const o=r[n];if(typeof o=="boolean")o&&(e+=`#define ${n}
`);else if(typeof o=="number")e+=`#define ${n} ${o.toFixed()}
`;else if(typeof o=="object")if(c(o)){const{value:t,options:f,namespace:s}=o,a=s?`${s}_`:"";for(const i in f)e+=`#define ${a}${i} ${f[i].toFixed()}
`;e+=`#define ${n} ${a}${t}
`}else{const t=o.options;let f=0;for(const s in t)e+=`#define ${t[s]} ${(f++).toFixed()}
`;e+=`#define ${n} ${t[o.value]}
`}}return e}export{d as BufferObject,l as FramebufferObject,m as Program,b as ProgramCache,x as Renderbuffer,F as ShaderCompiler,y as Texture,g as VertexArrayObject,O as createProgram,$ as glslifyDefineMap};
