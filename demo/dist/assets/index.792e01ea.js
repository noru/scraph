var Ce=Object.defineProperty,Ee=Object.defineProperties;var we=Object.getOwnPropertyDescriptors;var re=Object.getOwnPropertySymbols;var _e=Object.prototype.hasOwnProperty,ve=Object.prototype.propertyIsEnumerable;var z=(r,e,t)=>e in r?Ce(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,Y=(r,e)=>{for(var t in e||(e={}))_e.call(e,t)&&z(r,t,e[t]);if(re)for(var t of re(e))ve.call(e,t)&&z(r,t,e[t]);return r},K=(r,e)=>Ee(r,we(e));var O=(r,e,t)=>(z(r,typeof e!="symbol"?e+"":e,t),t);import{o as T,l as oe,k as se,a as Se,u as B,b as ne,r as u,s as Ne,j as q,d as ae,c as De,e as Ue,I as Me,f as ie,i as j,g as We,h as A,m as Re,J as Ie,n as $e,D as Oe,z as Ge,p as de,q as le,R as Le,t as Pe,v as Ze}from"./vendor.eb177b35.js";const Te=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function t(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=t(o);fetch(o.href,n)}};Te();var G={"scraph-wrapper":"scraph-wrapper","scraph-canvas":"scraph-canvas","scraph-edge-wrapper":"scraph-edge-wrapper","scraph-edge":"scraph-edge","scraph-edge-selected":"scraph-edge-selected","scraph-edge-hover-pad":"scraph-edge-hover-pad","scraph-node-wrapper":"scraph-node-wrapper","scraph-node":"scraph-node","scraph-node-draggable":"scraph-node-draggable"};const Be={devMode:!1,backgroundGrid:"checker",canvasSize:40960,maxZoom:2,minZoom:.1,multiSelect:!1,workspaceWidth:1024,workspaceHeight:760};function Xe(r){let e=oe.get(`workspace-config-${r}`);return T(Object.assign({},Be,e||{}),void 0,{autoBind:!0})}function Ye(){return T({nodes:[],edges:[],get nodeMap(){return se(this.nodes,"id")},get edgeMap(){return se(this.edges,"id")},get nodeIdSet(){return new Set(this.nodes.map(r=>r.id))},get edgeIdSet(){return new Set(this.edges.map(r=>r.id))}},void 0,{autoBind:!0})}function je(r){return Y({x:void 0,y:void 0,width:250,height:90,draggable:!0,connectable:!0,selectable:!0,selected:!1},r)}function Ae(){return T({scale:1,translateX:0,translateY:0,dragMode:"drag",hoverElement:null,selectedElement:null},void 0,{autoBind:!0})}function Fe(){return T({x:0,y:0},void 0,{autoBind:!0})}function He(r){return{config:Xe(r),state:Ae(),graph:Ye(),mousePos:Fe()}}const R=Se(He);function L(){return u.exports.useContext($).id}function ce(r=L()){let e=u.exports.useMemo(()=>R(r).config,[r]);return B(e)}function he(r=L()){let e=u.exports.useMemo(()=>R(r).state,[r]);return B(e)}function ze(r=L()){return ne(()=>R(r).graph.nodeIdSet)[0]}function Ke(r=L()){return ne(()=>R(r).graph.edgeIdSet)[0]}function J(r,e=L()){let t=u.exports.useMemo(()=>R(e).graph,[e]);return B(()=>t.nodeMap[r]||{id:r},[r,t.nodeMap])}function qe(r,e=L()){let t=u.exports.useMemo(()=>R(e).graph,[e]);return B(()=>t.edgeMap[r]||{id:r},[r,t.edgeMap])}function Je(r=L()){return B(Ne(R(r).state,["selectedElement"]))}const i=q.exports.jsx,x=q.exports.jsxs,H=q.exports.Fragment;function Ve(){let{id:r}=u.exports.useContext($),{canvasSize:e,backgroundGrid:t}=ce(r),s=e/2,o=-s+2650,n=-s+1440;return x(H,{children:[i("rect",{fill:"white",x:o,y:n,width:e,height:e}),i("rect",{fill:`url(#grid-${t})`,x:o,y:n,width:e,height:e})]})}const Qe=30;var a;(function(r){r.InitGraph="InitGraph",r.Clear="Clear",r.CanvasTransform="CanvasTransform",r.ZoomToFit="ZoomToFit",r.CreateNode="CreateNode",r.UpdateNode="UpdateNode",r.NodeDragEnd="NodeDragEnd",r.CreateEdge="CreateEdge",r.UpdateEdge="UpdateEdge",r.DeleteNode="DeleteNode",r.DeleteEdge="DeleteEdge",r.HoverElement="HoverElement",r.ClickNode="ClickNode",r.SelectNode="SelectNode",r.DeselectNode="DeselectNode",r.ClickEdge="ClickEdge",r.SelectEdge="SelectEdge",r.DeselectEdge="DeselectEdge",r.RecalculateGraphLayout="RecalculateGraphLayout",r.UpdateWorkspaceConfig="UpdateWorkspaceConfig",r.DragModeChange="DragModeChange",r.MouseMove="MouseMove",r.Undo="Undo",r.Redo="Redo"})(a||(a={}));const et=new Set([a.CreateEdge,a.CreateNode,a.UpdateNode,a.UpdateEdge,a.DeleteEdge,a.DeleteNode,a.DragModeChange,a.Undo,a.Redo]);class tt{constructor(e){O(this,"_id");O(this,"_readonly",!1);O(this,"_store");O(this,"undoStack");O(this,"redoStack");O(this,"_subscribers",Object.keys(a).reduce((e,t)=>(e[t]=[],e),{}));this._id=e,this._store=R(e),this.undoStack=T([]),this.redoStack=T([])}devMode(e){this.dispatch(a.UpdateWorkspaceConfig,{payload:{devMode:e}}),console.warn(`[CommandCenter] Set dev mode ${e?"ON":"OFF"}`)}setReadonly(e){this._readonly=e}subscribe(e,...t){return t.forEach(s=>this._subscribers[e].push(s)),()=>t.map(s=>()=>this.unsubscribe(e,s)).forEach(s=>s())}unsubscribe(e,...t){let s=this._subscribers[e];this._subscribers[e]=s.filter(o=>t.indexOf(o)===-1)}exec(e,t){this._readonly&&!this.isCommandAllowed(e)||(console.debug(`[CommandCenter] CMD ${e} executing`,t),this._subscribers[e].forEach(s=>{try{s.call(this,e,t)}catch(o){console.error(`[CommandCenter] CMD ${e} error in executing subscriber`,s,o)}}),(t==null?void 0:t.undo)&&(this.undoStack.length===Qe&&this.undoStack.unshift(),this.undoStack.push({cmd:e,params:t}),!t.isRedo&&(this.redoStack.length=0)))}dispatch(e,t,s=0){setTimeout(()=>this.exec(e,t),s)}undo(){let e=this.undoStack[this.undoStack.length-1];if(!e)return;let{params:t,cmd:s}=e;try{t.undo.call(this,s,t),this.undoStack.pop(),this.redoStack.push(e)}catch(o){throw console.error(`[CommandCenter] Undo CMD ${s} failed`),o}}redo(){let e=this.redoStack[this.redoStack.length-1];if(!e)return;let{params:t,cmd:s}=e;(t==null?void 0:t.redo)?(t.redo.call(this,s,t),this.redoStack.pop(),this.redoStack.push({cmd:s,params:t})):this.exec(s,K(Y({},t),{isRedo:!0}))}getNodeById(e){return e?this._store.graph.nodeMap[e]:null}getWorkspaceConfig(){return this._store.config}getWorkspaceInfo(){return this._store.state}getWorkspaceCenter(){let{workspaceWidth:e=0,workspaceHeight:t=0}=this._store.config,{scale:s,translateX:o,translateY:n}=this._store.state;return{x:(e/2-o)/s,y:(t/2-n)/s}}isCommandAllowed(e){return!(this._readonly&&et.has(e))}}function rt(r){return De().x(e=>e.x).y(e=>e.y)(r)}function ue(r,e){let[t,s]=r;const o=Ue("line",{x1:t.x,y1:t.y,x2:s.x,y2:s.y});return Me.intersectLinePolygon(o.params[0],o.params[1],e)}function I(r,e=0,t=0){return{x:r.x+e,y:r.y+t}}function pe(r,e,t={}){let s=new ae.graphlib.Graph;return s.setGraph(Object.assign({ranker:"network-simplex",rankdir:"LR",align:"UL",weight:100,edgesep:200},t)),s.setDefaultEdgeLabel(function(){return{}}),r.forEach(o=>{var n,d;s.setNode(o.id,{label:"",id:o.id,width:(n=o.width)!=null?n:100,height:(d=o.height)!=null?d:100})}),e.forEach(o=>{s.setEdge(o.source,o.target)}),ae.layout(s),s}class ot extends tt{constructor(e){super(e);this.initBuildInActions(),window[`__workspace_cmd_${e.replace(/[^a-zA-Z0-9]/g,"")}`]=this}destroy(){window[`__workspace_cmd_${this._id.replace(/[^a-zA-Z0-9]/g,"")}`]=null}initBuildInActions(){this.subscribe(a.Clear,this.onClear),this.subscribe(a.InitGraph,this.onInitGraph),this.subscribe(a.CanvasTransform,this.onCanvasTransform),this.subscribe(a.UpdateWorkspaceConfig,this.onUpdateWsConfig),this.subscribe(a.RecalculateGraphLayout,this.onCalculateGraphLayout),this.subscribe(a.DeleteNode,this.onDeleteNode),this.subscribe(a.CreateNode,this.onUpsertNode),this.subscribe(a.UpdateNode,this.onUpsertNode),this.subscribe(a.DeleteEdge,this.onDeleteEdge),this.subscribe(a.SelectNode,this.onSelectNode),this.subscribe(a.DeselectNode,this.onDeselectNode),this.subscribe(a.CreateEdge,this.onUpsertEdge),this.subscribe(a.UpdateEdge,this.onUpsertEdge),this.subscribe(a.SelectEdge,this.onSelectEdge),this.subscribe(a.DeselectEdge,this.onDeselectEdge),this.subscribe(a.MouseMove,this.onMouseMove),this.subscribe(a.DragModeChange,this.onDragMode),this.subscribe(a.HoverElement,this.onHoverElement),this.subscribe(a.Undo,this.onUndo),this.subscribe(a.Redo,this.onRedo)}onClear(e){this._store.graph.nodes.length=0,this._store.graph.edges.length=0}onInitGraph(e,{payload:{nodes:t,edges:s}}){if(!ie.exports.isEmpty(t)){if(j(t[0].x)){let o=pe(t,s);t=t.map(n=>{let{x:d,y:h}=o.node(n.id);return K(Y({},n),{x:d,y:h})})}t.forEach(o=>{this.onUpsertNode(e,{payload:o})}),s.forEach(o=>{this.onUpsertEdge(e,{payload:o})}),setTimeout(()=>this.dispatch(a.ZoomToFit))}}onCanvasTransform(e,{payload:t}){if(!j(t.scale)){let{maxZoom:s,minZoom:o}=this._store.config;t.scale>s&&(t.scale=s),t.scale<o&&(t.scale=o)}Object.assign(this._store.state,t)}onUpdateWsConfig(e,{payload:t}){Object.assign(this._store.config,t),oe.set("workspace-config-"+this._id,this._store.config)}onCalculateGraphLayout(e,{payload:t}={payload:{}}){let{nodes:s,edges:o}=this._store.graph,n=pe(s.map(d=>{var h,p;return{id:d.id,width:(h=d.width)!=null?h:0,height:(p=d.height)!=null?p:0}}),o.map(d=>({source:d.source,target:d.target})),t);n.nodes().forEach(d=>{let{x:h,y:p}=n.node(d),l={id:d,x:h,y:p};this.exec(a.UpdateNode,{payload:l})})}onDeleteNode(e,{payload:t}){var o;let s=this._store.graph.nodeMap[t];this._store.graph.nodes.remove(s),((o=this._store.state.selectedElement)==null?void 0:o.id)===t&&(this._store.state.selectedElement=null)}onUpsertNode(e,{payload:t}){if(j(t.id))throw Error(`Invalid node ID: ${t.id}`);let s=this._store.graph.nodeMap[t.id];if(s)Object.assign(s,t);else{if(j(t.x)||j(t.y)){let{x:o,y:n}=this._getNodeInitPosition(t.width,t.height);t.x=o,t.y=n}this._store.graph.nodes.push(t)}}onSelectNode(e,{payload:t}){this._store.state.selectedElement={id:t.id,type:"node"}}onDeselectNode(e,{payload:t}){this.clearSelection()}onUpsertEdge(e,{payload:t}){if(!t.id)throw Error(`Invalid edge ID: ${t.id}`);let s=this._store.graph.edgeMap[t.id];s?Object.assign(s,t):this._store.graph.edges.push(t)}onDeleteEdge(e,{payload:t}){var o;let s=this._store.graph.edgeMap[t];this._store.graph.edges.remove(s),((o=this._store.state.selectedElement)==null?void 0:o.id)===t&&(this._store.state.selectedElement=null)}onSelectEdge(e,{payload:t}){this._store.state.selectedElement={id:t.id,type:"edge"}}onDeselectEdge(e,{payload:t}){this.clearSelection()}onUndo(){this.undo()}onRedo(){this.redo()}onMouseMove(e,{payload:t}){Object.assign(this._store.mousePos,t)}onHoverElement(e,{payload:t}){this._store.state.hoverElement=t}onDragMode(e,{payload:t}){this._store.state.dragMode=t}clearSelection(){this._store.state.selectedElement=null}_getNodeInitPosition(e=0,t=0){let{x:s,y:o}=this.getWorkspaceCenter();return{x:s-e/2,y:o-t/2}}}const ge=ie.exports.memoize(r=>new ot(r));function P(r){let e=u.exports.useContext($);return r||(r=e.id),ge(r)}function V(r){return r.metaKey||r.ctrlKey}function fe(r){var e,t,s="";if(typeof r=="string"||typeof r=="number")s+=r;else if(typeof r=="object")if(Array.isArray(r))for(e=0;e<r.length;e++)r[e]&&(t=fe(r[e]))&&(s&&(s+=" "),s+=t);else for(e in r)r[e]&&(s&&(s+=" "),s+=e);return s}function F(){for(var r=0,e,t,s="";r<arguments.length;)(e=arguments[r++])&&(t=fe(e))&&(s&&(s+=" "),s+=t);return s}function st({id:r,renderNode:e}){var U,N,w,_,f,D;let t=u.exports.useRef(null),{id:s}=u.exports.useContext($),o=J(r,s),n=u.exports.useRef({x:(U=o.x)!=null?U:0,y:(N=o.y)!=null?N:0,offsetX:0,offsetY:0}),d=`translate(${(w=o.x)!=null?w:0}, ${(_=o.y)!=null?_:0}) rotate(0)`,{dragMode:h,selectedElement:p}=he(s),l=P(),g=u.exports.useCallback(c=>{if(h==="drag"&&!V(c.sourceEvent)){let y=n.current,C={id:o.id,x:c.x+y.offsetX,y:c.y+y.offsetY};l.dispatch(a.UpdateNode,{payload:C})}else{let y={id:"temp-edge",end:{x:c.x,y:c.y}};l.dispatch(a.UpdateEdge,{payload:y})}},[r,o.id,o.x,o.y,h]),k=u.exports.useCallback(c=>{var y,C,m,v;if(h==="drag"&&!V(c.sourceEvent))n.current={x:(y=o.x)!=null?y:0,y:(C=o.y)!=null?C:0,offsetX:((m=o.x)!=null?m:0)-c.x,offsetY:((v=o.y)!=null?v:0)-c.y};else{let W={id:"temp-edge",source:o.id,target:"unset",start:{x:c.x,y:c.y},end:{x:c.x,y:c.y}};l.dispatch(a.CreateEdge,{payload:W})}setTimeout(()=>{var W,M,X;(X=(M=(W=t.current)==null?void 0:W.parentElement)==null?void 0:M.parentElement)==null||X.appendChild(t.current.parentElement)},200)},[o.id,o.x,o.y,h]),b=u.exports.useCallback(c=>{var y;if(h==="drag"&&!V(c.sourceEvent)){if(Math.abs(c.x+n.current.offsetX-n.current.x)<4&&Math.abs(c.y+n.current.offsetY-n.current.y)<4)return;l.dispatch(a.NodeDragEnd,{payload:{dragStartPos:Y({},n.current),dragEndPos:{x:c.x+n.current.offsetX,y:c.y+n.current.offsetY}},undo:(C,m)=>{if(!m)return;let v={id:o.id,x:m.payload.dragStartPos.x,y:m.payload.dragStartPos.y};l.dispatch(a.UpdateNode,{payload:v})},redo:(C,m)=>{if(!m)return;let v={id:o.id,x:m.payload.dragEndPos.x,y:m.payload.dragEndPos.y};l.dispatch(a.UpdateNode,{payload:v})}}),n.current.offsetX=0,n.current.offsetY=0}else{let C=l.getWorkspaceInfo();l.dispatch(a.DeleteEdge,{payload:"temp-edge"});let m=l.getNodeById((y=C.hoverElement)==null?void 0:y.id);if(m&&m.id!==o.id){let v={id:`${o.id}-${m.id}`,source:o.id,target:m.id,start:null,end:null};l.dispatch(a.CreateEdge,{payload:v,undo:(W,M)=>l.dispatch(a.DeleteEdge,{payload:M==null?void 0:M.payload.id})})}}},[o.id,h]),E=u.exports.useCallback(c=>{let y=c?{id:c,type:"node"}:null;l.exec(a.HoverElement,{payload:y})},[o.id]);return u.exports.useEffect(()=>{const c=We().on("drag",g).on("start",k).on("end",b);A(t.current).on("mouseenter",()=>E(o.id)).on("mouseleave",()=>E(null)).call(c)},[g]),u.exports.useLayoutEffect(()=>{let{width:c,height:y}=A(t.current).node().getBBox(),C={id:o.id,width:c,height:y};l.dispatch(a.UpdateNode,{payload:C})},[]),i("g",{className:F(G["scraph-node-wrapper"]),children:i("g",{ref:t,className:F(o.draggable&&G["scraph-node-draggable"]),transform:d,onClick:()=>{l.dispatch(a.ClickNode,{payload:o}),o.selectable&&((p==null?void 0:p.id)===o.id?l.dispatch(a.DeselectNode,{payload:o}):l.dispatch(a.SelectNode,{payload:o}))},children:e?e(o):i("rect",{width:(f=o.width)!=null?f:100,height:(D=o.height)!=null?D:100,stroke:"none",strokeWidth:"0",fill:"red"})})})}function nt({renderNode:r}){let e=ze();return i(H,{children:Array.from(e).map(t=>i(st,{id:t,renderNode:r},t))})}function at({id:r}){var _,f,D,c,y,C,m,v,W,M,X,ee;let e=u.exports.useRef(null),t=P();u.exports.useEffect(()=>{let Z=te=>{let ke=te?{id:te,type:"edge"}:null;t.exec(a.HoverElement,{payload:ke})};return A(e.current).on("mouseenter",()=>Z(o.id)).on("mouseleave",()=>Z(null)),()=>A(e.current).on("mouseenter",null).on("mouseleave",null)},[]);let s=Je(),o=qe(r),n=J(o.source),d=J(o.target),h=(_=me(n))!=null?_:o.start,p=(f=me(d))!=null?f:o.end;if(!h||!p)return console.warn(`[Workspace] Orphan edge found: ${o.id}`),null;let l=3,g=[I(h,-l,-l),I({x:h.x+((D=n==null?void 0:n.width)!=null?D:0),y:h.y},l,-l),I({x:h.x+((c=n==null?void 0:n.width)!=null?c:0),y:h.y+((y=n==null?void 0:n.height)!=null?y:0)},l,l),I({x:h.x,y:h.y+((C=n==null?void 0:n.height)!=null?C:0)},-l,l)],k=[I(p,-l,-l),I({x:p.x+((m=d==null?void 0:d.width)!=null?m:0),y:p.y},l,-l),I({x:p.x+((v=d==null?void 0:d.width)!=null?v:0),y:p.y+((W=d==null?void 0:d.height)!=null?W:0)},l,l),I({x:p.x,y:p.y+((M=d==null?void 0:d.height)!=null?M:0)},-l,l)],b=[n?ye(n):o.start,d?ye(d):o.end],E=(X=ue(b,g).points[0])!=null?X:h,U=(ee=ue(b,k).points[0])!=null?ee:p;const N=rt([E,U]),w=(s==null?void 0:s.id)===o.id;return x("g",{ref:e,className:F(G["scraph-edge-wrapper"]),onClick:()=>{let Z=o;t.dispatch(a.ClickEdge,{payload:Z}),w?t.dispatch(a.DeselectEdge,{payload:Z}):t.dispatch(a.SelectEdge,{payload:Z})},children:[i("path",{className:F(G["scraph-edge"],w&&"scraph-edge-selected"),style:{pointerEvents:o.id==="temp-edge"?"none":void 0},d:N||void 0}),i("path",{className:F(G["scraph-edge-hover-pad"]),d:N||void 0})]})}function ye(r){var e,t,s,o;return{x:((e=r.x)!=null?e:0)+((t=r.width)!=null?t:0)/2,y:((s=r.y)!=null?s:0)+((o=r.height)!=null?o:0)/2}}function me(r){return!r||(r==null?void 0:r.x)===void 0||(r==null?void 0:r.y)===void 0?null:{x:r.x,y:r.y}}function it(){let r=Ke();return i(H,{children:Array.from(r).map(e=>i(at,{id:e},e))})}const xe=.02;function dt(){let{id:r}=u.exports.useContext($),e=he(r),t=P(),s=u.exports.useCallback(n=>{t.dispatch(a.CanvasTransform,{payload:n})},[r]),o=u.exports.useCallback(n=>{t.dispatch(a.DragModeChange,{payload:n})},[r]);return x("div",{style:{display:"inline-block"},children:[x("label",{children:[i("input",{type:"radio",name:"dragMode",value:"drag",checked:e.dragMode==="drag",onChange:n=>o(n.target.value)}),"Drag"]}),x("label",{children:[i("input",{type:"radio",name:"dragMode",value:"connect",checked:e.dragMode==="connect",onChange:n=>o(n.target.value)}),"Connect"]}),x("span",{children:[i("button",{onClick:()=>s({translateX:e.translateX,translateY:e.translateY,scale:e.scale-xe}),children:"-"}),x("button",{children:[e.scale*100|0,"%"]}),i("button",{onClick:()=>s({translateX:e.translateX,translateY:e.translateY,scale:e.scale+xe}),children:"+"}),i("button",{onClick:()=>s({translateX:0,translateY:0,scale:1}),children:"Reset"}),i("button",{onClick:()=>t.dispatch(a.ZoomToFit),children:"Zoom to fit"})]})]})}function lt(){let r=P();return B(r.undoStack,r.redoStack),x("div",{style:{display:"inline-block"},children:[i("button",{disabled:r.undoStack.length===0,onClick:()=>r.dispatch(a.Undo),children:"Undo"}),i("button",{disabled:r.redoStack.length===0,onClick:()=>r.dispatch(a.Redo),children:"Redo"})]})}function ct(){let r=P();return x("div",{style:{position:"absolute",top:0,left:0,display:"flex",justifyContent:"center"},children:[i("button",{onClick:()=>r.dispatch(a.RecalculateGraphLayout),children:"Calculate Layout"}),i("button",{onClick:()=>{let e=prompt("Node id")||"node-id-"+Date.now(),t=je({id:e});r.dispatch(a.CreateNode,{payload:t,undo:()=>r.dispatch(a.DeleteNode,{payload:e})})},children:"Create Node"}),i("button",{onClick:()=>r.dispatch(a.Clear),children:"Clear"}),i("button",{onClick:()=>{let e={backgroundGrid:"dot"};r.dispatch(a.UpdateWorkspaceConfig,{payload:e})},children:"Grid Dot"}),i("button",{onClick:()=>{let e={backgroundGrid:"checker"};r.dispatch(a.UpdateWorkspaceConfig,{payload:e})},children:"Grid Checker"}),i("button",{onClick:()=>{let e={backgroundGrid:"none"};r.dispatch(a.UpdateWorkspaceConfig,{payload:e})},children:"No Grid"}),i(lt,{}),i(dt,{})]})}function ht(){let{id:r}=u.exports.useContext($),{_store:{state:e,config:t,graph:s,mousePos:o},undoStack:n,redoStack:d}=P();return Re(e,t,s,o),i(Ie,{data:{id:r,mousePos:o,config:t,state:e,undoStack:n,redoStack:d,graph:s},hideRoot:!0,shouldExpandNode:([h],p,l)=>!(h==="nodes"||h==="edges"||h==="undoStack"||h==="redoStack"||l>2)})}const ut=({children:r,width:e,height:t})=>{let s=u.exports.useRef(null),{id:o}=u.exports.useContext($),n=ce(o),[d,h]=u.exports.useState(!1),p=P(),l=u.exports.useCallback($e(g=>{let k={x:g.clientX,y:g.clientY};p.dispatch(a.MouseMove,{payload:k})},10),[o]);return u.exports.useEffect(()=>{let g=()=>{if(!s.current)return;let k={workspaceWidth:s.current.offsetWidth|1024,workspaceHeight:s.current.offsetHeight|768};p.dispatch(a.UpdateWorkspaceConfig,{payload:k}),p.dispatch(a.ZoomToFit)};return window.addEventListener("resize",g),g(),()=>window.removeEventListener("resize",g)},[]),x("div",{ref:s,className:G["scraph-wrapper"],style:{width:e,height:t},onMouseMove:l,children:[r,n.devMode&&x(H,{children:[i(ct,{}),i(Oe,{placement:"right",width:"25vw",onHandleClick:()=>h(!d),open:d,showMask:!1,handler:i("div",{className:"drawer-handle",children:"\u{1F41E}"}),getContainer:()=>s.current,contentWrapperStyle:{backgroundColor:"rgb(0, 43, 54)"},children:d&&i(ht,{})})]})]})},S=16;function Q({id:r,color:e}){return i("marker",{id:r,viewBox:`0 -${S/2} ${S} ${S}`,refX:`${S-3}`,markerWidth:`${S}`,markerHeight:`${S}`,orient:"auto",markerUnits:"userSpaceOnUse",children:i("path",{d:`M0,-${S/2}L${S},0L0,${S/2}`,width:`${S}`,height:`${S}`,style:{fill:e||"#666"}})})}function be({id:r,dx:e=0,dy:t=0,stdDeviation:s=4,floorColor:o,floodOpacity:n=1}){return i("filter",{id:r,children:i("feDropShadow",{dx:e,dy:t,stdDeviation:s,floodColor:o,floodOpacity:n})})}function pt(){return x("pattern",{id:"grid-checker",x:"0",y:"0",width:"200",height:"200",patternUnits:"userSpaceOnUse",children:[i("rect",{className:"checker",x:"0",y:"0",width:"100",height:"100",fill:"#efefef"}),i("rect",{className:"checker",x:"100",y:"100",width:"100",height:"100",fill:"#efefef"})]})}function gt(){return x("pattern",{id:"grid-dot",width:"50",height:"50",patternUnits:"userSpaceOnUse",children:[i("circle",{className:"circle",cx:"0",cy:"0",r:"1.8",fill:"#ddd"}),i("circle",{className:"circle",cx:"50",cy:"0",r:"1.8",fill:"#ddd"}),i("circle",{className:"circle",cx:"50",cy:"50",r:"1.8",fill:"#ddd"}),i("circle",{className:"circle",cx:"0",cy:"50",r:"1.8",fill:"#ddd"})]})}function ft(){return x("defs",{children:[i(be,{id:"shadow1",dx:2,dy:2}),i(be,{id:"shadow2",dx:3,dy:3,stdDeviation:0,floorColor:"#558ED2"}),i(pt,{}),i(gt,{}),i(Q,{id:"arrow-head"}),i(Q,{id:"arrow-head-hover",color:"#558ED2"}),i(Q,{id:"arrow-head-selected",color:"#a0df70"})]})}function yt(r,e,t){let s=A(e),o=s.select("g"),n=l=>{const g=l.transform;let k={scale:g.k,translateX:g.x,translateY:g.y,fromD3:!0};t.dispatch(a.CanvasTransform,{payload:k})},d=Ge().scaleExtent([t._store.config.minZoom||0,t._store.config.maxZoom||0]).on("zoom",n),h=(l,g)=>{if(!g)return;let{payload:{translateX:k,translateY:b,scale:E,fromD3:U}}=g,{scale:N,translateX:w,translateY:_}=t.getWorkspaceInfo(),f=de(k)?k:w,D=de(b)?b:_,c=E||N;if(U)o.attr("transform",`translate(${f}, ${D}) scale(${c})`);else{let y=le.translate(f,D).scale(c);d.transform(s,y)}},p=()=>{var g,k;let l=o.select("#graph-entity").node();if(l&&l.children.length>0&&l.getBBox){let b=l.getBBox(),E=t.getWorkspaceConfig();const U=(g=E.workspaceWidth)!=null?g:1024,N=(k=E.workspaceHeight)!=null?k:768,w=E.minZoom||0,_=E.maxZoom||2,f={k:(w+_)/2,x:0,y:0};if(b.width>0&&b.height>0){const c=b.width,y=b.height,C=b.x+b.width/2,m=b.y+b.height/2;f.k=.9/Math.max(c/U,y/N),f.k<w?f.k=w:f.k>_&&(f.k=_),f.x=U/2-f.k*C,f.y=N/2-f.k*m}const D=le.translate(f.x,f.y).scale(f.k);s.transition().duration(500).call(d.transform,D)}};return t.subscribe(a.CanvasTransform,h),t.subscribe(a.ZoomToFit,p),s.call(d),()=>{t.unsubscribe(a.CanvasTransform,h),t.unsubscribe(a.ZoomToFit,p)}}const $=Le.createContext({id:"default"}),mt=({id:r,renderNode:e,readonly:t=!1,width:s="100%",height:o="100%"})=>{let n=u.exports.useRef(null),d=u.exports.useMemo(()=>ge(r),[r]);return u.exports.useEffect(()=>{d.setReadonly(t)},[t]),u.exports.useEffect(()=>yt(r,n.current,d),[r]),i($.Provider,{value:{id:r},children:i(ut,{width:s,height:o,children:x("svg",{className:G["scraph-canvas"],ref:n,children:[i(ft,{}),x("g",{children:[i(Ve,{}),x("g",{id:"graph-entity",children:[i(it,{}),i(nt,{renderNode:e})]})]})]})})})};Pe({enforceActions:"never"});function xt(){return i("div",{className:"App",children:i("div",{className:"workspace-wrapper",children:i(mt,{id:"scraph-demo",readonly:!1})})})}Ze.render(i(xt,{}),document.getElementById("root"));
