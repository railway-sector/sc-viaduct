import{l$ as l}from"./index-CA5ybFQn.js";import{m0 as c,m1 as x,m2 as y,m3 as g,h8 as h,m4 as j}from"./index-CA5ybFQn.js";function m(n){let{options:e,value:r}=n;return typeof e[r]=="number"}function u(n){let e="";for(let r in n){let t=n[r];if(typeof t=="boolean")t&&(e+=`#define ${r}
`);else if(typeof t=="number")e+=`#define ${r} ${t.toFixed()}
`;else if(typeof t=="object")if(m(t)){let{value:o,options:f,namespace:a}=t,i=a?`${a}_`:"";for(let s in f)e+=`#define ${i}${s} ${f[s].toFixed()}
`;e+=`#define ${r} ${i}${o}
`}else{let o=t.options,f=0;for(let a in o)e+=`#define ${o[a]} ${(f++).toFixed()}
`;e+=`#define ${r} ${o[t.value]}
`}}return e}function p(n,e,r,t=""){return new l(n,t+e.vertexShader,t+e.fragmentShader,r)}export{c as BufferObject,l as DisposableProgram,x as FramebufferObject,y as ProgramCache,g as Renderbuffer,h as Texture,j as VertexArrayObject,p as createProgram,u as glslifyDefineMap};
